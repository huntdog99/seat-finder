import { FlightProvider } from './types';
import { MockProvider } from './mockProvider';

const providers: Record<string, () => FlightProvider> = {
  mock: () => new MockProvider(),
};

export function createProvider(name?: string): FlightProvider {
  const providerName = name || process.env.FLIGHT_PROVIDER || 'mock';
  const factory = providers[providerName];
  if (!factory) {
    throw new Error(`Unknown flight provider: ${providerName}. Available: ${Object.keys(providers).join(', ')}`);
  }
  return factory();
}
