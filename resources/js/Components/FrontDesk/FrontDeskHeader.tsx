import { Link } from "@inertiajs/react";

export default function FrontDeskHeader() {
  const tabs = [
    {
      key: "due_in",
      label: "Đã đặt phòng",
      color: "bg-warning-50 text-warning-400 border-warning-100",
    },
    {
      key: "checked_in",
      label: "Đã checkin",
      color: "bg-success-50 text-success-400 border-success-100",
    },
    {
      key: "checked_out",
      label: "Đã checkout",
      color: "bg-danger-50 text-danger-400 border-danger-100",
    },
  ];
  return (
    <div className="flex items-center justify-between mb-7 space-x-3">
      {/* status tabs */}
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <span
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-sm transition-colors border-[0.5px] ${tab.color} cursor-pointer`}
          >
            {tab.label}
          </span>
        ))}
      </div>
      <div className="flex space-x-2">
        <div className="flex items-center space-x-4">

        </div>
        <Link
          href="/front-desk/create-booking"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Tạo đặt phòng
        </Link>
      </div>
    </div>
  );
}