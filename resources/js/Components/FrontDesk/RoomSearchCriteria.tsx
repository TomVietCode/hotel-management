import PrimaryButton from "../PrimaryButton";

export default function RoomSearchCriteria() {
  return (
    <div className="py-1">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
          <div className="p-6 text-gray-900">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-3">
                  {/* Bed type */}
                  <div>
                    <label
                      htmlFor="bed_type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Loại giường
                    </label>
                    <select
                      id="bed_type"
                      name="bed_type"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Chọn loại giường</option>
                      <option value="single">Giường đơn</option>
                      <option value="double">Giường đôi</option>
                      <option value="triple">Ba giường</option>
                    </select>
                  </div>

                  {/* Loại phòng */}
                  <div>
                    <label
                      htmlFor="rate_id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Loại phòng
                    </label>
                    <select
                      id="rate_id"
                      name="rate_id"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Chọn loại phòng</option>
                      {/* Đây sẽ là danh sách các loại phòng từ API */}
                    </select>
                  </div>

                  {/* Status */}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Check-in and Check-out */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Checkin */}
                    <div>
                      <label
                        htmlFor="check_in"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Ngày check-in
                      </label>
                      <input
                        type="date"
                        id="check_in"
                        name="check_in"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    {/* Check-out */}
                    <div>
                      <label
                        htmlFor="check_out"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Ngày check-out
                      </label>
                      <input
                        type="date"
                        id="check_out"
                        name="check_out"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <div className="mt-4 block">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            value="all"
                            className="border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ms-2 text-sm">Tất cả</span>
                        </label>
                      </div>
                      <div className="mt-4 block">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            value="available"
                            className="border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ms-2 text-sm">
                            Chỉ hiện phòng trống
                          </span>
                        </label>
                      </div>
                    </div>
                    <PrimaryButton type="submit" className="font-light">
                      Tìm phòng
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
