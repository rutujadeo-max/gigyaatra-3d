import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { WorldCanvas } from '../components/world/WorldCanvas'
import { WorldMinimap } from '../components/world/WorldMinimap'
import { getRegionById, worldRegions } from '../data/worldRegions'
import { useAuthStore } from '../store/authStore'
import { useWorldStore } from '../store/worldStore'

export const WorldPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const isSubmitting = useAuthStore((state) => state.isSubmitting)
  const activeRegionId = useWorldStore((state) => state.activeRegionId)
  const visitedRegionIds = useWorldStore((state) => state.visitedRegionIds)

  const activeRegion = useMemo(
    () => getRegionById(activeRegionId) ?? worldRegions[0],
    [activeRegionId],
  )

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <main className="relative h-screen overflow-hidden bg-[#050816] text-white">
      <div className="absolute inset-0">
        <WorldCanvas
          avatarConfig={user?.avatarConfig ?? {}}
          onRegionSelect={(regionSlug) => navigate(`/regions/${regionSlug}`)}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 lg:p-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="pointer-events-auto max-w-xl rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-300">GigYaatra 3D World</p>
            <h1 className="mt-3 text-2xl font-semibold text-white lg:text-3xl">
              Explore the map, {user?.name?.split(' ')[0] ?? 'Explorer'}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Move with arrow keys or WASD. The camera follows your avatar, each district pulses with its own energy, and every colored zone opens a region dashboard.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
                to="/dashboard"
              >
                Back to dashboard
              </Link>
              <button
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                onClick={handleLogout}
                type="button"
              >
                {isSubmitting ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>

          <div className="pointer-events-auto hidden lg:block">
            <WorldMinimap />
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="pointer-events-auto max-w-xl rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-purple-300">Active region</p>
                <h2 className="mt-2 text-2xl font-semibold">{activeRegion.name}</h2>
                <p className="mt-2 text-sm text-slate-300">{activeRegion.subtitle}</p>
              </div>

              <div
                className="rounded-2xl border border-white/10 px-4 py-3 text-right"
                style={{ backgroundColor: `${activeRegion.color}26` }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Visited</p>
                <p className="mt-1 text-2xl font-semibold">{visitedRegionIds.length}/5</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">{activeRegion.description}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              {activeRegion.quests.map((quest) => (
                <span
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                  key={quest}
                >
                  {quest}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <button
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                onClick={() => navigate(`/regions/${activeRegion.slug}`)}
                type="button"
              >
                Open {activeRegion.name}
              </button>
            </div>
          </div>

          <div className="pointer-events-auto lg:hidden">
            <WorldMinimap />
          </div>
        </div>
      </div>
    </main>
  )
}
