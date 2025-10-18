import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MetricCard from '@/Components/Dashboard/MetricCard';
import ChartCard from '@/Components/Dashboard/ChartCard';
import PieChart from '@/Components/Dashboard/PieChart';
import LineChart from '@/Components/Dashboard/LineChart';
import { getStatusText, getStatusColor } from '@/utils';

interface KeyMetrics {
  totalRooms: number;
  totalGuests: number;
  totalBookings: number;
  totalRevenue: number;
  availableRooms: number;
  occupiedRooms: number;
  currentGuests: number;
  todayCheckIns: number;
  todayCheckOuts: number;
}

interface ChartData {
  roomStatus: Array<{ name: string; y: number; color: string }>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  bookingStatus: Array<{ name: string; y: number; color: string }>;
  weeklyOccupancy: Array<{ date: string; occupancy: number }>;
}

interface PopularRoomType {
  room_type: string;
  bookings: number;
  price: number;
}

interface RecentBooking {
  id: number;
  booking_code: string;
  guest_name: string;
  room_number: string;
  check_in_date: string;
  status: string;
  total_amount: number;
}

interface Props {
  keyMetrics: KeyMetrics;
  charts: ChartData;
  popularRoomTypes: PopularRoomType[];
  recentBookings: RecentBooking[];
}

export default function Dashboard({ keyMetrics, charts, popularRoomTypes, recentBookings }: Props) {
  const occupancyRate = keyMetrics.totalRooms > 0 
    ? ((keyMetrics.occupiedRooms / keyMetrics.totalRooms) * 100).toFixed(1)
    : '0';

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Tổng số phòng"
              value={keyMetrics.totalRooms}
              color="blue"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />

            <MetricCard
              title="Tổng khách hàng"
              value={keyMetrics.totalGuests}
              color="green"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />

            <MetricCard
              title="Tổng booking tháng"
              value={keyMetrics.totalBookings}
              color="purple"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />

            <MetricCard
              title="Doanh thu tháng"
              value={new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(keyMetrics.totalRevenue)}
              color="yellow"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
            />
          </div>

          {/* Current Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <MetricCard
              title="Phòng trống"
              value={keyMetrics.availableRooms}
              color="green"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
            />

            <MetricCard
              title="Phòng đã đặt"
              value={keyMetrics.occupiedRooms}
              color="red"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            />

            <MetricCard
              title="Tỷ lệ lấp đầy"
              value={`${occupancyRate}%`}
              color="indigo"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />

            <MetricCard
              title="Check-in hôm nay"
              value={keyMetrics.todayCheckIns}
              color="blue"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              }
            />

            <MetricCard
              title="Check-out hôm nay"
              value={keyMetrics.todayCheckOuts}
              color="yellow"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Phân bố trạng thái phòng">
              <PieChart data={charts.roomStatus} />
            </ChartCard>

            <ChartCard title="Phân bố trạng thái booking">
              <PieChart data={charts.bookingStatus} />
            </ChartCard>

            <ChartCard title="Doanh thu 6 tháng gần đây">
              <LineChart data={charts.monthlyRevenue} type="revenue" />
            </ChartCard>

            <ChartCard title="Tỷ lệ lấp đầy 7 ngày qua">
              <LineChart data={charts.weeklyOccupancy} type="occupancy" />
            </ChartCard>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Room Types */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loại phòng phổ biến</h3>
              <div className="space-y-4">
                {popularRoomTypes.map((roomType, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{roomType.room_type}</p>
                      <p className="text-sm text-gray-600">{roomType.bookings} lượt đặt</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(roomType.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking gần đây</h3>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{booking.guest_name}</p>
                      <p className="text-sm text-gray-600">
                        {booking.booking_code} • Phòng #{booking.room_number}
                      </p>
                      <p className="text-xs text-gray-500">{booking.check_in_date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(booking.total_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}