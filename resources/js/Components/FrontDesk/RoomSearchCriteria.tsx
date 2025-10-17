import { Rate } from "@/types/interfaces";
import PrimaryButton from "../PrimaryButton";
import { FormEvent, useState } from "react";
import { router } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";

interface Props {
  rates: Rate[]
  searchCriteria: any
}
export default function RoomSearchCriteria({ rates , searchCriteria }: Props) {
  const [formData, setFormData] = useState({
    bed_type: searchCriteria.bed_type || '',
    rate_id: searchCriteria.rate_id || '',
    check_in_date: searchCriteria.check_in_date || '',
    check_out_date: searchCriteria.check_out_date || '',
    status: searchCriteria.status || 'available',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev, 
      [field]: value,
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const queryParams = new URLSearchParams();

    Object.entries(formData).forEach(([key, value]) => {
      if (value && value !== '') {
        queryParams.append(key, value)
      }
    })

    router.get(route('front-desk.search-rooms'), Object.fromEntries(queryParams), {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const handleReset = () => {
    router.get(route('front-desk.create-booking'));
  }

  return (
    <div className="py-1">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
          <div className="p-6 text-gray-900">
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                      value={formData.bed_type}
                      onChange={(e) => handleInputChange('bed_type', e.target.value)}
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
                      value={formData.rate_id}
                      onChange={(e) => handleInputChange('rate_id', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Chọn loại phòng</option>
                      {rates.map((rate) => (
                        <option key={rate.id} value={rate.id}>
                          {rate.room_type}
                        </option>
                      ))}
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
                        htmlFor="check_in_date"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Ngày check-in
                      </label>
                      <input
                        type="date"
                        id="check_in_date"
                        name="check_in_date"
                        value={formData.check_in_date}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        onChange={(e) => handleInputChange('check_in_date', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    {/* Check-out */}
                    <div>
                      <label
                        htmlFor="check_out_date"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Ngày check-out
                      </label>
                      <input
                        type="date"
                        id="check_out_date"
                        name="check_out_date"
                        value={formData.check_out_date}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        onChange={(e) => handleInputChange('check_out_date', e.target.value)}
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
                            checked={formData.status === 'all'}
                            onChange={(e) => handleInputChange('status', e.target.value)}
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
                            checked={formData.status === 'available'}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className="border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ms-2 text-sm">
                            Chỉ hiện phòng trống
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button 
                        type="button" 
                        onClick={handleReset} 
                        className="p-2 rounded-full hover:bg-grey-50 text-primary-500"
                        title="Reset"
                      >
                        <FontAwesomeIcon icon={faRotateLeft} className="size-5" />
                      </button>
                      <PrimaryButton type="submit" className="font-light">
                        Tìm phòng
                      </PrimaryButton>
                    </div>
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
