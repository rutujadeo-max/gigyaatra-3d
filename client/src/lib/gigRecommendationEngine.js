import { gigs } from '../data/gigs'

const connectionLabel = (score) => {
  if (score >= 65) return 'Strong Connection'
  if (score >= 35) return 'Good Connection'
  return 'Worth Exploring'
}

export const getGigRecommendations = (analysis) => gigs
  .map((gig) => {
    const relatedRegions = gig.relatedRegions
      .map((slug) => analysis.regions.find((region) => region.slug === slug))
      .filter((region) => region?.explored)
    const matchedPaths = analysis.paths.filter((path) => gig.relatedPaths.includes(path.id))
    const averageAffinity = relatedRegions.length
      ? relatedRegions.reduce((total, region) => total + region.affinity, 0) / relatedRegions.length
      : 0
    const score = Math.round(averageAffinity + matchedPaths.length * 18)

    return {
      ...gig,
      score,
      connection: connectionLabel(score),
      relatedRegions,
      matchedPaths,
      isSuggested: relatedRegions.length > 0,
    }
  })
  .filter((gig) => gig.isSuggested)
  .sort((left, right) => right.score - left.score)
