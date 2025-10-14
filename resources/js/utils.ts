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

/**
 * Generate a unique booking code
 * Format: BK-YYYYMMDD-HHMMSS-XXXX (where XXXX is random)
 */
export function generateBookingCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `BK-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
}

/**
 * Calculate total amount for booking based on rate price and number of nights
 */
export function calculateBookingAmount(
  checkInDate: string, 
  checkOutDate: string, 
  ratePrice: number
): number {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  return nights * ratePrice;
}