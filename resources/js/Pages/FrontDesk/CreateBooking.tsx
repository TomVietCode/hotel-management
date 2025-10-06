import RoomSearchCriteria from "@/Components/FrontDesk/RoomSearchCriteria";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function CreateBooking() {
  return (
    <AuthenticatedLayout>
      <Head title="Tạo Booking" />
      <RoomSearchCriteria />
    </AuthenticatedLayout>
  );
}
