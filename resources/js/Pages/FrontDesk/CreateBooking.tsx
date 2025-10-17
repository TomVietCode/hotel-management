import DataTable from "@/Components/DataTable";
import RoomSearchCriteria from "@/Components/FrontDesk/RoomSearchCriteria";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Rate, Room } from "@/types/interfaces";
import { Head, Link } from "@inertiajs/react";
import { roomColumns } from "../Room";
import { useState } from "react";
import CreateBookingModal from "@/Components/FrontDesk/CreateBookingModal";

interface Props {
  rates?: Rate[];
  searchResults?: any;
  searchCriteria?: any;
}

export default function CreateBooking({
  rates = [],
  searchResults,
  searchCriteria = {},
}: Props) {
  // get data form url queries
  const searchParams = new URLSearchParams(window.location.search);
  const checkInDate = searchParams.get('check_in_date');
  const checkOutDate = searchParams.get('check_out_date');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [data, setData] = useState<any>({});
  const handleRowClick = (room: Room) => {
    if(room.status == "booked") {
      return
    }
    setData({ 
      room: room,
      check_in_date: searchCriteria.check_in_date || checkInDate,
      check_out_date: searchCriteria.check_out_date || checkOutDate,
    })
    room.id && setIsBookingModalOpen(true);
  }
  return (
    <AuthenticatedLayout>
      <Head title="Tạo Booking" />
      <RoomSearchCriteria rates={rates} searchCriteria={searchCriteria} />

      <div className="py-5 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {searchResults?.data?.length > 0 ? (
          <div className="overflow-hidden shadow-md sm:rounded-lg">
            <DataTable
              data={searchResults.data}
              columns={roomColumns}
              onRowClick={handleRowClick}
            />

            {searchResults.last_page > 1 && (
              <div className="flex justify-center mt-6 fixed bottom-6 right-4">
                <nav className="flex space-x-2">
                  {searchResults.links.map((link: any, index: number) => (
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
          </div>
        ) : (
          <div className="text-center text-gray-500">Không có dữ liệu</div>
        )}
      </div>

      <CreateBookingModal
        isBookingModalOpen={isBookingModalOpen}
        setIsBookingModalOpen={setIsBookingModalOpen}
        data={data}
      />
    </AuthenticatedLayout>
  );
}
