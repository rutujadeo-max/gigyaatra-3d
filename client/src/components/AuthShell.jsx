import { Link } from 'react-router-dom'

export const AuthShell = ({ title, subtitle, children, alternateLink, alternateText }) => (
  <div className="grid min-h-screen gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
    <section className="flex flex-col justify-between rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/50 p-8 shadow-2xl shadow-purple-950/20">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-purple-300">GigYaatra 3D</p>
        <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Discover the hobbies and careers that fit how you naturally think.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Register or sign in to unlock your personalized exploration hub. Secure JWT auth is ready, protected routes are active, and the next build steps plug into this foundation.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          'Secure access token flow',
          'Refresh token cookie support',
          'Protected dashboard route',
        ].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            {item}
          </div>
        ))}
      </div>
    </section>

    <section className="flex items-center justify-center">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <h2 className="text-3xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-6 text-sm text-slate-400">
          {alternateText}{' '}
          <Link className="font-medium text-purple-300 transition hover:text-purple-200" to={alternateLink.to}>
            {alternateLink.label}
          </Link>
        </p>
      </div>
    </section>
  </div>
)
