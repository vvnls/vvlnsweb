import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import hpp from 'hpp';
import morgan from 'morgan';
import { env } from './config/env.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { sanitize } from './middleware/sanitize.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.set('trust proxy', 1); // needed behind Cloudflare / Render for correct client IPs
app.use(helmet());
app.use(cors({ origin: [env.CLIENT_URL], credentials: true }));
app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(sanitize);
app.use(hpp());
app.use(compression());
if (env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex'); // keep the API out of Google
  next();
});

app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);

export default app;