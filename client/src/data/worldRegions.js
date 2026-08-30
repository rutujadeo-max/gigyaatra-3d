export const WORLD_HALF_EXTENT = {
  x: 18,
  z: 16,
}

export const worldRegions = [
  {
    id: 'techCity',
    slug: 'tech-city',
    name: 'Tech City',
    subtitle: 'Programming, AI, Cybersecurity',
    description:
      'A neon maker district where logic, curiosity, and problem-solving power every tower and terminal.',
    mentorName: 'ARIA',
    color: '#2563eb',
    accent: '#60a5fa',
    position: [-11, -7],
    size: [9, 7],
    quests: ['Fix the broken code', 'Design an algorithm', 'AI or not?'],
    ambientObjects: [
      { kind: 'box', position: [-2.2, 1.3, -1.1], scale: [0.7, 0.7, 0.7] },
      { kind: 'sphere', position: [1.8, 1.9, 1.2], scale: [0.55, 0.55, 0.55] },
      { kind: 'cylinder', position: [0, 2.1, -2], scale: [0.4, 0.9, 0.4] },
    ],
  },
  {
    id: 'creativityForest',
    slug: 'creativity-forest',
    name: 'Creativity Forest',
    subtitle: 'Writing, Design, Photography',
    description:
      'A glowing woodland of ideas where storytelling, visual imagination, and expression bloom together.',
    mentorName: 'Sage',
    color: '#059669',
    accent: '#34d399',
    position: [1, -8],
    size: [10, 7],
    quests: ['Frame the story', 'Design the mood board', 'Spot the visual hook'],
    ambientObjects: [
      { kind: 'sphere', position: [-2.5, 1.6, 0.6], scale: [0.7, 0.7, 0.7] },
      { kind: 'cylinder', position: [2.4, 2.1, -1.4], scale: [0.45, 1.1, 0.45] },
      { kind: 'box', position: [0.8, 1.4, 2], scale: [0.55, 0.55, 0.55] },
    ],
  },
  {
    id: 'musicIsland',
    slug: 'music-island',
    name: 'Music Island',
    subtitle: 'Singing, Instruments, Production',
    description:
      'A rhythmic shoreline where beats, harmony, and production tools turn ideas into performance energy.',
    mentorName: 'Lyra',
    color: '#7c3aed',
    accent: '#c084fc',
    position: [11, -6],
    size: [8, 8],
    quests: ['Find the chorus', 'Layer the rhythm', 'Tune the mix'],
    ambientObjects: [
      { kind: 'sphere', position: [-1.5, 1.7, -1.6], scale: [0.65, 0.65, 0.65] },
      { kind: 'box', position: [2.1, 1.2, 1.8], scale: [0.5, 0.5, 0.5] },
      { kind: 'cylinder', position: [0.2, 2.3, 0], scale: [0.35, 1.2, 0.35] },
    ],
  },
  {
    id: 'sportsValley',
    slug: 'sports-valley',
    name: 'Sports Valley',
    subtitle: 'Fitness, Yoga, Running',
    description:
      'An open active valley built for movement, discipline, and learning how the body responds to challenge.',
    mentorName: 'Coach Rex',
    color: '#ea580c',
    accent: '#fb923c',
    position: [-7, 7],
    size: [10, 7],
    quests: ['Balance in motion', 'Sprint strategy', 'Build a recovery plan'],
    ambientObjects: [
      { kind: 'cylinder', position: [-2.4, 1.8, -1], scale: [0.4, 1, 0.4] },
      { kind: 'sphere', position: [2.3, 1.5, 1.1], scale: [0.6, 0.6, 0.6] },
      { kind: 'box', position: [0.3, 2.1, 2], scale: [0.45, 0.45, 0.45] },
    ],
  },
  {
    id: 'mediaTown',
    slug: 'media-town',
    name: 'Media Town',
    subtitle: 'Animation, Video Editing, Content Creation',
    description:
      'A kinetic studio town where visual timing, storytelling, and audience connection shape every creation.',
    mentorName: 'Pixel',
    color: '#db2777',
    accent: '#f472b6',
    position: [9, 7],
    size: [11, 8],
    quests: ['Cut the scene', 'Build the storyboard', 'Pitch the content hook'],
    ambientObjects: [
      { kind: 'box', position: [-2.5, 1.6, -1.2], scale: [0.6, 0.6, 0.6] },
      { kind: 'sphere', position: [2.6, 2.1, 0.8], scale: [0.55, 0.55, 0.55] },
      { kind: 'cylinder', position: [0.2, 1.4, 2], scale: [0.45, 0.9, 0.45] },
    ],
  },
]

export const getRegionById = (regionId) => worldRegions.find((region) => region.id === regionId)

export const getRegionBySlug = (regionSlug) =>
  worldRegions.find((region) => region.slug === regionSlug)

export const clampToWorld = (position) => ({
  x: Math.max(-WORLD_HALF_EXTENT.x + 1, Math.min(WORLD_HALF_EXTENT.x - 1, position.x)),
  z: Math.max(-WORLD_HALF_EXTENT.z + 1, Math.min(WORLD_HALF_EXTENT.z - 1, position.z)),
})

export const getRegionForPosition = (position) =>
  worldRegions.find((region) => {
    const [centerX, centerZ] = region.position
    const [width, depth] = region.size

    return (
      Math.abs(position.x - centerX) <= width / 2 &&
      Math.abs(position.z - centerZ) <= depth / 2
    )
  }) || null

export const getNearestRegion = (position) =>
  worldRegions.reduce((closest, region) => {
    const [centerX, centerZ] = region.position
    const distance = Math.hypot(position.x - centerX, position.z - centerZ)

    if (!closest || distance < closest.distance) {
      return { region, distance }
    }

    return closest
  }, null)?.region ?? null
