import { Link, useParams } from 'react-router-dom'

import { getGameConfigByRegionSlug } from '../data/gameData'
import { getRegionBySlug } from '../data/worldRegions'

export const RegionDashboardPage = () => {
  const { regionSlug } = useParams()
  const region = getRegionBySlug(regionSlug)
  const game = getGameConfigByRegionSlug(regionSlug)

  if (!region) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 text-center shadow-2xl shadow-purple-950/20 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-300">Unknown Region</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">That world region does not exist.</h1>
          <Link
            className="mt-6 inline-flex rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
            to="/world"
          >
            Return to the 3D world
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/30 backdrop-blur">
        <section
          className="border-b border-white/10 px-8 py-10 lg:px-10"
          style={{
            background: `linear-gradient(135deg, ${region.color}40 0%, rgba(15,23,42,0.92) 55%)`,
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/75">Region Dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">{region.name}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-100/90">{region.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              to="/world"
            >
              Back to world
            </Link>
            {game && (
              <Link
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                to={`/regions/${region.slug}/game`}
              >
                Play {game.title}
              </Link>
            )}
            <Link
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
              to="/dashboard"
            >
              Dashboard overview
            </Link>
          </div>
        </section>

        <section className="grid gap-6 px-8 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-300">Focus Areas</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{region.subtitle}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                This region dashboard is ready before quests arrive. It gives each world zone a destination page and lays the groundwork for region-specific challenges, AI mentor conversations, and recommendations.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-300">Quest Preview</p>
              <div className="mt-4 grid gap-4">
                {region.quests.map((quest, index) => (
                  <div
                    className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"
                    key={quest}
                  >
                    <p className="text-sm font-semibold text-white">Quest {index + 1}</p>
                    <p className="mt-2 text-sm text-slate-300">{quest}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {game && (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-300">Region Game</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{game.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">{game.summary}</p>
                <Link
                  className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  to={`/regions/${region.slug}/game`}
                >
                  Start game
                </Link>
              </div>
            )}

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-300">Mentor NPC</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{region.mentorName}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Mentor chat arrives in Step 8. This page already knows who guides the region so the AI panel can plug in cleanly later.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-300">Navigation</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>Click colored zones in the world to open region dashboards.</li>
                <li>Use the minimap to jump directly between regions.</li>
                <li>Return to the world anytime to keep exploring the full map.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
