import { Link, useParams } from 'react-router-dom'

import { getGameConfigByRegionSlug } from '../data/gameData'
import { getRegionBySlug } from '../data/worldRegions'
import { DebugSprint } from '../games/DebugSprint'
import { HurdleRunner } from '../games/HurdleRunner'
import { MelodyMemory } from '../games/MelodyMemory'
import { StoryboardShuffle } from '../games/StoryboardShuffle'
import { StorySpark } from '../games/StorySpark'
import { recordActivityCompletion, recordActivityStart } from '../lib/activityStorage'
import { useAuthStore } from '../store/authStore'
import '../styles/games.css'

const gameComponentMap = {
  'tech-city': DebugSprint,
  'creativity-forest': StorySpark,
  'music-island': MelodyMemory,
  'sports-valley': HurdleRunner,
  'media-town': StoryboardShuffle,
}

export const RegionGamePage = () => {
  const { regionSlug } = useParams()
  const user = useAuthStore((state) => state.user)
  const region = getRegionBySlug(regionSlug)
  const game = getGameConfigByRegionSlug(regionSlug)

  if (!region || !game) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 text-center shadow-2xl shadow-purple-950/20 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-300">Unknown Game</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">That region game is not available.</h1>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
              to="/dashboard"
            >
              Return to dashboard
            </Link>
            <Link
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
              to="/world"
            >
              Return to world
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const GameComponent = gameComponentMap[region.slug]

  return (
    <GameComponent
      game={game}
      onActivityComplete={(result) => recordActivityCompletion(user, region.slug, result)}
      onActivityStart={() => recordActivityStart(user, region.slug)}
      region={region}
    />
  )
}
