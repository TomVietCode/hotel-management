export interface Booking {
  id: number;
  guest_name: string;
  room_number: number;
  floor: number;
  check_in: string;
  check_out: string;
  status: string;
  start_day: number;
  duration: number;
}

export interface CalendarMonth {
  month: string;
  year: string;
  days: number;
  bookings: Booking[];
}