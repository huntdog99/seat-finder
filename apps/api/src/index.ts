import express from 'express';
import cors from 'cors';
import { validateSearchRequest, partitionFlights, SearchRequest, SearchResponse, ApiError } from '@seat-finder/shared';
import { createProvider } from './providers/providerFactory';

const app = express();
const port = process.env.PORT || 3001;
const provider = createProvider();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', provider: provider.name });
});

app.post('/api/search', async (req, res) => {
  const body = req.body as Partial<SearchRequest>;

  const errors = validateSearchRequest(body);
  if (errors.length > 0) {
    const errorResponse: ApiError = {
      error: 'Validation failed',
      details: errors,
    };
    res.status(400).json(errorResponse);
    return;
  }

  try {
    const searchRequest = body as SearchRequest;
    const flights = await provider.search(searchRequest);
    const { preferred, other } = partitionFlights(flights, searchRequest.seatPreferences);

    const response: SearchResponse = {
      preferred,
      other,
      totalResults: preferred.length + other.length,
    };

    res.json(response);
  } catch (err) {
    const errorResponse: ApiError = {
      error: 'Search failed. Please try again later.',
    };
    res.status(500).json(errorResponse);
  }
});

app.listen(port, () => {
  console.log(`Seat Finder API running on port ${port} (provider: ${provider.name})`);
});

export default app;
