export function disPlayRoomNumber(roomNumber: number, floor: number) {
  return `#${floor}${roomNumber > 9 ? roomNumber : `0${roomNumber}`}`;
}

export function isToday(date: string) {
  const today = new Date();
  const bookingDate = new Date(date);
  return bookingDate.getDate() === today.getDate() &&
    bookingDate.getMonth() === today.getMonth() &&
    bookingDate.getFullYear() === today.getFullYear();  
}

export const monthNames: { [key: string]: string } = {
  Jan: "Tháng 1",
  Feb: "Tháng 2",
  Mar: "Tháng 3",
  Apr: "Tháng 4",
  May: "Tháng 5",
  Jun: "Tháng 6",
  Jul: "Tháng 7",
  Aug: "Tháng 8",
  Sep: "Tháng 9",
  Oct: "Tháng 10",
  Nov: "Tháng 11",
  Dec: "Tháng 12",
};

export function calculateDay(checkIn: string, checkOut: string) {
  return Math.ceil(
    (new Date(checkOut).getTime() -
      new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  )
}

export function calculateTotalAmount(price: number, checkIn: string, checkOut: string): { display: string, value: number} {
  const days = calculateDay(checkIn, checkOut);
  const totalAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price * days);
  return { display: totalAmount, value: price * days };
}

export function generateBookingCode(length: number) {
  const characters = '0123456789';
  let result = '#';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    confirmed: "Chưa Check-in",
    checked_in: "Đã Check-in",
    checked_out: "Đã Check-out",
    late_out: "Quá hạn",
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    confirmed: "bg-primary-50 text-primary-400",
    checked_in: "bg-success-50 text-success-400",
    checked_out: "bg-warning-50 text-warning-400",
    late_out: "bg-danger-50 text-danger-400",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

export const getBedTypeText = (bedType: string) => {
  const bedTypeMap: Record<string, string> = {
    single: "Giường đơn",
    double: "Giường đôi",
    triple: "Ba giường",
  };
  return bedTypeMap[bedType] || bedType;
};