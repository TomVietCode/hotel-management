import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable, { Column } from "@/Components/DataTable";
import BookingDetailsModal from "@/Components/Guest/BookingDetailsModal";
import { getStatusColor, getStatusText } from "@/utils";
import { GuestBookingData } from "@/types/interfaces";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedBookings {
  data: GuestBookingData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: PaginationLink[];
}

interface Props {
  bookings: PaginatedBookings;
  filters: {
    status?: string;
    search?: string;
  };
}

export default function GuestIndex({ bookings, filters }: Props) {
  const [selectedBooking, setSelectedBooking] =
    useState<GuestBookingData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    status: filters.status || '',
    search: filters.search || '',
  });

  const columns: Column<GuestBookingData>[] = [
    {
      header: "Mã đặt phòng",
      accessor: "booking_code",
    },
    {
      header: "Tên",
      accessor: "guest_name",
    },
    {
      header: "Số phòng",
      accessor: (booking: GuestBookingData) => `#${booking.room_number}`,
    },
    {
      header: "Tổng tiền",
      accessor: (booking: GuestBookingData) =>
        `${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(booking.total_amount)}`,
    },
    {
      header: "Trạng thái",
      accessor: (booking: GuestBookingData) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            booking.status
          )}`}
        >
          {getStatusText(booking.status)}
        </span>
      ),
    },
  ];

  const handleRowClick = (booking: GuestBookingData) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...currentFilters, [filterType]: value };
    setCurrentFilters(newFilters);
    
    // Apply filters immediately
    router.get(route('guest.index'), newFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('guest.index'), currentFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handlePageChange = (url: string) => {
    router.get(url, {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setCurrentFilters({ status: '', search: '' });
    router.get(route('guest.index'), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Guest Management" />

      <div className="mx-3 mb-6">
        <div className="text-gray-900 shadow-sm overflow-hidden p-1">
          {/* Header with Filters */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
              <select
                value={currentFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="not_checked_in">Chưa Check-in</option>
                <option value="not_checked_out">Chưa Check-out</option>
                <option value="checked_out">Đã Check-out</option>
                <option value="late_checkout">Check-out muộn</option>
              </select>
              
              {(currentFilters.status || currentFilters.search) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo số phòng"
                  value={currentFilters.search}
                  onChange={(e) => setCurrentFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="rounded-md border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* Data Table */}
          <DataTable
            data={bookings.data}
            columns={columns}
            onRowClick={handleRowClick}
          />

          {/* Pagination */}
          {bookings.last_page > 1 && (
            <div className="mt-6 flex items-center justify-center">
              <nav className="flex items-center space-x-1">
                {bookings.links.map((link, index) => {
                  if (link.label.includes('Previous')) {
                    return (
                      <button
                        key={index}
                        onClick={() => link.url && handlePageChange(link.url)}
                        disabled={!link.url}
                        className="flex items-center space-x-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Trước</span>
                      </button>
                    );
                  }
                  
                  if (link.label.includes('Next')) {
                    return (
                      <button
                        key={index}
                        onClick={() => link.url && handlePageChange(link.url)}
                        disabled={!link.url}
                        className="flex items-center space-x-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Sau</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    );
                  }
                  
                  // Page numbers
                  if (!link.label.includes('...')) {
                    return (
                      <button
                        key={index}
                        onClick={() => link.url && handlePageChange(link.url)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          link.active
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                      >
                        {link.label}
                      </button>
                    );
                  }
                  
                  // Ellipsis
                  return (
                    <span key={index} className="px-3 py-2 text-sm text-gray-500">
                      ...
                    </span>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </AuthenticatedLayout>
  );
}