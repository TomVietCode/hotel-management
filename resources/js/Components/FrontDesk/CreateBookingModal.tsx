import { calculateDay, calculateTotalAmount, disPlayRoomNumber, generateBookingCode } from "@/utils";
import Modal from "../Modal";
import { Guest } from "@/types/interfaces";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import InputError from "../InputError";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";
import Toast from "../ui/Notification";
import { useEffect } from "react";

export default function CreateBookingModal({
  isBookingModalOpen,
  setIsBookingModalOpen,
  data,
}: {
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (value: boolean) => void;
  data: any
}) {
  const {
    data: guestData,
    setData: setGuestData,
    post,
    processing,
    errors,
    reset: resetGuestForm,
  } = useForm<{
    guest: Guest;
    room_id: number | null;
    check_in_date: string;
    check_out_date: string;
    booking_code: string;
    total_amount: number;
  }>({
    guest: {
      full_name: "",
      email: "",
      phone: "",
      id_number: "",
      gender: "male",
      date_of_birth: "",
    },
    room_id: null,
    check_in_date: data?.check_in_date,
    check_out_date: data?.check_out_date,
    booking_code: generateBookingCode(4),
    total_amount: 0,
  });

  useEffect(() => {
    if (data) {
      setGuestData('room_id', data.room?.id)
      setGuestData('total_amount', calculateTotalAmount(data.room?.rate?.price || 0, data.check_in_date, data.check_out_date).value)
      setGuestData('check_in_date', data.check_in_date)
      setGuestData('check_out_date', data.check_out_date)
    }
  }, [data]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    post(route('front-desk.store-booking'), {
      onSuccess: (response) => {
        Toast.success('Tạo booking thành công!');
        setIsBookingModalOpen(false);
        resetGuestForm();
      },
      onError: (errors) => {
        console.log(errors)
        Toast.error('Tạo booking thất bại. Vui lòng thử lại.');
      },
    });
  }
  return (
    <Modal
      show={isBookingModalOpen}
      onClose={() => setIsBookingModalOpen(false)}
      maxWidth="4xl"
    >
      <form className="p-6" onSubmit={handleBookingSubmit}>
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Đặt phòng{" "}
          {data.room &&
            disPlayRoomNumber(data.room.room_number, data.room.floor)}
        </h2>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Room and Booking Info */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">
              Thông tin đặt phòng
            </h3>
            {data.room && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Phòng:</span>
                    <span className="font-semibold">
                      {disPlayRoomNumber(
                        data.room.room_number,
                        data.room.floor
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Loại phòng:
                    </span>
                    <span >{data.room.rate?.room_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Loại giường:
                    </span>
                    <span>
                      {data.room.bed_type === "single"
                        ? "Giường đơn"
                        : data.room.bed_type === "double"
                        ? "Giường đôi"
                        : "Ba giường"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Check-in:</span>
                    <span>
                      {new Date(data.check_in_date).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Check-out:
                    </span>
                    <span>
                      {new Date(data.check_out_date).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Số đêm:</span>
                    <span>
                      {calculateDay(data.check_in_date, data.check_out_date)}{" "}
                      đêm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Giá/đêm:</span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(data.room.rate?.price || 0)}
                    </span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">Tổng tiền:</span>
                    <span className="text-lg font-bold text-primary-600">
                      {calculateTotalAmount(data.room.rate?.price || 0, data.check_in_date, data.check_out_date).display}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Guest Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">
              Thông tin khách hàng
            </h3>
            <div className="space-y-4">
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <InputLabel htmlFor="full_name" value="Họ và tên *" />
                  <TextInput
                    id="full_name"
                    type="text"
                    className="mt-1 block w-full"
                    value={guestData.guest.full_name}
                    onChange={(e) =>
                      setGuestData("guest", {
                        ...guestData.guest,
                        full_name: e.target.value,
                      })
                    }
                    required
                  />
                  <InputError
                    message={errors["guest.full_name"]}
                    className="mt-2"
                  />
                </div>
                <div>
                  <InputLabel htmlFor="email" value="Email *" />
                  <TextInput
                    id="email"
                    type="email"
                    className="mt-1 block w-full"
                    value={guestData.guest.email}
                    onChange={(e) =>
                      setGuestData("guest", {
                        ...guestData.guest,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                  <InputError
                    message={errors["guest.email"]}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Phone & ID Number */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <InputLabel htmlFor="phone" value="Số điện thoại *" />
                  <TextInput
                    id="phone"
                    type="tel"
                    className="mt-1 block w-full"
                    value={guestData.guest.phone}
                    onChange={(e) =>
                      setGuestData("guest", {
                        ...guestData.guest,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                  <InputError
                    message={errors["guest.phone"]}
                    className="mt-2"
                  />
                </div>
                <div>
                  <InputLabel htmlFor="id_number" value="CCCD" />
                  <TextInput
                    id="id_number"
                    type="text"
                    className="mt-1 block w-full"
                    value={guestData.guest.id_number}
                    onChange={(e) =>
                      setGuestData("guest", {
                        ...guestData.guest,
                        id_number: e.target.value,
                      })
                    }
                  />
                  <InputError
                    message={errors["guest.id_number"]}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Gender & Date of Birth */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <InputLabel htmlFor="gender" value="Giới tính" />
                  <select
                    id="gender"
                    className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                    value={guestData.guest.gender}
                    onChange={(e) =>
                      setGuestData("guest", {
                        ...guestData.guest,
                        gender: e.target.value as "male" | "female",
                      })
                    }
                    required
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                  <InputError
                    message={errors["guest.gender"]}
                    className="mt-2"
                  />
                </div>
                <div>
                  <InputLabel htmlFor="date_of_birth" value="Ngày sinh" />
                  <TextInput
                    id="date_of_birth"
                    type="date"
                    className="mt-1 block w-full"
                    value={guestData.guest.date_of_birth}
                    onChange={(e) =>
                      setGuestData("guest", {
                        ...guestData.guest,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                  <InputError
                    message={errors["guest.date_of_birth"]}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
            onClick={() => setIsBookingModalOpen(false)}
          >
            Hủy
          </button>
          <PrimaryButton disabled={processing}>{processing ? "Đang xử lý..." : "Tạo booking"}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
