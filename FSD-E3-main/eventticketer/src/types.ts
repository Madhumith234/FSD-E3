export interface EventDetails {
  id: string;
  name: string;
  department: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  category: string;
}

export interface Booking {
  userName: string;
  userEmail: string;
  userDepartment: string;
  ticketsBooked: number;
  totalAmount: number;
  id?: string;
  eventId?: string;
  eventName?: string;
  status?: string;
  date?: string;
}
