import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { authRouter } from './routes/auth.routes';
import { productRouter } from './routes/product.routes';
import { reviewRouter } from './routes/review.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/products', reviewRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

export default app;
