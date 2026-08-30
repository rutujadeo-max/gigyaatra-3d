const STORAGE_PREFIX = 'gigyaatra-gigs-v1'

const keyFor = (user) => `${STORAGE_PREFIX}:${user?.id ?? user?.email ?? 'local-explorer'}`
const emptyData = () => ({ savedGigIds: [], progressByGig: {} })

export const loadGigData = (user) => {
  try {
    const stored = window.localStorage.getItem(keyFor(user))
    return stored ? { ...emptyData(), ...JSON.parse(stored) } : emptyData()
  } catch {
    return emptyData()
  }
}

const saveGigData = (user, data) => {
  window.localStorage.setItem(keyFor(user), JSON.stringify(data))
  return data
}

export const toggleSavedGig = (user, data, gigId) => {
  const savedGigIds = data.savedGigIds.includes(gigId)
    ? data.savedGigIds.filter((id) => id !== gigId)
    : [...data.savedGigIds, gigId]

  return saveGigData(user, { ...data, savedGigIds })
}

export const toggleGigRoadmapStep = (user, data, gigId, stepIndex) => {
  const completedSteps = data.progressByGig[gigId] ?? []
  const nextSteps = completedSteps.includes(stepIndex)
    ? completedSteps.filter((index) => index !== stepIndex)
    : [...completedSteps, stepIndex]

  return saveGigData(user, {
    ...data,
    progressByGig: { ...data.progressByGig, [gigId]: nextSteps },
  })
}
