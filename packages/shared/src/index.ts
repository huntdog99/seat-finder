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

const VALID_CABIN_CLASSES: CabinClass[] = ['economy', 'business', 'first'];
const VALID_SEAT_POSITIONS: SeatPosition[] = ['aisle', 'window'];
const VALID_SEAT_FEATURES: SeatFeature[] = ['bulkhead', 'emergency_row'];
const VALID_PLANE_HALVES: PlaneHalf[] = ['front', 'back', 'any'];
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validateSearchRequest(req: Partial<SearchRequest>): ValidationError[] {
  const errors: ValidationError[] = [];
  const iataRegex = /^[A-Z]{3}$/;

  if (!req.from || !iataRegex.test(req.from)) {
    errors.push({ field: 'from', message: 'Must be a valid 3-letter IATA airport code (uppercase)' });
  }
  if (!req.to || !iataRegex.test(req.to)) {
    errors.push({ field: 'to', message: 'Must be a valid 3-letter IATA airport code (uppercase)' });
  }

  if (req.from && req.to && req.from === req.to) {
    errors.push({ field: 'to', message: 'Destination must be different from origin' });
  }

  if (!req.departureDate || !ISO_DATE_REGEX.test(req.departureDate) || isNaN(Date.parse(req.departureDate))) {
    errors.push({ field: 'departureDate', message: 'Must be a valid date in YYYY-MM-DD format' });
  }

  if (req.returnDate !== undefined) {
    if (!ISO_DATE_REGEX.test(req.returnDate) || isNaN(Date.parse(req.returnDate))) {
      errors.push({ field: 'returnDate', message: 'Must be a valid date in YYYY-MM-DD format' });
    } else if (req.departureDate && ISO_DATE_REGEX.test(req.departureDate) && req.returnDate <= req.departureDate) {
      errors.push({ field: 'returnDate', message: 'Must be after departure date' });
    }
  }

  if (req.maxStops !== undefined && (req.maxStops < 0 || req.maxStops > 3)) {
    errors.push({ field: 'maxStops', message: 'Must be between 0 and 3' });
  }

  if (req.cabinClass !== undefined && !VALID_CABIN_CLASSES.includes(req.cabinClass as CabinClass)) {
    errors.push({ field: 'cabinClass', message: `Must be one of: ${VALID_CABIN_CLASSES.join(', ')}` });
  }

  if (req.seatPreferences) {
    const prefs = req.seatPreferences;
    if (prefs.position !== undefined && !VALID_SEAT_POSITIONS.includes(prefs.position as SeatPosition)) {
      errors.push({ field: 'seatPreferences.position', message: `Must be one of: ${VALID_SEAT_POSITIONS.join(', ')}` });
    }
    if (prefs.planeHalf !== undefined && !VALID_PLANE_HALVES.includes(prefs.planeHalf as PlaneHalf)) {
      errors.push({ field: 'seatPreferences.planeHalf', message: `Must be one of: ${VALID_PLANE_HALVES.join(', ')}` });
    }
    if (prefs.features) {
      if (!Array.isArray(prefs.features)) {
        errors.push({ field: 'seatPreferences.features', message: 'Must be an array' });
      } else {
        for (const f of prefs.features) {
          if (!VALID_SEAT_FEATURES.includes(f as SeatFeature)) {
            errors.push({ field: 'seatPreferences.features', message: `Invalid feature "${f}". Must be one of: ${VALID_SEAT_FEATURES.join(', ')}` });
            break;
          }
        }
      }
    }
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
