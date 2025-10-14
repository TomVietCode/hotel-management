import DataTable, { Column } from "@/Components/DataTable";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Toast from "@/Components/ui/Notification";
import Pill, { PillColor } from "@/Components/ui/Pill";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

interface Rate {
  id: number;
  room_type: string;
  cancellation_policy: string;
  displayPolicy?: string | null;
  price: number;
  total_rooms: number;
  available_rooms: number;
}

export default function Rate({ rates }: { rates: Rate[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false)
  const { data, setData, post, patch, delete: destroy, processing, errors, clearErrors, reset } = useForm({
    id: 0,
    room_type: "",
    cancellation_policy: "strict",
    price: 0,
    total_rooms: 0
  });
  
  const columns: Column<Rate>[] = [
    { header: "Loại phòng", accessor: "room_type" },
    { header: "Chính sách hủy", accessor: (rate: Rate) => rate.displayPolicy },
    {
      header: "Giá (VND)",
      accessor: (rate: Rate) => `${Number(rate.price).toLocaleString()}`,
    },
    {
      header: "Phòng còn lại",
      accessor: (rate: Rate) => {
        var color: PillColor = rate.available_rooms == rate.total_rooms ? 'primary' : (rate.available_rooms == 0 ? 'red' : 'yellow')
        var text = rate.available_rooms == 0 ? 'Full' : `${rate.available_rooms}/${rate.total_rooms}`
        return (
          <Pill className="text-sm" color={color}>
            {text}
          </Pill>
        );
      },
    },
  ];


  const policyMap: Record<string, string> = {
    "strict": "Nghiêm ngặt",
    "flexible": "Linh hoạt",
    "non_refundable": "Không hoàn tiền"
  }

  const newRates = rates.map(rate => ({...rate, displayPolicy: policyMap[rate.cancellation_policy]}))

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!isEdit) {
      post(route("rates.store"), {
        onSuccess: () => {
          Toast.success("Thêm giá phòng thành công");
          reset();
          setIsModalOpen(false);
        },
      });
    } else {
      patch(route("rates.update", { rate: data.id }), {
        onSuccess: () => {
          Toast.success("Cập nhật giá phòng thành công");
          reset();
          setIsModalOpen(false);
        },
        onError: () => {
          Toast.error("Cập nhật giá phòng thất bại");
        }
      });
    }
  };

  const editRate = (rate: Rate) => {
    clearErrors()
    setData({
      id: rate.id,
      room_type: rate.room_type,
      cancellation_policy: rate.cancellation_policy,
      price: rate.price,
      total_rooms: rate.total_rooms
    });
    setIsEdit(true)
    setIsModalOpen(true);
  }

  const deleteRate = (rate: Rate) => {
    if (confirm(`Bạn có chắc chắn muốn xóa giá phòng ${rate.room_type}?`)) {
      destroy(route("rates.destroy", { rate: rate.id }), {
        onSuccess: () => {
          Toast.success("Xóa thành công");
            reset();
          }
        });
    }
  }

  return (
    <AuthenticatedLayout>
      <Head title="Giá phòng" />

      <div className="mb-6 mx-3">
        {/* Actions buttons */}
        <div className="flex justify-end mr-4 mb-8">
          <PrimaryButton onClick={() => (setIsModalOpen(true), setIsEdit(false), reset(), clearErrors())}>
            Thêm giá phòng
          </PrimaryButton>
        </div>

        {/* Table */}
        <DataTable
          data={newRates}
          columns={columns}
          onEdit={editRate}
          onDelete={deleteRate}
        ></DataTable>

        {/* Modal */}
        <Modal show={isModalOpen} onClose={() => (setIsModalOpen(false))}>
          <form onSubmit={submit} className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {isEdit ? "Sửa giá phòng" : "Thêm giá phòng"}
            </h2>

            <div className="mt-1">
              <InputLabel htmlFor="room_type" value="Loại phòng" />
              <TextInput
                id="room_type"
                type="text"
                className={`mt-1 block w-full ${errors.room_type ? "border-red-500" : ""}`}
                value={data.room_type}
                onChange={(e) => setData("room_type", e.target.value)}
              />
              <div className="min-h-5 mt-2">
                <InputError message={errors.room_type} />
              </div>
            </div>

            <div className="mt-1">
              <InputLabel
                htmlFor="cancellation_policy"
                value="Chính sách hủy"
              />
              <select
                id="cancellation_policy"
                className={`mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${errors.cancellation_policy ? "border-red-500" : ""}`}
                value={data.cancellation_policy}
                onChange={(e) => setData("cancellation_policy", e.target.value)}
              >
                <option value="strict">Nghiêm ngặt</option>
                <option value="flexible">Linh hoạt</option>
                <option value="non_refundable">Không hoàn tiền</option>
              </select>
              <div className="min-h-5 mt-2">
                <InputError
                message={errors.cancellation_policy}
                />
              </div>
            </div>

            <div className="mt-1">
              <InputLabel htmlFor="price" value="Giá 1 đêm (VND)" />
              <TextInput
                id="price"
                type="text"
                inputMode="numeric"
                className={`mt-1 block w-full ${errors.price ? "border-red-500" : ""}`}
                value={
                  data.price !== undefined && data.price !== null && data.price !== 0
                    ? Number(data.price).toLocaleString()
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^0-9]/g, "");
                  setData("price", rawValue ? Number(rawValue) : 0);
                }}
              />
              <div className="min-h-5 mt-2">
                <InputError message={errors.price} />
              </div>
            </div>

            <div className="mt-1">
              <InputLabel htmlFor="total_rooms" value="Tổng số phòng" />
              <TextInput
                id="total_rooms"
                type="number"
                className={`mt-1 block w-full ${errors.total_rooms ? "border-red-500" : ""}`}
                value={data.total_rooms || ""}
                onChange={(e) => setData("total_rooms", Number(e.target.value))}
              />
              <div className="min-h-5 mt-2">
                <InputError message={errors.total_rooms} />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <PrimaryButton disabled={processing} className="ml-4">
                {!isEdit ? "Thêm mới" : "Cập nhật"}
              </PrimaryButton>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 ml-3"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AuthenticatedLayout>
  );
}
