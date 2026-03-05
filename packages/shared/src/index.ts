export type SeatPosition = 'aisle' | 'window';
export type SeatFeature = 'bulkhead' | 'emergency_row';
export type PlaneHalf = 'front' | 'back' | 'any';
export type CabinClass = 'economy' | 'business' | 'first';

export interface SeatPreferences {
  position?: SeatPosition;
  features?: SeatFeature[];
  planeHalf?: PlaneHalf;
}

export interface SearchRequest {
  from: string;        // IATA airport code
  to: string;          // IATA airport code
  departureDate: string; // ISO date string
  returnDate?: string;
  cabinClass: CabinClass;
  maxStops: number;
  seatPreferences?: SeatPreferences;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  price: number;
  currency: string;
  stops: number;
  cabinClass: CabinClass;
  availableSeats: AvailableSeat[];
}

export interface AvailableSeat {
  position: SeatPosition;
  features: SeatFeature[];
  planeHalf: PlaneHalf;
  seatNumber: string;
}

export interface SearchResponse {
  preferred: Flight[];
  other: Flight[];
  totalResults: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  error: string;
  details?: ValidationError[];
}

export function validateSearchRequest(req: Partial<SearchRequest>): ValidationError[] {
  const errors: ValidationError[] = [];
  const iataRegex = /^[A-Z]{3}$/;

  if (!req.from || !iataRegex.test(req.from)) {
    errors.push({ field: 'from', message: 'Must be a valid 3-letter IATA airport code (uppercase)' });
  }
  if (!req.to || !iataRegex.test(req.to)) {
    errors.push({ field: 'to', message: 'Must be a valid 3-letter IATA airport code (uppercase)' });
  }
  if (!req.departureDate || isNaN(Date.parse(req.departureDate))) {
    errors.push({ field: 'departureDate', message: 'Must be a valid ISO date string' });
  }
  if (req.maxStops !== undefined && (req.maxStops < 0 || req.maxStops > 3)) {
    errors.push({ field: 'maxStops', message: 'Must be between 0 and 3' });
  }

  return errors;
}

export function partitionFlights(
  flights: Flight[],
  preferences?: SeatPreferences
): { preferred: Flight[]; other: Flight[] } {
  if (!preferences || (!preferences.position && !preferences.features?.length && (!preferences.planeHalf || preferences.planeHalf === 'any'))) {
    return { preferred: flights, other: [] };
  }

  const preferred: Flight[] = [];
  const other: Flight[] = [];

  for (const flight of flights) {
    const hasMatchingSeat = flight.availableSeats.some(seat => {
      if (preferences.position && seat.position !== preferences.position) return false;
      if (preferences.features?.length) {
        for (const feature of preferences.features) {
          if (!seat.features.includes(feature)) return false;
        }
      }
      if (preferences.planeHalf && preferences.planeHalf !== 'any' && seat.planeHalf !== preferences.planeHalf) return false;
      return true;
    });

    if (hasMatchingSeat) {
      preferred.push(flight);
    } else {
      other.push(flight);
    }
  }

  const byPrice = (a: Flight, b: Flight) => a.price - b.price;
  preferred.sort(byPrice);
  other.sort(byPrice);

  return { preferred, other };
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
