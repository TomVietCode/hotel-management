import { Rate, Room, RoomSearchCriteria as SearchCriteria } from "@/types/interfaces";
import PrimaryButton from "../PrimaryButton";
import { useState } from "react";
import { router } from "@inertiajs/react";

interface RoomSearchCriteriaProps {
  rates: Rate[];
  onSearchResults: (rooms: Room[], searchCriteria: SearchCriteria) => void;
}

export default function RoomSearchCriteria({ rates, onSearchResults }: RoomSearchCriteriaProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState<SearchCriteria>({
    bed_type: '',
    rate_id: '',
    check_in: '',
    check_out: '',
    status: 'available'
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.check_in || !formData.check_out) {
      alert('Vui lòng chọn ngày check-in và check-out');
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(route('front-desk.search-rooms'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const rooms = await response.json();
        onSearchResults(rooms, formData);
      } else {
        console.error('Search failed');
        onSearchResults([], formData);
      }
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults([], formData);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (field: keyof SearchCriteria, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="py-1">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
          <div className="p-6 text-gray-900">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                      {rates.map(rate => <option key={rate.id} value={rate.id}>{rate.room_type}</option>)}
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
                        value={formData.check_in}
                        onChange={(e) => handleInputChange('check_in', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
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
                        value={formData.check_out}
                        onChange={(e) => handleInputChange('check_out', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
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
                            onChange={(e) => handleInputChange('status', e.target.value as 'all' | 'available')}
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
                            onChange={(e) => handleInputChange('status', e.target.value as 'all' | 'available')}
                            className="border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ms-2 text-sm">
                            Chỉ hiện phòng trống
                          </span>
                        </label>
                      </div>
                    </div>
                    <PrimaryButton type="submit" className="font-light" disabled={isSearching}>
                      {isSearching ? 'Đang tìm...' : 'Tìm phòng'}
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
