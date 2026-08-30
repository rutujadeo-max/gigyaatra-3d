import { Link } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'

export const HomePage = () => {
  const authStatus = useAuthStore((state) => state.authStatus)

  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-purple-950/20 backdrop-blur lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-purple-300">GigYaatra 3D</p>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <section>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              A guided 3D journey into the hobbies and careers you might love.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Your auth foundation is live. Users can register, sign in, refresh sessions securely, and access protected views before the avatar and quest systems arrive.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                to={authStatus === 'authenticated' ? '/dashboard' : '/register'}
              >
                {authStatus === 'authenticated' ? 'Open dashboard' : 'Create your account'}
              </Link>
              <Link
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-purple-400 hover:text-white"
                to="/login"
              >
                Sign in
              </Link>
            </div>
          </section>

          <section className="grid gap-4">
            {[
              'Register with name, email, age, password, and grade or profession',
              'Secure refresh token cookie keeps the session renewable',
              'Protected routing blocks dashboard access when signed out',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-200">
                {item}
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  )
}
