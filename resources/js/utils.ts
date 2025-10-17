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

export function calculateTotalAmount(price: number, checkIn: string, checkOut: string) {
  const days = calculateDay(checkIn, checkOut);
  const totalAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price * days);
  return { display: totalAmount, value: price * days };
}

export function generateBookingCode(length: number) {
  const characters = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}