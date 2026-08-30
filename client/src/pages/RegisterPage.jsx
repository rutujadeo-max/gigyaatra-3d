import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthShell } from '../components/AuthShell'
import { useAuthStore } from '../store/authStore'

const initialFormState = {
  name: '',
  email: '',
  password: '',
  age: '',
  grade: '',
}

export const RegisterPage = () => {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const clearAuthError = useAuthStore((state) => state.clearAuthError)
  const authError = useAuthStore((state) => state.authError)
  const isSubmitting = useAuthStore((state) => state.isSubmitting)
  const [formData, setFormData] = useState(initialFormState)

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
      await register({
        ...formData,
        age: Number(formData.age),
      })
      navigate('/dashboard', { replace: true })
    } catch {
      return
    }
  }

  return (
    <AuthShell
      title="Create your explorer account"
      subtitle="Start with a secure profile so the next steps can personalize your avatar, quests, and recommendations."
      alternateLink={{ label: 'Sign in instead', to: '/login' }}
      alternateText="Already registered?"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Full name</span>
            <input
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400"
              name="name"
              onChange={handleChange}
              placeholder="Riya Sharma"
              type="text"
              value={formData.name}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Age</span>
            <input
              required
              min="10"
              max="100"
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400"
              name="age"
              onChange={handleChange}
              placeholder="16"
              type="number"
              value={formData.age}
            />
          </label>
        </div>

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
          <span className="mb-2 block text-sm font-medium text-slate-200">Grade or profession</span>
          <input
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400"
            name="grade"
            onChange={handleChange}
            placeholder="Class 11 / Designer / Student"
            type="text"
            value={formData.grade}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
          <input
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400"
            name="password"
            onChange={handleChange}
            placeholder="At least 8 characters, with upper, lower, number"
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
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}
