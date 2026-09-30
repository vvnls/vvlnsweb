import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashToken, startSession, clearAuthCookies } from '../services/token.service.js';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../services/email.services.js';
import { env } from '../config/env.js';

const MAX_ATTEMPTS = 5; // max failed login attempts before lockout
const LOCK_MINUTES = 15; // lockout duration after too many failed attempts
const GRACE_MS = 10_000; // tolerate two refresh calls fired at the same moment
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12); // keeps login timing equal for unknown emails

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (await User.exists({ email })) throw new AppError('An account with this email already exists', 409);

  const user = await User.create({ name, email, password, phone }); // role is always 'customer'
  await startSession(user, req, res);
  res.status(201).json({ status: 'success', user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const fail = () => new AppError('Invalid email or password', 401);

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw fail();
  }
  if (!user.isActive) throw fail();
  if (user.isLocked()) throw new AppError('Too many failed attempts. Try again in a few minutes.', 429);

  if (!(await user.comparePassword(password))) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
      user.loginAttempts = 0;
    }
    await user.save({ validateBeforeSave: false });
    throw fail();
  }

  if (user.loginAttempts || user.lockUntil) {
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save({ validateBeforeSave: false });
  }

  await startSession(user, req, res);
  res.json({ status: 'success', user }); // frontend redirects by user.role
});

export const refresh = asyncHandler(async (req, res) => {
  const raw = req.cookies?.refresh_token;
  if (!raw) throw new AppError('Not authenticated', 401);
  const tokenHash = hashToken(raw);

  // atomically mark the token as used; only one request can win
  const stored = await RefreshToken.findOneAndUpdate(
    { tokenHash, revokedAt: null, expiresAt: { $gt: new Date() } },
    { revokedAt: new Date() }
  );

  if (!stored) {
    const old = await RefreshToken.findOne({ tokenHash });
    const reused = old?.revokedAt && Date.now() - old.revokedAt.getTime() > GRACE_MS;
    if (reused) {
      // an already-used token came back: possible theft, kill the whole session
      await RefreshToken.updateMany({ family: old.family, revokedAt: null }, { revokedAt: new Date() });
    }
    if (!old?.revokedAt || reused) clearAuthCookies(res);
    throw new AppError('Session expired. Please log in again.', 401);
  }

  const user = await User.findById(stored.user);
  if (!user || !user.isActive) {
    clearAuthCookies(res);
    throw new AppError('Session expired. Please log in again.', 401);
  }

  await startSession(user, req, res, stored.family); // new pair, same family
  res.json({ status: 'success', user });
});

export const logout = asyncHandler(async (req, res) => {
  const raw = req.cookies?.refresh_token;
  if (raw) {
    const stored = await RefreshToken.findOne({ tokenHash: hashToken(raw) });
    if (stored) {
      await RefreshToken.updateMany({ family: stored.family, revokedAt: null }, { revokedAt: new Date() });
    }
  }
  clearAuthCookies(res);
  res.json({ status: 'success', message: 'Logged out' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // always respond the same way, whether or not the account exists — don't reveal which emails are registered
  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetTokenHash = hashToken(rawToken);
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
    sendPasswordResetEmail(user.email, resetUrl).catch((e) => console.error('Email error:', e));
  }

  res.json({ status: 'success', message: 'If that email exists, a reset link has been sent.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    passwordResetTokenHash: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  }).select('+password');

  if (!user) throw new AppError('This reset link is invalid or has expired', 400);

  user.password = password;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  user.tokenVersion += 1; // kills every existing access token immediately
  await user.save();
  await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date() }); // and every refresh token

  res.json({ status: 'success', message: 'Password updated. Please log in again.' });
});

export const me = (req, res) => res.json({ status: 'success', user: req.user });