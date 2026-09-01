const jwt = require('jsonwebtoken');

const getRefreshCookieName = () => process.env.REFRESH_COOKIE_NAME || 'gigyaatra_refresh_token';

const parseDurationToMs = (value, fallbackMs) => {
  if (!value) {
    return fallbackMs;
  }

  const match = String(value).trim().match(/^(\d+)([smhd])$/i);

  if (!match) {
    return fallbackMs;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const unitToMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * unitToMs[unit];
};

const signAccessToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });

const signRefreshToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

const setRefreshTokenCookie = (res, token) => {
  res.cookie(getRefreshCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',    maxAge: parseDurationToMs(process.env.JWT_REFRESH_EXPIRES_IN, 7 * 24 * 60 * 60 * 1000),
    path: '/api/auth',
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie(getRefreshCookieName(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
  });
};

const serializeUser = (user) => ({
  id: user.id || user._id?.toString(),
  name: user.name,
  email: user.email,
  age: user.age,
  grade: user.grade,
  avatarConfig: user.avatarConfig,
  xp: user.xp,
  level: user.level || Math.floor((user.xp || 0) / 100) + 1,
  regionScores: user.regionScores,
  discoveryCardUnlocked: user.discoveryCardUnlocked,
  createdAt: user.createdAt || user.created_at,
});

module.exports = {
  clearRefreshTokenCookie,
  getRefreshCookieName,
  serializeUser,
  setRefreshTokenCookie,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
