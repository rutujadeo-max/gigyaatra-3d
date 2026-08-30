const { questTypes, regionLabels } = require('../constants/gameData');

const parseJsonField = (value, fallback) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === 'object') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
};

const normalizeQuestRecord = (row) => ({
  id: row.id,
  region: regionLabels.includes(row.region) ? row.region : regionLabels[0],
  slug: row.slug,
  title: row.title,
  description: row.description,
  type: questTypes.includes(row.type) ? row.type : questTypes[0],
  questions: parseJsonField(row.questions, []),
  xpReward: Number(row.xp_reward) || 0,
  timeLimit: Number(row.time_limit) || 0,
  isFeatured: Boolean(row.is_featured),
  isActive: Boolean(row.is_active),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

module.exports = { normalizeQuestRecord };
