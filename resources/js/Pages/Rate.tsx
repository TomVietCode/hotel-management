import DataTable, { Column } from "@/Components/DataTable";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Pill from "@/Components/ui/Pill";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

interface Rate {
  id: number;
  room_type: string;
  cancellation_policy: string;
  price: number;
  total_rooms: number;
  available_rooms: number;
}

export default function Rate({ rates }: { rates: Rate[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    room_type: "",
    cancellation_policy: "strict",
    price: "",
    total_rooms: ''
  });
  
  const columns: Column<Rate>[] = [
    { header: "Loại phòng", accessor: "room_type" },
    { header: "Chính sách hủy", accessor: "cancellation_policy" },
    {
      header: "Giá (VND)",
      accessor: (rate: Rate) => `${Number(rate.price).toLocaleString()}`,
    },
    {
      header: "Phòng trống",
      accessor: (rate: Rate) => {
        return (
          <Pill className="text-sm">
            {rate.total_rooms}/{rate.total_rooms}
          </Pill>
        );
      },
    },
  ];

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route("rates.store"), {
      onSuccess: () => {
        reset();
        setIsModalOpen(false);
      }
    });
  };
  const policyMap: Record<string, string> = {
    "strict": "Nghiêm ngặt",
    "flexible": "Linh hoạt",
    "non_refundable": "Không hoàn tiền"
  }
  const newRates = rates.map(rate => ({...rate, cancellation_policy: policyMap[rate.cancellation_policy]}))
  return (
    <AuthenticatedLayout>
      <Head title="Giá phòng" />

      <div className="mb-6 mx-3">
        {/* Actions buttons */}
        <div className="flex justify-end mr-4 mb-8">
          <PrimaryButton onClick={() => setIsModalOpen(true)}>
            Thêm giá phòng
          </PrimaryButton>
        </div>

        {/* Table */}
        <DataTable
          data={newRates}
          columns={columns}
          actionButton={true}
        ></DataTable>

        {/* Modal */}
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={submit} className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Thêm giá phòng mới
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
              <InputLabel htmlFor="price" value="Giá phòng (VND)" />
              <TextInput
                id="price"
                type="number"
                className={`mt-1 block w-full ${errors.price ? "border-red-500" : ""}`}
                value={data.price}
                onChange={(e) => setData("price", e.target.value)}
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
                value={data.total_rooms}
                onChange={(e) => setData("total_rooms", e.target.value)}
              />
              <div className="min-h-5 mt-2">
                <InputError message={errors.total_rooms} />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <PrimaryButton disabled={processing} className="ml-4">
                Thêm mới
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
