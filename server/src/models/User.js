const {
  avatarBodyShapes,
  avatarHairStyles,
  avatarSkinTones,
  regionKeys,
  regionLabels,
  questTypes,
} = require('../constants/gameData');

const defaultRegionScores = () => ({
  techCity: 0,
  creativityForest: 0,
  musicIsland: 0,
  sportsValley: 0,
  mediaTown: 0,
});

const defaultAvatarConfig = () => ({
  bodyShape: avatarBodyShapes[0],
  skinTone: avatarSkinTones[2],
  hairStyle: avatarHairStyles[0],
  outfitColor: '#7C3AED',
});

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

const sanitizeHexColor = (value, fallback) =>
  typeof value === 'string' && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value) ? value : fallback;

const normalizeAvatarConfig = (avatarConfig) => {
  const defaults = defaultAvatarConfig();
  const rawConfig = parseJsonField(avatarConfig, defaults);

  return {
    bodyShape: avatarBodyShapes.includes(rawConfig.bodyShape) ? rawConfig.bodyShape : defaults.bodyShape,
    skinTone: avatarSkinTones.includes(rawConfig.skinTone) ? rawConfig.skinTone : defaults.skinTone,
    hairStyle: avatarHairStyles.includes(rawConfig.hairStyle) ? rawConfig.hairStyle : defaults.hairStyle,
    outfitColor: sanitizeHexColor(rawConfig.outfitColor, defaults.outfitColor),
  };
};

const normalizeRegionScores = (regionScores) => {
  const rawScores = parseJsonField(regionScores, defaultRegionScores());

  return regionKeys.reduce((scores, key) => {
    const value = Number(rawScores[key]);
    scores[key] = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
    return scores;
  }, {});
};

const normalizeQuestActivity = (questActivity) => {
  const rawActivity = parseJsonField(questActivity, []);

  if (!Array.isArray(rawActivity)) {
    return [];
  }

  return rawActivity
    .map((entry) => ({
      questId: typeof entry?.questId === 'string' ? entry.questId : null,
      region: regionLabels.includes(entry?.region) ? entry.region : null,
      title: typeof entry?.title === 'string' ? entry.title : '',
      type: questTypes.includes(entry?.type) ? entry.type : questTypes[0],
      score: Number.isFinite(Number(entry?.score)) ? Math.min(100, Math.max(0, Number(entry.score))) : 0,
      retries: Number.isFinite(Number(entry?.retries)) ? Math.max(0, Number(entry.retries)) : 0,
      timeTaken: Number.isFinite(Number(entry?.timeTaken)) ? Math.max(0, Number(entry.timeTaken)) : 0,
      skipped: Boolean(entry?.skipped),
      xpEarned: Number.isFinite(Number(entry?.xpEarned)) ? Math.max(0, Number(entry.xpEarned)) : 0,
      completedAt: entry?.completedAt || new Date().toISOString(),
    }))
    .filter((entry) => entry.region && entry.title);
};

const normalizeUserRecord = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  passwordHash: row.password_hash,
  age: Number(row.age),
  grade: row.grade,
  avatarConfig: normalizeAvatarConfig(row.avatar_config),
  xp: Number(row.xp) || 0,
  level: Math.floor((Number(row.xp) || 0) / 100) + 1,
  regionScores: normalizeRegionScores(row.region_scores),
  questActivity: normalizeQuestActivity(row.quest_activity),
  discoveryCardUnlocked: Boolean(row.discovery_card_unlocked),
  refreshToken: row.refresh_token,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

module.exports = {
  defaultAvatarConfig,
  defaultRegionScores,
  normalizeAvatarConfig,
  normalizeQuestActivity,
  normalizeRegionScores,
  normalizeUserRecord,
};
