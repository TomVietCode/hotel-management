import RoomSearchCriteria from "@/Components/FrontDesk/RoomSearchCriteria";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DataTable, { Column } from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import Toast from "@/Components/ui/Notification";
import { Rate, Room, Guest, RoomSearchCriteria as SearchCriteria } from "@/types/interfaces";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { disPlayRoomNumber, generateBookingCode, calculateBookingAmount } from "@/utils";

export default function CreateBooking({ rates }: { rates: Rate[] }) {
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const {
    data: guestData,
    setData: setGuestData,
    post,
    processing,
    errors,
    reset: resetGuestForm,
  } = useForm<{
    guest: Guest;
    room_id: number;
    check_in_date: string;
    check_out_date: string;
    booking_code: string;
    total_amount: number;
    adults: number;
    children: number;
    special_requests: string;
    notes: string;
  }>({
    guest: {
      full_name: '',
      email: '',
      phone: '',
      id_number: '',
      gender: 'male',
      date_of_birth: '',
    },
    room_id: 0,
    check_in_date: '',
    check_out_date: '',
    booking_code: '',
    total_amount: 0,
    adults: 1,
    children: 0,
    special_requests: '',
    notes: '',
  });

  const handleSearchResults = (rooms: Room[], criteria: SearchCriteria) => {
    setSearchResults(rooms);
    setSearchCriteria(criteria);
    setHasSearched(true);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Calculate pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = searchResults.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const refreshSearchResults = async () => {
    if (!searchCriteria) return;
    
    try {
      const response = await fetch(route('front-desk.search-rooms'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(searchCriteria),
      });

      if (response.ok) {
        const rooms = await response.json();
        handleSearchResults(rooms, searchCriteria);
      }
    } catch (error) {
      console.error('Refresh search error:', error);
    }
  };

  const handleRoomClick = (room: Room) => {
    if (!searchCriteria) return;
    
    setSelectedRoom(room);
    const bookingCode = generateBookingCode();
    const totalAmount = calculateBookingAmount(
      searchCriteria.check_in,
      searchCriteria.check_out,
      room.rate?.price || 0
    );

    setGuestData({
      ...guestData,
      room_id: room.id,
      check_in_date: searchCriteria.check_in,
      check_out_date: searchCriteria.check_out,
      booking_code: bookingCode,
      total_amount: totalAmount,
    });
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('front-desk.store-booking'), {
      onSuccess: (response) => {
        Toast.success('Đặt phòng thành công!');
        setIsBookingModalOpen(false);
        resetGuestForm();
        setSelectedRoom(null);
        // Refresh search results by re-running the search
        if (searchCriteria) {
          // Re-run the search to get updated results
          refreshSearchResults();
        }
      },
      onError: (errors) => {
        Toast.error('Đặt phòng thất bại. Vui lòng thử lại.');
      },
    });
  };

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
        <div className="max-w-xs" title={room.facilities}>
          {room.facilities || "Không có"}
        </div>
      ),
    },
    {
      header: "Loại phòng",
      accessor: (room: Room) => room.rate?.room_type || "N/A",
    },
    {
      header: "Giá/đêm",
      accessor: (room: Room) => {
        const price = room.rate?.price || 0;
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(price);
      },
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

  return (
    <AuthenticatedLayout>
      <Head title="Tạo Booking" />
      
      {/* Search Criteria */}
      <RoomSearchCriteria rates={rates} onSearchResults={handleSearchResults} />
      
      {/* Search Results */}
      <div className="py-1">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {!hasSearched ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">Không tìm thấy phòng hợp lệ</p>
                  <p className="text-sm mt-2">Vui lòng nhập tiêu chí tìm kiếm và nhấn "Tìm phòng"</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">Không tìm thấy phòng phù hợp</p>
                  <p className="text-sm mt-2">Thử thay đổi tiêu chí tìm kiếm</p>
                </div>
              ) : (
                <div>
                  <DataTable
                    data={currentResults}
                    columns={columns}
                    onRowClick={handleRoomClick}
                    onEdit={() => {}} // Disable edit for search results
                    onDelete={() => {}} // Disable delete for search results
                  />
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <nav className="flex space-x-2">
                        {/* Previous button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 text-sm rounded ${
                            currentPage === 1
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          &laquo;
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm rounded ${
                              page === currentPage
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        {/* Next button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-2 text-sm rounded ${
                            currentPage === totalPages
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          &raquo;
                        </button>
                      </nav>
                    </div>
                  )}
                  
                  {/* Results info */}
                  <div className="text-center mt-4 text-sm text-gray-600">
                    Hiển thị {startIndex + 1}-{Math.min(endIndex, searchResults.length)} trong tổng số {searchResults.length} phòng
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal show={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} maxWidth="4xl">
        <form onSubmit={handleBookingSubmit} className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Đặt phòng {selectedRoom && disPlayRoomNumber(selectedRoom.room_number, selectedRoom.floor)}
          </h2>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Room and Booking Info */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Thông tin đặt phòng</h3>
              {selectedRoom && searchCriteria && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Phòng:</span>
                      <span className="font-semibold">{disPlayRoomNumber(selectedRoom.room_number, selectedRoom.floor)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Loại phòng:</span>
                      <span>{selectedRoom.rate?.room_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Loại giường:</span>
                      <span>
                        {selectedRoom.bed_type === 'single' ? 'Giường đơn' : 
                         selectedRoom.bed_type === 'double' ? 'Giường đôi' : 'Ba giường'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Check-in:</span>
                      <span>{new Date(searchCriteria.check_in).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Check-out:</span>
                      <span>{new Date(searchCriteria.check_out).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Số đêm:</span>
                      <span>{Math.ceil((new Date(searchCriteria.check_out).getTime() - new Date(searchCriteria.check_in).getTime()) / (1000 * 60 * 60 * 24))} đêm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Giá/đêm:</span>
                      <span>{new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(selectedRoom.rate?.price || 0)}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">Tổng tiền:</span>
                      <span className="text-lg font-bold text-primary-600">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(guestData.total_amount)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Adults & Children in booking info */}
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <InputLabel htmlFor="adults" value="Số người lớn" />
                        <TextInput
                          id="adults"
                          type="number"
                          min="1"
                          max="10"
                          className="mt-1 block w-full"
                          value={guestData.adults}
                          onChange={(e) => setGuestData('adults', parseInt(e.target.value) || 1)}
                        />
                        <InputError message={errors.adults} className="mt-2" />
                      </div>
                      <div>
                        <InputLabel htmlFor="children" value="Số trẻ em" />
                        <TextInput
                          id="children"
                          type="number"
                          min="0"
                          max="10"
                          className="mt-1 block w-full"
                          value={guestData.children}
                          onChange={(e) => setGuestData('children', parseInt(e.target.value) || 0)}
                        />
                        <InputError message={errors.children} className="mt-2" />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests in booking info */}
                  <div className="mt-4">
                    <InputLabel htmlFor="special_requests" value="Yêu cầu đặc biệt" />
                    <textarea
                      id="special_requests"
                      rows={3}
                      className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                      value={guestData.special_requests}
                      onChange={(e) => setGuestData('special_requests', e.target.value)}
                      placeholder="Nhập yêu cầu đặc biệt (nếu có)..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Guest Information */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Thông tin khách hàng</h3>
              <div className="space-y-4">
            
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <InputLabel htmlFor="full_name" value="Họ và tên *" />
                    <TextInput
                      id="full_name"
                      type="text"
                      className="mt-1 block w-full"
                      value={guestData.guest.full_name}
                      onChange={(e) => setGuestData('guest', { ...guestData.guest, full_name: e.target.value })}
                      required
                    />
                    <InputError message={errors['guest.full_name']} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="email" value="Email *" />
                    <TextInput
                      id="email"
                      type="email"
                      className="mt-1 block w-full"
                      value={guestData.guest.email}
                      onChange={(e) => setGuestData('guest', { ...guestData.guest, email: e.target.value })}
                      required
                    />
                    <InputError message={errors['guest.email']} className="mt-2" />
                  </div>
                </div>

                {/* Phone & ID Number */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <InputLabel htmlFor="phone" value="Số điện thoại *" />
                    <TextInput
                      id="phone"
                      type="tel"
                      className="mt-1 block w-full"
                      value={guestData.guest.phone}
                      onChange={(e) => setGuestData('guest', { ...guestData.guest, phone: e.target.value })}
                      required
                    />
                    <InputError message={errors['guest.phone']} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="id_number" value="Số CCCD *" />
                    <TextInput
                      id="id_number"
                      type="text"
                      className="mt-1 block w-full"
                      value={guestData.guest.id_number}
                      onChange={(e) => setGuestData('guest', { ...guestData.guest, id_number: e.target.value })}
                      required
                    />
                    <InputError message={errors['guest.id_number']} className="mt-2" />
                  </div>
                </div>

                {/* Gender & Date of Birth */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <InputLabel htmlFor="gender" value="Giới tính *" />
                    <select
                      id="gender"
                      className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                      value={guestData.guest.gender}
                      onChange={(e) => setGuestData('guest', { ...guestData.guest, gender: e.target.value as 'male' | 'female' })}
                      required
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                    <InputError message={errors['guest.gender']} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="date_of_birth" value="Ngày sinh *" />
                    <TextInput
                      id="date_of_birth"
                      type="date"
                      className="mt-1 block w-full"
                      value={guestData.guest.date_of_birth}
                      onChange={(e) => setGuestData('guest', { ...guestData.guest, date_of_birth: e.target.value })}
                      required
                    />
                    <InputError message={errors['guest.date_of_birth']} className="mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
              onClick={() => setIsBookingModalOpen(false)}
            >
              Hủy
            </button>
            <PrimaryButton disabled={processing}>
              {processing ? 'Đang xử lý...' : 'Đặt phòng'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </AuthenticatedLayout>
  );
}
