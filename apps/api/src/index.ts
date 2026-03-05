import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { validateSearchRequest, partitionFlights, SearchRequest, SearchResponse, ApiError } from '@seat-finder/shared';
import { createProvider } from './providers/providerFactory';

const app = express();
const port = process.env.PORT || 3001;
const provider = createProvider();

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json({ limit: '10kb' }));

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

// Global error handler — prevents stack trace leaks
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(400).json({ error: 'Bad request' });
});

app.listen(port, () => {
  console.log(`Seat Finder API running on port ${port} (provider: ${provider.name})`);
});

export default app;
