import { Booking, CalendarMonth } from "@/types/front-desk";
import { disPlayRoomNumber, isToday } from "@/utils";

export default function MonthCalendar ({ month }: { month: CalendarMonth }) {
  if (!month) return null;
  // Sort bookings to avoid overlap
  const arrangeBookings = (bookings: Booking[]) => {
    const sortedBookings = [...bookings].sort((a, b) => {
      // Sort by check-in date first
      const dateCompare = new Date(a.check_in).getTime() - new Date(b.check_in).getTime();
      if (dateCompare !== 0) return dateCompare;
      
      // If same date, sort by duration (shorter first)
      return a.duration - b.duration;
    });
  
    // Array to track rows and sorted bookings
    const rows: { 
      startDay: number; 
      endDay: number; 
      bookingId: number 
    }[][] = [];
    
    const result = sortedBookings.map(booking => {
      const startDay = booking.start_day;
      const endDay = startDay + booking.duration - 1;
      
      let rowIndex = 0;
      let canFit = false;
      
      // Check each row to see if the booking can fit
      while (!canFit && rowIndex < rows.length) {
        const currentRow = rows[rowIndex];
        canFit = true;
        
        // Check if the booking overlaps with any existing booking in the row
        for (const existingBooking of currentRow) {
          if (!(endDay < existingBooking.startDay || startDay > existingBooking.endDay)) {
            canFit = false;
            break;
          }
        }
        
        if (!canFit) {
          rowIndex++;
        }
      }
      
      // If no suitable row is found, create a new row
      if (!canFit) {
        rows.push([]);
        rowIndex = rows.length - 1;
      }
      
      // Add booking to the selected row
      rows[rowIndex].push({
        startDay,
        endDay,
        bookingId: booking.id
      });

      return {
        ...booking,
        row: rowIndex
      };
    });
    
    return result;
  };
  const arrangedBookings = arrangeBookings(month.bookings);

  return (
    <div className="rounded-lg">
      {/* Grid container */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${month.days}, 1fr)`,
          minWidth: `${month.days * 80}px`,
        }}
      > 
        {/* Days Header */}
        {Array.from({ length: month.days }, (_, i) => (
          <div
            key={i}
            className={`text-center text-sm font-medium text-gray-600 py-2 rounded-full ${
              isToday(`${i + 1}-${month.month}-${month.year}`)
                ? "bg-primary-50 text-primary-600 border border-primary-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </div>
        ))}

        {/* Booking area */}
        <div
          className={`col-span-full relative `}
          style={{ minHeight: `${20 + 8 * 50}px` }}
        >
          {/* Divider */}
          {Array.from({ length: month.days - 1 }, (_, i) => (
            <div
              key={`divider-${i}`}
              className="absolute top-0 bottom-0 w-[0.5px] bg-primary-100"
              style={{
                left: `${((i + 1) / month.days) * 100}%`,
                zIndex: 1,
              }}
            />
          ))}

          {/* Booking blocks */}
          {arrangedBookings.map((booking, index) => (
            <div
              key={booking.id}
              className={`absolute px-2 py-3 rounded-lg border-[0.5px] text-xs font-medium cursor-pointer hover:shadow-sm transition-shadow z-10 ${
                booking.status === "confirmed" || booking.status === "pending"
                  ? "bg-warning-50 text-warning-400 border-warning-100"
                  : booking.status === "checked_in"
                  ? "bg-success-50 text-success-400 border-success-100"
                  : booking.status === "checked_out" &&
                    "bg-danger-50 text-danger-400 border-danger-100"
              } group`}
              style={{
                top: `${10 + booking.row * 50}px`, // Sắp xếp theo hàng
                left: `${((booking.start_day - 1) / month.days) * 100}%`,
                width: `${
                  (Math.min(
                    booking.duration,
                    month.days - booking.start_day + 1
                  ) /
                    month.days) *
                  100
                }%`,
                maxWidth: `${
                  (Math.min(
                    booking.duration,
                    month.days - booking.start_day + 1
                  ) /
                    month.days) *
                  100
                }%`,
              }}
            >
              <div className="truncate">
                {booking.guest_name}-
                {disPlayRoomNumber(booking.room_number, booking.floor)}
              </div>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-50 px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {booking.guest_name}-
                {disPlayRoomNumber(booking.room_number, booking.floor)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};