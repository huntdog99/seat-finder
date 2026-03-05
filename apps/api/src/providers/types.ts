import { Flight, SearchRequest } from '@seat-finder/shared';

export interface FlightProvider {
  name: string;
  search(request: SearchRequest): Promise<Flight[]>;
}
