import FrontDeskHeader from "@/Components/FrontDesk/FrontDeskHeader";
import MonthCalendar from "@/Components/FrontDesk/MonthCalendar";
import MonthSelector from "@/Components/FrontDesk/MonthSelector";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CalendarMonth } from "@/types/front-desk";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function FrontDeskIndex({ calendarData }: { calendarData: CalendarMonth[] }) {
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
