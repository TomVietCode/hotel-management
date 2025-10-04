import FrontDeskHeader from "@/Components/FrontDesk/FrontDeskHeader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { isToday } from "@/utils";
import { Head } from '@inertiajs/react';
import { useState } from "react";

// Types
interface Booking {
  id: number;
  guest_name: string;
  room_number: number;
  check_in: string;
  check_out: string;
  status: string;
  start_day: number;
  duration: number;
}

interface CalendarMonth {
  month: string;
  year: string;
  days: number;
  bookings: Booking[];
}

interface Props {
  calendarData: CalendarMonth[];
  currentMonth: string;
}

// Component để hiển thị selector tháng
const MonthSelector = ({ 
  calendarData, 
  selectedMonth, 
  setSelectedMonth 
}: { 
  calendarData: CalendarMonth[];
  selectedMonth: number;
  setSelectedMonth: (index: number) => void;
}) => {
  const monthNames: { [key: string]: string } = {
    'Jan': 'Tháng 1', 'Feb': 'Tháng 2', 'Mar': 'Tháng 3', 'Apr': 'Tháng 4',
    'May': 'Tháng 5', 'Jun': 'Tháng 6', 'Jul': 'Tháng 7', 'Aug': 'Tháng 8',
    'Sep': 'Tháng 9', 'Oct': 'Tháng 10', 'Nov': 'Tháng 11', 'Dec': 'Tháng 12',
  };

  return (
    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
      {calendarData.map((month, index) => (
        <button
          key={`${month.month}-${month.year}`}
          onClick={() => setSelectedMonth(index)}
          className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
            selectedMonth === index
              ? 'bg-primary-50 text-primary-600 border border-primary-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {monthNames[month.month]}
        </button>
      ))}
    </div>
  );
};

// Component để hiển thị lịch tháng được chọn
const MonthCalendar = ({ month }: { month: CalendarMonth }) => {
  if (!month) return null;
  // Sort bookings to avoid overlap
  const arrangeBookings = (bookings: Booking[]) => {
    const arranged = bookings.map((booking, index) => ({
      ...booking,
      row: Math.floor(index / 3), // Tối đa 3 booking trên 1 hàng
    }));
    return arranged;
  };
  console.log(month.bookings)
  const arrangedBookings = arrangeBookings(month.bookings);
  return (
    <div className="rounded-lg">
      {/* Grid container */}
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: `repeat(${month.days}, 1fr)`,
          minWidth: `${month.days * 80}px`
        }}
      >
        {/* Days Header */}
        {Array.from({ length: month.days }, (_, i) => (
          <div 
            key={i} 
            className={`text-center text-sm font-medium text-gray-600 py-2 rounded-full ${
              isToday(`${i+1}-${month.month}-${month.year}`)
                ? 'bg-primary-50 text-primary-600 border border-primary-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {i + 1}
          </div>
        ))}
        
        {/* Booking area */}
        <div 
          className="col-span-full relative min-h-[400px]"
        >
          {/* Divider */}
          {Array.from({ length: month.days - 1 }, (_, i) => ( 
            <div
              key={`divider-${i}`}
              className="absolute top-0 bottom-0 w-[0.5px] bg-primary-100"
              style={{
                left: `${((i + 1) / month.days) * 100}%`,
                zIndex: 1
              }}
            />
          ))}
          
          {/* Booking blocks */}
          {arrangedBookings.map((booking, index) => (
            <div
              key={booking.id}
              className={`absolute px-2 py-3 rounded-lg border-[0.5px] text-xs font-medium cursor-pointer hover:shadow-sm transition-shadow z-10 ${
                booking.status === 'confirmed' || booking.status === 'pending'
                  ? 'bg-warning-50 text-warning-400 border-warning-300'
                  : booking.status === 'checked_in'
                  ? 'bg-success-50 text-success-400 border-success-300'
                  : booking.status === 'checked_out'
                  ? 'bg-primary-50 text-primary-400 border-primary-300'
                  : 'bg-danger-50 text-danger-400 border-danger-300'
              }`}
              style={{
                top: `${20 + (index % 10) * 50}px`, // Sắp xếp theo hàng
                left: `${((booking.start_day - 1) / month.days) * 100}%`,
                width: `${(Math.min(booking.duration, month.days - booking.start_day + 1) / month.days) * 100}%`,
                maxWidth: `${(Math.min(booking.duration, month.days - booking.start_day + 1) / month.days) * 100}%`,
              }}
              title={`${booking.guest_name} - Phòng ${booking.room_number}`}  
            >
              <div className="truncate">
                {booking.guest_name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component chính
export default function FrontDeskIndex({ calendarData, currentMonth }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(0); // Selected month index
  

  return (
    <AuthenticatedLayout>     
      <Head title="Lịch đặt phòng" /> 
      <div className="py-6">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FrontDeskHeader />

          {/* Month Selector */}
          <MonthSelector 
            calendarData={calendarData}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />

          {/* Calendar */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <MonthCalendar month={calendarData[selectedMonth]} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
