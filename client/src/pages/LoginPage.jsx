import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AuthShell } from '../components/AuthShell'
import { useAuthStore } from '../store/authStore'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const clearAuthError = useAuthStore((state) => state.clearAuthError)
  const authError = useAuthStore((state) => state.authError)
  const isSubmitting = useAuthStore((state) => state.isSubmitting)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const nextPath = location.state?.from?.pathname || '/dashboard'

  const handleChange = (event) => {
    const { name, value } = event.target
    clearAuthError()
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await login(formData)
      navigate(nextPath, { replace: true })
    } catch {
      return
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue exploring your personalized discovery hub."
      alternateLink={{ label: 'Create one here', to: '/register' }}
      alternateText="Need an account?"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Email address</span>
          <input
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            type="email"
            value={formData.email}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
          <input
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400"
            name="password"
            onChange={handleChange}
            placeholder="Enter your password"
            type="password"
            value={formData.password}
          />
        </label>

        {authError ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {authError}
          </div>
        ) : null}

        <button
          className="w-full rounded-2xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <button
          className="w-full rounded-2xl border border-dashed border-white/15 px-5 py-3 text-sm font-medium text-slate-400"
          disabled
          type="button"
        >
          Google sign-in coming soon
        </button>
      </form>
    </AuthShell>
  )
}
