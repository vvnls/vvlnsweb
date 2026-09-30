import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// requires a logged-in user
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.access_token;
  if (!token) throw new AppError('Not authenticated', 401);

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch {
    throw new AppError('Session expired', 401);
  }

  // re-check the database so disabling or demoting a user takes effect immediately
  const user = await User.findById(payload.sub);
  if (!user || !user.isActive || user.tokenVersion !== payload.tv) {
    throw new AppError('Not authenticated', 401);
  }

  req.user = user;
  next();
});

// usage: authorize('admin')
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to do this', 403));
  }
  next();
};