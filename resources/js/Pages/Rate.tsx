import DataTable, { Column } from "@/Components/DataTable";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

interface Rate {
  id: number;
  room_type: string;
  cancellation_policy: string;
  price: number;
  total_rooms: number;
  available_rooms: number;
}

export default function Rate({ rates }: { rates: Rate[] }) {
  const columns: Column<Rate>[] = [
    {header: "Loại phòng", accessor: "room_type"},
    {header: "Chính sách hủy", accessor: "cancellation_policy"},
    {header: "Giá", accessor: (rate: Rate) => `$ ${rate.price.toLocaleString()}`},
    {header: "Số phòng còn lại", accessor: "available_rooms"},
  ]
  return (
    <AuthenticatedLayout>
      <Head title="Giá phòng" />

      <div className="mb-6 mx-3">
        {/* Actions buttons */}
        <div className="flex justify-end mr-4">
          <PrimaryButton>
            Thêm giá phòng
          </PrimaryButton>
        </div>

        <DataTable data={rates} columns={columns}>
        </DataTable>
      </div>
    </AuthenticatedLayout>
  )
}