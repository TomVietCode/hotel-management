import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { getBedTypeText } from "@/utils";
import { GuestBookingData } from "@/types/interfaces";
import Toast from "../ui/Notification";

interface Props {
  booking: GuestBookingData;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, isOpen, onClose }: Props) {
  const handleCheckIn = () => {
    router.patch(route('guest.check-in', { booking: booking.id }), {}, {
      onSuccess: () => {
        onClose();
      },
      onError: (errors) => {
        Toast.error('Có lỗi xảy ra');
      }
    });
  };

  const handleCheckOut = () => {
    router.patch(route('guest.check-out', { booking: booking.id }), {}, {
      onSuccess: () => {
        onClose();
      },
      onError: (errors) => {
        Toast.error('Có lỗi xảy ra');
      }
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên khách hàng
                    </label>
                    <input
                      type="text"
                      value={booking.guest_name}
                      readOnly
                      className="w-full rounded-md border border-grey-300 px-3 py-2 text-sm bg-gray-50 text-grey-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={booking.guest_phone}
                      readOnly
                      className="w-full rounded-md border border-grey-300 px-3 py-2 text-sm bg-gray-50 text-grey-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã đặt phòng
                    </label>
                    <input
                      type="text"
                      value={booking.booking_code}
                      readOnly
                      className="w-full rounded-md border border-grey-300 px-3 py-2 text-sm bg-gray-50 text-grey-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày check-in
                    </label>
                    <input
                      type="text"
                      value={booking.check_in_date}
                      readOnly
                      className="w-full rounded-md border border-grey-300 px-3 py-2 text-sm bg-gray-50 text-grey-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại phòng
                    </label>
                    <input
                      type="text"
                      value={booking.room_type}
                      readOnly
                      className="w-full rounded-md border border-grey-300 px-3 py-2 text-sm bg-gray-50 text-grey-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại giường
                    </label>
                    <input
                      type="text"
                      value={getBedTypeText(booking.bed_type)}
                      readOnly
                      className="w-full rounded-md border border-grey-300 px-3 py-2 text-sm bg-gray-50 text-grey-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số ngày ở
                    </label>
                    <input
                      type="text"
                      value={`${booking.nights} ngày`}
                      readOnly
                      className="w-full rounded-md border border-grey-300 px-3 py-2 text-sm bg-gray-50 text-grey-600"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <SecondaryButton onClick={onClose}>
                    Đóng
                  </SecondaryButton>
                  
                  {booking.raw_status === 'confirmed' && (
                    <PrimaryButton className="bg-success-500 hover:bg-success-600" onClick={handleCheckIn}>
                      Check In
                    </PrimaryButton>
                  )}
                  
                  {booking.raw_status === 'checked_in' && (
                    <PrimaryButton className="bg-warning-500 hover:bg-warning-600" onClick={handleCheckOut}>
                      Check Out
                    </PrimaryButton>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
