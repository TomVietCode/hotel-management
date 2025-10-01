export function disPlayRoomNumber(roomNumber: number, floor: number) {
  return `#${floor}${roomNumber > 9 ? roomNumber : `0${roomNumber}`}`;
}