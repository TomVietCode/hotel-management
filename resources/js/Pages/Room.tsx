import DataTable, { Column } from "@/Components/DataTable";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Toast from "@/Components/ui/Notification";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { disPlayRoomNumber } from "@/utils";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

interface Room {
  id: number;
  room_number: number;
  bed_type: string;
  floor: number;
  facilities: string;
  status: string;
  rate_id: number;
  rate?: {
    id: number;
    room_type: string;
  };
}

interface Rate {
  id: number;
  room_type: string;
  available_rooms: number;
}

interface Props {
  rooms: {
    data: Room[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
  rates: Rate[];
  filter: string;
}

const defaultFacilities = [
  "Điều hoà",
  "Bếp",
  "Khăn",
  "Bồn tắm",
  "TV",
  "WiFi",
  "Quầy bar",
  "Ban công",
];

export default function Room({ rooms, rates, filter }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [customFacility, setCustomFacility] = useState("");

  const {
    data,
    setData,
    post,
    patch,
    delete: destroy,
    processing,
    errors,
    reset,
  } = useForm({
    id: 0,
    room_number: "",
    bed_type: "single",
    floor: "",
    facilities: "",
    rate_id: "",
    status: "available",
  });

  const columns: Column<Room>[] = [
    {
      header: "Số phòng",
      accessor: (room: Room) => disPlayRoomNumber(room.room_number, room.floor),
    },
    {
      header: "Loại giường",
      accessor: (room: Room) => {
        const bedTypeMap: Record<string, string> = {
          single: "Giường đơn",
          double: "Giường đôi",
          triple: "Ba giường",
        };
        return bedTypeMap[room.bed_type] || room.bed_type;
      },
    },
    { header: "Tầng", accessor: "floor" },
    {
      header: "Tiện ích",
      accessor: (room: Room) => (
        <div className="max-w-xs " title={room.facilities}>
          {room.facilities || "Không có"}
        </div>
      ),
    },
    {
      header: "Trạng thái",
      accessor: (room: Room) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          available: { text: "Trống", color: "bg-green-100 text-green-800" },
          booked: { text: "Đã đặt", color: "bg-red-100 text-red-800" },
          reserved: { text: "Đã giữ", color: "bg-yellow-100 text-yellow-800" },
          blocked: {
            text: "Không khả dụng",
            color: "bg-gray-100 text-gray-800",
          },
        };
        const status = statusMap[room.status] || {
          text: room.status,
          color: "bg-gray-100 text-gray-800",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-sm ${status.color}`}>
            {status.text}
          </span>
        );
      },
    },
  ];

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const facilitiesString = selectedFacilities.join(", ");
    const finalData = { ...data, facilities: facilitiesString };
    setData(finalData);
    if (!isEdit) {
      post(route("rooms.store"), {
        onSuccess: () => {
          Toast.success("Thêm phòng thành công");
          reset();
          setSelectedFacilities([]);
          setIsModalOpen(false);
        },
      });
    } else {
      patch(route("rooms.update", { room: data.id }), {
        onSuccess: () => {
          Toast.success("Cập nhật phòng thành công");
          reset();
          setSelectedFacilities([]);
          setIsModalOpen(false);
        },
      });
    }
  };

  const openCreateModal = () => {
    reset();
    setSelectedFacilities([]);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const editRoom = (room: Room) => {
    setData({
      id: room.id,
      room_number: String(room.room_number),
      bed_type: room.bed_type,
      floor: String(room.floor),
      facilities: room.facilities || "",
      rate_id: String(room.rate_id),
      status: room.status,
    });

    // Set selected facilities from room data
    if (room.facilities) {
      setSelectedFacilities(
        room.facilities.split(", ").filter((f) => f.trim())
      );
    } else {
      setSelectedFacilities([]);
    }

    setIsEdit(true);
    setIsModalOpen(true);
  };

  const deleteRoom = (room: Room) => {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa phòng ${disPlayRoomNumber(
          room.room_number,
          room.floor
        )}?`
      )
    ) {
      destroy(route("rooms.destroy", { room: room.id }), {
        onSuccess: () => {
          Toast.success("Xóa phòng thành công");
        },
        onError: () => {
          Toast.error("Xóa phòng thất bại");
        },
      });
    }
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  const addCustomFacility = () => {
    if (
      customFacility.trim() &&
      !selectedFacilities.includes(customFacility.trim())
    ) {
      setSelectedFacilities((prev) => [...prev, customFacility.trim()]);
      setCustomFacility("");
    }
  };

  const getFilterCounts = () => {
    const total = rooms.data.length;
    const available = rooms.data.filter(
      (room) => room.status === "available"
    ).length;
    const booked = rooms.data.filter((room) =>
      ["booked", "reserved"].includes(room.status)
    ).length;
    return { total, available, booked };
  };

  const { total, available, booked } = getFilterCounts();

  return (
    <AuthenticatedLayout>
      <Head title="Quản lý phòng" />

      <div className="mb-6 mx-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {/* Filter buttons */}
          <div className="flex gap-4">
            <Link
              href={route("rooms.index")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả({total})
            </Link>
            <Link
              href={route("rooms.index", { filter: "available" })}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === "available"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Phòng trống({available})
            </Link>
            <Link
              href={route("rooms.index", { filter: "booked" })}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === "booked"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Phòng đã đặt({booked})
            </Link>
          </div>

          <PrimaryButton onClick={openCreateModal}>Thêm phòng</PrimaryButton>
        </div>

        {/* Table */}
        <DataTable
          data={rooms.data}
          columns={columns}
          onEdit={editRoom}
          onDelete={deleteRoom}
        />

        {/* Pagination */}
        {rooms.last_page > 1 && (
          <div className="flex justify-center mt-6 fixed bottom-6 right-4">
            <nav className="flex space-x-2">
              {rooms.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || "#"}
                  className={`px-3 py-2 text-sm rounded ${
                    link.active
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } ${!link.url ? "cursor-not-allowed opacity-50" : ""}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </nav>
          </div>
        )}

        {/* Modal */}
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={submit} className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {isEdit ? "Sửa phòng" : "Thêm phòng mới"}
            </h2>

            {/* Loại phòng & Số phòng */}
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <InputLabel htmlFor="rate_id" value="Loại phòng" />
                <select
                  id="rate_id"
                  className={`mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm ${
                    errors.rate_id ? "border-red-500" : ""
                  }`}
                  value={data.rate_id}
                  onChange={(e) => setData("rate_id", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Chọn loại phòng
                  </option>
                  {rates.map((rate) => (
                    <option
                      key={rate.id}
                      value={rate.id}
                      disabled={rate.available_rooms == 0}
                    >
                      {rate.room_type}
                    </option>
                  ))}
                </select>
                <div className="min-h-5 mt-2">
                  <InputError message={errors.rate_id} />
                </div>
              </div>
              <div className="flex-1">
                <InputLabel htmlFor="bed_type" value="Loại giường" />
                <select
                  id="bed_type"
                  className={`mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${
                    errors.bed_type ? "border-red-500" : ""
                  }`}
                  value={data.bed_type}
                  onChange={(e) => setData("bed_type", e.target.value)}
                  required
                >
                  <option value="single">Giường đơn</option>
                  <option value="double">Giường đôi</option>
                  <option value="triple">Ba giường</option>
                </select>
                <div className="min-h-5 mt-2">
                  <InputError message={errors.bed_type} />
                </div>
              </div>
            </div>

            {/* Loại giường & Tầng */}
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <InputLabel htmlFor="room_number" value="Phòng số" />
                <TextInput
                  id="room_number"
                  type="number"
                  className={`mt-1 block w-full ${
                    errors.room_number ? "border-red-500" : ""
                  }`}
                  value={data.room_number}
                  onChange={(e) => setData("room_number", e.target.value)}
                  required
                />
                <div className="min-h-5 mt-2">
                  <InputError message={errors.room_number} />
                </div>
              </div>
              <div className="flex-1">
                <InputLabel htmlFor="floor" value="Tầng" />
                <TextInput
                  id="floor"
                  type="number"
                  className={`mt-1 block w-full ${
                    errors.floor ? "border-red-500" : ""
                  }`}
                  value={data.floor}
                  onChange={(e) => setData("floor", e.target.value)}
                  required
                />
                <div className="min-h-5 mt-2">
                  <InputError message={errors.floor} />
                </div>
              </div>
            </div>

            {/* Tiện ích */}
            <div className="mt-4">
              <InputLabel value="Tiện ích" />

              {/* Danh sách tiện ích mặc định */}
              <div className="mt-2 grid grid-cols-2 gap-2">
                {defaultFacilities.map((facility) => (
                  <label key={facility} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFacilities.includes(facility)}
                      onChange={() => toggleFacility(facility)}
                      className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {facility}
                    </span>
                  </label>
                ))}
              </div>

              {/* Thêm tiện ích tùy chỉnh */}
              <div className="mt-4 flex gap-2">
                <TextInput
                  type="text"
                  placeholder="Thêm tiện ích khác..."
                  value={customFacility}
                  onChange={(e) => setCustomFacility(e.target.value)}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={addCustomFacility}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Thêm
                </button>
              </div>

              {/* Hiển thị tiện ích đã chọn */}
              {selectedFacilities.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Tiện ích đã chọn:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFacilities.map((facility, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        {facility}
                        <button
                          type="button"
                          onClick={() => toggleFacility(facility)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="min-h-5 mt-2">
                <InputError message={errors.facilities} />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <PrimaryButton disabled={processing}>
                {isEdit ? "Cập nhật" : "Thêm mới"}
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      </div>
    </AuthenticatedLayout>
  );
}
