import { Link } from 'react-router-dom'

export const NotFoundPage = () => (
  <main className="flex min-h-screen items-center justify-center px-6">
    <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 text-center shadow-2xl shadow-purple-950/20 backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-purple-300">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-white">That path does not exist yet.</h1>
      <p className="mt-3 text-slate-300">Let&apos;s get you back to the active part of GigYaatra.</p>
      <Link
        className="mt-6 inline-flex rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
        to="/"
      >
        Return home
      </Link>
    </div>
  </main>
)
