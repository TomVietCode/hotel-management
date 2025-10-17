import FrontDeskHeader from "@/Components/FrontDesk/FrontDeskHeader";
import MonthCalendar from "@/Components/FrontDesk/MonthCalendar";
import MonthSelector from "@/Components/FrontDesk/MonthSelector";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CalendarMonth } from "@/types/front-desk";
import { Head } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

export default function FrontDeskIndex({ calendarData }: { calendarData: CalendarMonth[] }) {
  // Find current month index
  const getCurrentMonthIndex = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('en-US', { month: 'short' });
    const currentYear = currentDate.getFullYear().toString();
    
    const currentMonthIndex = calendarData.findIndex(
      month => month.month === currentMonth && month.year === currentYear
    );
    
    return currentMonthIndex >= 0 ? currentMonthIndex : 0;
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthIndex());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current date when component mounts or month changes
  useEffect(() => {
    if (calendarRef.current && calendarData[selectedMonth]) {
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentMonth = currentDate.toLocaleString('en-US', { month: 'short' });
      const currentYear = currentDate.getFullYear().toString();
      
      // Check if selected month is current month
      const isCurrentMonth = calendarData[selectedMonth].month === currentMonth && 
                             calendarData[selectedMonth].year === currentYear;
      
      if (isCurrentMonth) {
        // Calculate scroll position to center current day
        const totalDays = calendarData[selectedMonth].days;
        const dayWidth = 80; // Based on minWidth in MonthCalendar
        const containerWidth = calendarRef.current.clientWidth;
        const targetPosition = (currentDay - 1) * dayWidth - containerWidth / 2 + dayWidth / 2;
        
        // Smooth scroll to current day
        calendarRef.current.scrollTo({
          left: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
      }
    }
  }, [selectedMonth, calendarData]);

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
          <div 
            ref={calendarRef}
            className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <MonthCalendar month={calendarData[selectedMonth]} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
