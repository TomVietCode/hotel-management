
export interface Rate {
  id: number;
  room_type: string;
  cancellation_policy: string;
  displayPolicy?: string | null;
  price: number;
  total_rooms: number;
  available_rooms: number;
}

export interface Room {
  id: number;
  room_number: number;
  bed_type: string;
  floor: number;
  facilities: string;
  status: string;
  rate_id: number;
  rate?: Rate;
}

export interface Guest {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  id_number: string;
  gender: 'male' | 'female';
  date_of_birth: string;
}

export interface Booking {
  id?: number;
  booking_code: string;
  guest_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  actual_check_in?: string;
  actual_check_out?: string;
  status: string;
  adults: number;
  children: number;
  total_amount: number;
  paid_amount: number;
  special_requests?: string;
  notes?: string;
}

export interface RoomSearchCriteria {
  bed_type?: string;
  rate_id?: string;
  check_in: string;
  check_out: string;
  status: 'all' | 'available';
}