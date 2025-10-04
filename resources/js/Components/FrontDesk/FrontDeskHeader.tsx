import { Link } from "@inertiajs/react";

export default function FrontDeskHeader() {
  const tabs = [
    {
      key: "due_in",
      label: "Sắp nhận phòng",
      color: "bg-warning-50 text-warning-400",
    },
    {
      key: "checked_out",
      label: "Đã trả phòng",
      color: "bg-primary-50 text-primary-400",
    },
    {
      key: "due_out",
      label: "Sắp trả phòng",
      color: "bg-danger-50 text-danger-400",
    },
    {
      key: "checked_in",
      label: "Đã nhận phòng",
      color: "bg-success-50 text-success-400",
    },
  ];
  return (
    <div className="flex items-center justify-between mb-7 space-x-3">
      {/* status tabs */}
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <span
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-sm transition-colors ${tab.color} cursor-pointer`}
          >
            {tab.label}
          </span>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm theo số phòng"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
          />
        </div>
      </div>
      <Link
        href="/front-desk/create-booking"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        Tạo đặt phòng
      </Link>
    </div>
  );
}