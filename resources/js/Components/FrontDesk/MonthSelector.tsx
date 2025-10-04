import { CalendarMonth } from "@/types/front-desk";
import { monthNames } from "@/utils";

export default function MonthSelector ({
  calendarData,
  selectedMonth,
  setSelectedMonth,
}: {
  calendarData: CalendarMonth[];
  selectedMonth: number;
  setSelectedMonth: (index: number) => void;
}) {
  return (
    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
      {calendarData.map((month, index) => (
        <button
          key={`${month.month}-${month.year}`}
          onClick={() => setSelectedMonth(index)}
          className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
            selectedMonth === index
              ? "bg-primary-50 text-primary-600 border border-primary-500"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {monthNames[month.month]}
        </button>
      ))}
    </div>
  );
};