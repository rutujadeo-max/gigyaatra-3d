import { create } from 'zustand'

const initialState = {
  avatarPosition: { x: 0, z: 0 },
  activeRegionId: null,
  visitedRegionIds: [],
}

export const useWorldStore = create((set) => ({
  ...initialState,
  setWorldState: ({ avatarPosition, activeRegionId }) =>
    set((state) => {
      const positionDidChange =
        Math.abs(state.avatarPosition.x - avatarPosition.x) > 0.04 ||
        Math.abs(state.avatarPosition.z - avatarPosition.z) > 0.04

      const regionDidChange = state.activeRegionId !== activeRegionId

      if (!positionDidChange && !regionDidChange) {
        return state
      }

      return {
        avatarPosition,
        activeRegionId,
        visitedRegionIds:
          activeRegionId && !state.visitedRegionIds.includes(activeRegionId)
            ? [...state.visitedRegionIds, activeRegionId]
            : state.visitedRegionIds,
      }
    }),
  resetWorldState: () => set(initialState),
}))
