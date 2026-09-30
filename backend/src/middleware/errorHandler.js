import { env } from '../config/env.js';

export const notFound = (req, res) =>
  res.status(404).json({ status: 'fail', message: `Route not found: ${req.originalUrl}` });

export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Something went wrong';

  if (err.name === 'ZodError') { status = 400; message = err.issues.map((i) => i.message).join(', '); }
  if (err.name === 'CastError') { status = 400; message = 'Invalid id'; }
  if (err.code === 11000) { status = 409; message = 'That value already exists'; }

  if (env.NODE_ENV !== 'production') console.error(err);

  res.status(status).json({
    status: status < 500 ? 'fail' : 'error',
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};