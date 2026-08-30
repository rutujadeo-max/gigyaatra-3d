import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
  </div>
)

export const GameShell = ({
  region,
  title,
  description,
  instructions,
  isStarted,
  isComplete,
  onStart,
  onRestart,
  stats = [],
  statusMessage,
  children,
  completionTitle,
  completionMessage,
  completionContent,
  startLabel = 'Start Game',
  activityResult,
  onActivityStart,
  onActivityComplete,
}) => {
  const regionPath = `/regions/${region.slug}`
  const startedAtRef = useRef(null)
  const recordedCompletionRef = useRef(false)

  const handleStart = () => {
    startedAtRef.current = Date.now()
    recordedCompletionRef.current = false
    onActivityStart?.()
    onStart()
  }

  const handleRestart = () => {
    startedAtRef.current = Date.now()
    recordedCompletionRef.current = false
    onActivityStart?.()
    onRestart()
  }

  useEffect(() => {
    if (!isComplete || recordedCompletionRef.current) {
      return
    }

    recordedCompletionRef.current = true
    onActivityComplete?.({
      ...activityResult,
      timeSpentSeconds: Math.max(1, Math.round((Date.now() - (startedAtRef.current ?? Date.now())) / 1000)),
    })
  }, [activityResult, isComplete, onActivityComplete])

  return (
    <main
      className="min-h-screen px-6 py-10 lg:px-10"
      style={{
        '--game-accent': region.accent,
        '--game-color': region.color,
      }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <section
          className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/30"
          style={{
            background: `linear-gradient(135deg, ${region.color}45 0%, rgba(15, 23, 42, 0.94) 58%)`,
          }}
        >
          <div className="border-b border-white/10 px-8 py-10 lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/75">Region Game</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white lg:text-5xl">
              {region.name}: {title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-100/90 lg:text-lg lg:leading-8">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                to={regionPath}
              >
                Back to {region.name}
              </Link>
              <Link
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                to="/dashboard"
              >
                Dashboard overview
              </Link>
            </div>
          </div>

          <div className="grid gap-4 px-8 py-6 lg:grid-cols-3 lg:px-10">
            {stats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--game-accent)]">
            Instructions
          </p>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {instructions.map((instruction, index) => (
              <div
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200"
                key={instruction}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Step {index + 1}
                </p>
                <p className="mt-2">{instruction}</p>
              </div>
            ))}
          </div>
        </section>

        {!isStarted ? (
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 text-center shadow-2xl shadow-black/20">
            <p className="text-sm leading-7 text-slate-300">
              Launch the region challenge when you are ready. The game runs locally and keeps all
              progress on this page.
            </p>
            <button
              className="mt-6 rounded-full bg-[var(--game-accent)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              onClick={handleStart}
              type="button"
            >
              {startLabel}
            </button>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--game-accent)]">
                Game Area
              </p>
              <div className="mt-5">{children}</div>
            </div>

            <div className="space-y-6">
              <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--game-accent)]">
                  Status
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-300">{statusMessage}</p>
              </section>

              {isComplete && (
                <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--game-accent)]">
                    Completion
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{completionTitle}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{completionMessage}</p>
                  {completionContent && <div className="mt-5">{completionContent}</div>}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      className="rounded-full bg-[var(--game-accent)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                      onClick={handleRestart}
                      type="button"
                    >
                      Play Again
                    </button>
                    <Link
                      className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                      to={regionPath}
                    >
                      Return to {region.name}
                    </Link>
                  </div>
                </section>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
