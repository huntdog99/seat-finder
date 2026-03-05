import {
  SearchRequest,
  SearchResponse,
  Flight,
  AvailableSeat,
  SeatPosition,
  SeatFeature,
  PlaneHalf,
  CabinClass,
  partitionFlights,
} from '@seat-finder/shared';

interface AirlineInfo {
  name: string;
  code: string;
}

const AIRLINES: AirlineInfo[] = [
  { name: 'Delta', code: 'DL' },
  { name: 'United', code: 'UA' },
  { name: 'American', code: 'AA' },
  { name: 'JetBlue', code: 'B6' },
  { name: 'Southwest', code: 'WN' },
  { name: 'Alaska', code: 'AS' },
  { name: 'Spirit', code: 'NK' },
  { name: 'Frontier', code: 'F9' },
];

const ROUTE_DURATIONS: Record<string, { min: number; max: number }> = {
  'JFK-LAX': { min: 310, max: 360 },
  'LAX-JFK': { min: 290, max: 340 },
  'JFK-SFO': { min: 330, max: 380 },
  'SFO-JFK': { min: 300, max: 350 },
  'ORD-LAX': { min: 240, max: 280 },
  'LAX-ORD': { min: 230, max: 270 },
  'ATL-JFK': { min: 120, max: 150 },
  'JFK-ATL': { min: 130, max: 155 },
  'JFK-MIA': { min: 170, max: 200 },
  'MIA-JFK': { min: 175, max: 205 },
  'LAX-SEA': { min: 155, max: 185 },
  'SEA-LAX': { min: 160, max: 190 },
  'ORD-DEN': { min: 150, max: 180 },
  'DEN-ORD': { min: 145, max: 175 },
  'BOS-DCA': { min: 85, max: 105 },
  'DCA-BOS': { min: 90, max: 110 },
};

const BASE_PRICES: Record<CabinClass, { min: number; max: number }> = {
  economy: { min: 89, max: 450 },
  business: { min: 450, max: 1800 },
  first: { min: 1200, max: 5500 },
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function generateSeats(random: () => number, cabinClass: CabinClass): AvailableSeat[] {
  const count = Math.floor(random() * 6) + 1;
  const seats: AvailableSeat[] = [];
  const positions: SeatPosition[] = ['window', 'aisle'];
  const halves: PlaneHalf[] = ['front', 'back'];
  const featureOptions: SeatFeature[] = ['bulkhead', 'emergency_row'];

  const rowBase = cabinClass === 'first' ? 1 : cabinClass === 'business' ? 5 : 12;
  const rowRange = cabinClass === 'first' ? 4 : cabinClass === 'business' ? 8 : 25;
  const seatLetters = cabinClass === 'first' ? ['A', 'F'] : ['A', 'B', 'C', 'D', 'E', 'F'];

  for (let i = 0; i < count; i++) {
    const row = rowBase + Math.floor(random() * rowRange);
    const letter = seatLetters[Math.floor(random() * seatLetters.length)];
    const position = ['A', 'F'].includes(letter) ? 'window' as SeatPosition : 'aisle' as SeatPosition;
    const half: PlaneHalf = row < 20 ? 'front' : 'back';

    const features: SeatFeature[] = [];
    if (random() > 0.7) {
      features.push(featureOptions[Math.floor(random() * featureOptions.length)]);
    }

    seats.push({
      seatNumber: `${row}${letter}`,
      position,
      planeHalf: half,
      features,
    });
  }

  return seats;
}

function generateDepartureHour(random: () => number): number {
  const slots = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  return slots[Math.floor(random() * slots.length)];
}

export async function searchFlights(request: SearchRequest): Promise<SearchResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 800));

  const seed = hashString(`${request.from}-${request.to}-${request.departureDate}-${request.cabinClass}`);
  const random = seededRandom(seed);

  const routeKey = `${request.from}-${request.to}`;
  const reverseKey = `${request.to}-${request.from}`;
  const routeInfo = ROUTE_DURATIONS[routeKey] || ROUTE_DURATIONS[reverseKey] || {
    min: 90 + Math.floor(random() * 200),
    max: 200 + Math.floor(random() * 250),
  };

  const priceRange = BASE_PRICES[request.cabinClass];
  const flightCount = 5 + Math.floor(random() * 8);

  const flights: Flight[] = [];

  for (let i = 0; i < flightCount; i++) {
    const airline = AIRLINES[Math.floor(random() * AIRLINES.length)];
    const flightNum = `${airline.code}${100 + Math.floor(random() * 8900)}`;
    const duration = routeInfo.min + Math.floor(random() * (routeInfo.max - routeInfo.min));

    const stops = Math.floor(random() * (request.maxStops + 1));
    const stopExtra = stops * (30 + Math.floor(random() * 90));
    const totalDuration = duration + stopExtra;

    const hour = generateDepartureHour(random);
    const minute = Math.floor(random() * 4) * 15;
    const depDate = new Date(`${request.departureDate}T00:00:00`);
    depDate.setHours(hour, minute);

    const arrDate = new Date(depDate.getTime() + totalDuration * 60000);

    const price = Math.round(
      priceRange.min + random() * (priceRange.max - priceRange.min)
    );

    // Cheaper non-stops cost more, add stop discount
    const stopDiscount = stops > 0 ? 0.85 : 1;
    const finalPrice = Math.round(price * stopDiscount);

    flights.push({
      id: `${flightNum}-${request.departureDate}-${i}`,
      airline: airline.name,
      flightNumber: flightNum,
      from: request.from,
      to: request.to,
      departureTime: depDate.toISOString(),
      arrivalTime: arrDate.toISOString(),
      durationMinutes: totalDuration,
      price: finalPrice,
      currency: 'USD',
      stops,
      cabinClass: request.cabinClass,
      availableSeats: generateSeats(random, request.cabinClass),
    });
  }

  const { preferred, other } = partitionFlights(flights, request.seatPreferences);

  return {
    preferred,
    other,
    totalResults: flights.length,
  };
}
