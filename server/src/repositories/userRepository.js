const { randomUUID } = require('crypto');

const { query } = require('../config/db');
const {
  defaultAvatarConfig,
  defaultRegionScores,
  normalizeUserRecord,
} = require('../models/User');

const mapUserRow = (rows) => (rows[0] ? normalizeUserRecord(rows[0]) : null);

const findUserByEmail = async (email) => {
  const [rows] = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return mapUserRow(rows);
};

const findUserById = async (userId) => {
  const [rows] = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
  return mapUserRow(rows);
};

const findUserByRefreshToken = async (refreshToken) => {
  const [rows] = await query('SELECT * FROM users WHERE refresh_token = ? LIMIT 1', [refreshToken]);
  return mapUserRow(rows);
};

const createUser = async ({ age, email, grade, name, passwordHash }) => {
  const id = randomUUID();

  await query(
    `
      INSERT INTO users (
        id,
        name,
        email,
        password_hash,
        age,
        grade,
        avatar_config,
        xp,
        region_scores,
        quest_activity,
        discovery_card_unlocked,
        refresh_token
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      name,
      email,
      passwordHash,
      age,
      grade,
      JSON.stringify(defaultAvatarConfig()),
      0,
      JSON.stringify(defaultRegionScores()),
      JSON.stringify([]),
      0,
      null,
    ]
  );

  return findUserById(id);
};

const updateUserRefreshToken = async (userId, refreshToken) => {
  await query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId]);
  return findUserById(userId);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByRefreshToken,
  updateUserRefreshToken,
};
