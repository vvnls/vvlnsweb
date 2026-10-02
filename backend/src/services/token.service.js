import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken.js';
import { env } from '../config/env.js';

const ACCESS_TTL_MIN = 15;
const REFRESH_TTL_DAYS = 7;
const isProd = env.NODE_ENV === 'production';

export const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex');

export const signAccessToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role, tv: user.tokenVersion },
    env.JWT_ACCESS_SECRET,
    { expiresIn: `${ACCESS_TTL_MIN}m` }
  );

export async function issueRefreshToken(user, req, family = crypto.randomUUID()) {
  const raw = crypto.randomBytes(48).toString('hex');
  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(raw),
    family,
    expiresAt: new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000),
    userAgent: req.get('user-agent'),
    ip: req.ip,
  });
  return raw;
}

const base = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  ...(env.COOKIE_DOMAIN && { domain: env.COOKIE_DOMAIN }),
};

export function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('access_token', accessToken, { ...base, path: '/', maxAge: ACCESS_TTL_MIN * 60 * 1000 });
  // refresh cookie is only sent to /auth routes, so it never travels with normal API calls
  res.cookie('refresh_token', refreshToken, {
    ...base,
    path: '/api/v1/auth',
    maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res) {
  res.clearCookie('access_token', { ...base, path: '/' });
  res.clearCookie('refresh_token', { ...base, path: '/api/v1/auth' });
}

export async function startSession(user, req, res, family) {
  const access = signAccessToken(user);
  const refresh = await issueRefreshToken(user, req, family);
  setAuthCookies(res, access, refresh);
}