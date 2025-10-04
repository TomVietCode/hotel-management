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