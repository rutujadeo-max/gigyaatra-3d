import { explorationPaths, explorationRegions, regionCombinations } from '../data/explorationData'

const enjoymentWeight = { loved: 1, enjoyed: 0.72, okay: 0.42, 'not-for-me': 0.08 }

export const getExplorationAnalysis = (activityData) => {
  const regions = Object.entries(explorationRegions).map(([slug, region]) => {
    const activity = activityData.regions[slug] ?? {}
    const attempts = activity.attempts ?? 0
    const completions = activity.completions ?? 0
    const scoreCap = activity.scoreCap || region.scoreCap
    const performance = scoreCap ? Math.min(1, (activity.bestScore ?? 0) / scoreCap) : 0
    const engagement = Math.min(1, attempts * 0.22 + completions * 0.18 + (activity.timeSpentSeconds ?? 0) / 600)
    const enjoyment = activity.enjoyment ? enjoymentWeight[activity.enjoyment] : 0
    const affinity = attempts ? Math.round(performance * 45 + engagement * 35 + enjoyment * 20) : 0

    return { slug, ...region, ...activity, attempts, completions, performance, engagement, enjoyment, affinity, explored: attempts > 0 }
  })

  const explored = regions.filter((region) => region.explored).sort((left, right) => right.affinity - left.affinity)
  const paths = []

  Object.entries(explorationPaths).forEach(([id, path]) => {
    const related = path.relatedRegions.map((slug) => regions.find((region) => region.slug === slug))
    if (related.some((region) => !region.explored)) return

    const strength = Math.round(related.reduce((total, region) => total + region.affinity, 0) / related.length)
    if (strength > 0) paths.push({ id, ...path, related, strength })
  })

  regionCombinations.forEach((combination) => {
    const related = combination.regions.map((slug) => regions.find((region) => region.slug === slug))
    if (related.some((region) => !region.explored)) return

    combination.pathIds.forEach((pathId) => {
      const existing = paths.find((path) => path.id === pathId)
      if (existing) existing.strength += 10
    })
  })

  return {
    regions,
    explored,
    paths: paths.sort((left, right) => right.strength - left.strength).slice(0, 5),
  }
}
