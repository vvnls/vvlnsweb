import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { paging, escapeRegex } from '../utils/query.js';

const revokeSessions = (userId) =>
  RefreshToken.updateMany({ user: userId, revokedAt: null }, { revokedAt: new Date() });

// never leave the shop without an active admin
async function assertNotLastAdmin(user) {
  if (user.role !== 'admin' || !user.isActive) return;
  if ((await User.countDocuments({ role: 'admin', isActive: true })) <= 1) {
    throw new AppError('You cannot remove or demote the last active admin', 400);
  }
}

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req.query);
  const filter = {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  if (['customer', 'admin'].includes(req.query.role)) filter.role = req.query.role;
  if (req.query.status === 'active') filter.isActive = true;
  if (req.query.status === 'inactive') filter.isActive = false;

  const [users, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  res.json({ status: 'success', users, page, pages: Math.ceil(total / limit), total });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json({ status: 'success', user });
});

export const createUser = asyncHandler(async (req, res) => {
  if (await User.exists({ email: req.body.email })) throw new AppError('A user with this email already exists', 409);
  const user = await User.create(req.body);
  res.status(201).json({ status: 'success', user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  const { role, isActive, password, ...profile } = req.body;
  const isSelf = user._id.equals(req.user._id);
  const roleChanging = role !== undefined && role !== user.role;
  const statusChanging = isActive !== undefined && isActive !== user.isActive;

  if (isSelf && (roleChanging || statusChanging)) {
    throw new AppError('You cannot change your own role or status', 400);
  }
  if (roleChanging || (statusChanging && !isActive)) await assertNotLastAdmin(user);

  user.set(profile);
  if (roleChanging) user.role = role;
  if (statusChanging) user.isActive = isActive;
  if (password) user.password = password;

  const sensitive = roleChanging || statusChanging || Boolean(password);
  if (sensitive) user.tokenVersion += 1; // invalidates their access tokens immediately
  await user.save();
  if (sensitive) await revokeSessions(user._id); // and their refresh tokens

  res.json({ status: 'success', user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  if (user._id.equals(req.user._id)) throw new AppError('You cannot delete your own account', 400);
  await assertNotLastAdmin(user);
  await RefreshToken.deleteMany({ user: user._id });
  await user.deleteOne();
  res.json({ status: 'success', message: 'User deleted' });
});