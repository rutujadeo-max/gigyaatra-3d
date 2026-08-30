import { Link, useNavigate } from 'react-router-dom'

import { worldRegions } from '../data/worldRegions'
import { useAuthStore } from '../store/authStore'
import { useWorldStore } from '../store/worldStore'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const isSubmitting = useAuthStore((state) => state.isSubmitting)
  const visitedRegionIds = useWorldStore((state) => state.visitedRegionIds)

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-2xl shadow-purple-950/20 backdrop-blur lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-300">Explorer Dashboard</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white lg:text-5xl">
              Welcome back, {user?.name ?? 'Explorer'}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              Step 4 is live: your protected account now opens into a navigable 3D world with five themed regions, smooth camera follow, floating labels, and clickable district dashboards.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                to="/world"
              >
                Enter the 3D world
              </Link>
              <Link
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-purple-400 hover:text-white"
                to="/exploration"
              >
                My Exploration
              </Link>
              <button
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-purple-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                onClick={handleLogout}
                type="button"
              >
                {isSubmitting ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-2 text-lg font-medium text-white">{user?.email}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Grade / Profession</p>
              <p className="mt-2 text-lg font-medium text-white">{user?.grade}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Level</p>
              <p className="mt-2 text-lg font-medium text-white">{user?.level ?? 1}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Regions Visited</p>
              <p className="mt-2 text-lg font-medium text-white">{visitedRegionIds.length}/5</p>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-300">World Regions</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Five destinations to explore</h2>
            </div>
            <Link
              className="text-sm font-medium text-purple-300 transition hover:text-purple-200"
              to="/world"
            >
              Open live world map →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            {worldRegions.map((region) => (
              <Link
                className="rounded-[1.5rem] border border-white/10 p-5 transition hover:-translate-y-1 hover:border-white/20"
                key={region.id}
                style={{ backgroundColor: `${region.color}16` }}
                to={`/regions/${region.slug}`}
              >
                <div
                  className="h-3 w-14 rounded-full"
                  style={{ backgroundColor: region.accent }}
                />
                <h3 className="mt-4 text-lg font-semibold text-white">{region.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{region.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
