import { Flight, SearchRequest } from '@seat-finder/shared';
import { FlightProvider } from './types';

const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'FL001',
    airline: 'SkyWing Airlines',
    flightNumber: 'SW 1234',
    from: 'JFK',
    to: 'LAX',
    departureTime: '2026-03-10T08:00:00Z',
    arrivalTime: '2026-03-10T11:30:00Z',
    durationMinutes: 330,
    price: 349,
    currency: 'USD',
    stops: 0,
    cabinClass: 'economy',
    availableSeats: [
      { position: 'window', features: [], planeHalf: 'front', seatNumber: '12A' },
      { position: 'aisle', features: [], planeHalf: 'front', seatNumber: '12C' },
      { position: 'window', features: ['emergency_row'], planeHalf: 'front', seatNumber: '14A' },
      { position: 'aisle', features: ['bulkhead'], planeHalf: 'front', seatNumber: '1C' },
    ],
  },
  {
    id: 'FL002',
    airline: 'Pacific Air',
    flightNumber: 'PA 567',
    from: 'JFK',
    to: 'LAX',
    departureTime: '2026-03-10T10:15:00Z',
    arrivalTime: '2026-03-10T13:45:00Z',
    durationMinutes: 330,
    price: 289,
    currency: 'USD',
    stops: 0,
    cabinClass: 'economy',
    availableSeats: [
      { position: 'aisle', features: [], planeHalf: 'back', seatNumber: '28D' },
      { position: 'window', features: [], planeHalf: 'back', seatNumber: '30F' },
    ],
  },
  {
    id: 'FL003',
    airline: 'SkyWing Airlines',
    flightNumber: 'SW 890',
    from: 'JFK',
    to: 'LAX',
    departureTime: '2026-03-10T14:00:00Z',
    arrivalTime: '2026-03-10T19:00:00Z',
    durationMinutes: 420,
    price: 219,
    currency: 'USD',
    stops: 1,
    cabinClass: 'economy',
    availableSeats: [
      { position: 'aisle', features: ['emergency_row'], planeHalf: 'front', seatNumber: '14D' },
      { position: 'window', features: [], planeHalf: 'back', seatNumber: '35A' },
    ],
  },
  {
    id: 'FL004',
    airline: 'Horizon Express',
    flightNumber: 'HE 102',
    from: 'JFK',
    to: 'LAX',
    departureTime: '2026-03-10T06:30:00Z',
    arrivalTime: '2026-03-10T09:45:00Z',
    durationMinutes: 315,
    price: 529,
    currency: 'USD',
    stops: 0,
    cabinClass: 'business',
    availableSeats: [
      { position: 'window', features: ['bulkhead'], planeHalf: 'front', seatNumber: '1A' },
      { position: 'aisle', features: ['bulkhead'], planeHalf: 'front', seatNumber: '1D' },
    ],
  },
  {
    id: 'FL005',
    airline: 'Pacific Air',
    flightNumber: 'PA 234',
    from: 'JFK',
    to: 'LAX',
    departureTime: '2026-03-10T18:00:00Z',
    arrivalTime: '2026-03-10T23:30:00Z',
    durationMinutes: 450,
    price: 179,
    currency: 'USD',
    stops: 2,
    cabinClass: 'economy',
    availableSeats: [
      { position: 'aisle', features: [], planeHalf: 'back', seatNumber: '32C' },
    ],
  },
  {
    id: 'FL006',
    airline: 'Horizon Express',
    flightNumber: 'HE 305',
    from: 'SFO',
    to: 'ORD',
    departureTime: '2026-03-10T07:00:00Z',
    arrivalTime: '2026-03-10T13:00:00Z',
    durationMinutes: 270,
    price: 399,
    currency: 'USD',
    stops: 0,
    cabinClass: 'economy',
    availableSeats: [
      { position: 'window', features: ['emergency_row'], planeHalf: 'front', seatNumber: '14F' },
      { position: 'aisle', features: [], planeHalf: 'front', seatNumber: '8C' },
      { position: 'window', features: [], planeHalf: 'back', seatNumber: '25A' },
    ],
  },
];

export class MockProvider implements FlightProvider {
  name = 'mock';

  async search(request: SearchRequest): Promise<Flight[]> {
    return MOCK_FLIGHTS.filter(f => {
      if (f.from !== request.from || f.to !== request.to) return false;
      if (f.cabinClass !== request.cabinClass) return false;
      if (f.stops > request.maxStops) return false;
      const flightDate = f.departureTime.split('T')[0];
      if (flightDate !== request.departureDate) return false;
      return true;
    });
  }
}
