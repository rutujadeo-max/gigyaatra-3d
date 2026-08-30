const STORAGE_PREFIX = 'gigyaatra-exploration-v1'

const getStorageKey = (user) => `${STORAGE_PREFIX}:${user?.id ?? user?.email ?? 'local-explorer'}`

const emptyActivityData = () => ({ regions: {} })

export const loadActivityData = (user) => {
  try {
    const stored = window.localStorage.getItem(getStorageKey(user))
    return stored ? JSON.parse(stored) : emptyActivityData()
  } catch {
    return emptyActivityData()
  }
}

const saveActivityData = (user, data) => {
  window.localStorage.setItem(getStorageKey(user), JSON.stringify(data))
  return data
}

const getRegionActivity = (data, regionSlug) => data.regions[regionSlug] ?? {
  attempts: 0,
  completions: 0,
  bestScore: 0,
  scoreCap: 0,
  timeSpentSeconds: 0,
  enjoyment: null,
}

export const recordActivityStart = (user, regionSlug) => {
  const data = loadActivityData(user)
  const current = getRegionActivity(data, regionSlug)

  return saveActivityData(user, {
    ...data,
    regions: {
      ...data.regions,
      [regionSlug]: { ...current, attempts: current.attempts + 1, lastPlayedAt: Date.now() },
    },
  })
}

export const recordActivityCompletion = (user, regionSlug, result) => {
  const data = loadActivityData(user)
  const current = getRegionActivity(data, regionSlug)

  return saveActivityData(user, {
    ...data,
    regions: {
      ...data.regions,
      [regionSlug]: {
        ...current,
        completions: current.completions + 1,
        bestScore: Math.max(current.bestScore, result.score ?? 0),
        scoreCap: result.scoreCap ?? current.scoreCap,
        timeSpentSeconds: current.timeSpentSeconds + (result.timeSpentSeconds ?? 0),
        lastCompletedAt: Date.now(),
      },
    },
  })
}

export const saveActivityFeedback = (user, regionSlug, enjoyment) => {
  const data = loadActivityData(user)
  const current = getRegionActivity(data, regionSlug)

  return saveActivityData(user, {
    ...data,
    regions: { ...data.regions, [regionSlug]: { ...current, enjoyment } },
  })
}
