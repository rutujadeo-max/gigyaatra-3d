const regionCatalog = [
  { key: 'techCity', label: 'Tech City' },
  { key: 'creativityForest', label: 'Creativity Forest' },
  { key: 'musicIsland', label: 'Music Island' },
  { key: 'sportsValley', label: 'Sports Valley' },
  { key: 'mediaTown', label: 'Media Town' },
];

const regionKeys = regionCatalog.map((region) => region.key);
const regionLabels = regionCatalog.map((region) => region.label);
const regionLabelToKey = Object.fromEntries(regionCatalog.map((region) => [region.label, region.key]));

const avatarBodyShapes = ['balanced', 'lean', 'broad'];
const avatarSkinTones = ['fair', 'light', 'medium', 'olive', 'brown', 'deep'];
const avatarHairStyles = ['short', 'curly', 'ponytail', 'buzz'];
const questTypes = ['mcq', 'drag', 'classify'];

module.exports = {
  avatarBodyShapes,
  avatarHairStyles,
  avatarSkinTones,
  questTypes,
  regionCatalog,
  regionKeys,
  regionLabelToKey,
  regionLabels,
};
