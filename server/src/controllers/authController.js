const bcrypt = require('bcrypt');

const {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByRefreshToken,
  updateUserRefreshToken,
} = require('../repositories/userRepository');
const {
  clearRefreshTokenCookie,
  getRefreshCookieName,
  serializeUser,
  setRefreshTokenCookie,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../utils/token');

const createAuthResponse = (user) => ({
  user: serializeUser(user),
  accessToken: signAccessToken(user.id),
});

const register = async (req, res) => {
  const { name, email, password, age, grade } = req.body;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await createUser({
    name,
    email,
    passwordHash,
    age,
    grade,
  });

  const refreshToken = signRefreshToken(user.id);
  const persistedUser = await updateUserRefreshToken(user.id, refreshToken);

  setRefreshTokenCookie(res, refreshToken);

  return res.status(201).json(createAuthResponse(persistedUser));
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const refreshToken = signRefreshToken(user.id);
  const persistedUser = await updateUserRefreshToken(user.id, refreshToken);

  setRefreshTokenCookie(res, refreshToken);

  return res.json(createAuthResponse(persistedUser));
};

const me = async (req, res) => {
  return res.json({ user: serializeUser(req.user) });
};

const refresh = async (req, res) => {
  const token = req.cookies[getRefreshCookieName()];

  if (!token) {
    return res.status(401).json({ message: 'Refresh token is missing' });
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await findUserById(payload.sub);

    if (!user || user.refreshToken !== token) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: 'Refresh token is invalid' });
    }

    const newRefreshToken = signRefreshToken(user.id);
    const persistedUser = await updateUserRefreshToken(user.id, newRefreshToken);

    setRefreshTokenCookie(res, newRefreshToken);

    return res.json(createAuthResponse(persistedUser));
  } catch (_error) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({ message: 'Refresh token expired or invalid' });
  }
};

const logout = async (req, res) => {
  const token = req.cookies[getRefreshCookieName()];

  if (token) {
    const user = await findUserByRefreshToken(token);

    if (user) {
      await updateUserRefreshToken(user.id, null);
    }
  }

  clearRefreshTokenCookie(res);

  return res.status(204).send();
};

module.exports = {
  login,
  logout,
  me,
  refresh,
  register,
};
