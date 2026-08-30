import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { FullScreenLoader } from './components/FullScreenLoader'
import { GuestRoute } from './components/GuestRoute'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardPage } from './pages/DashboardPage'
import { ExplorationPage } from './pages/ExplorationPage'
import { GigsPage } from './pages/GigsPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RegionDashboardPage } from './pages/RegionDashboardPage'
import { RegionGamePage } from './pages/RegionGamePage'
import { RegisterPage } from './pages/RegisterPage'
import { WorldPage } from './pages/WorldPage'
import { useAuthStore } from './store/authStore'

const AppRoutes = () => {
  const authStatus = useAuthStore((state) => state.authStatus)
  const hasBootstrapped = useAuthStore((state) => state.hasBootstrapped)

  if (!hasBootstrapped || authStatus === 'checking') {
    return (
      <FullScreenLoader
        subtitle="Checking your session and preparing the portal."
        title="Loading GigYaatra"
      />
    )
  }

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardPage />} path="/dashboard" />
        <Route element={<ExplorationPage />} path="/exploration" />
        <Route element={<GigsPage />} path="/gigs" />
        <Route element={<WorldPage />} path="/world" />
        <Route element={<RegionDashboardPage />} path="/regions/:regionSlug" />
        <Route element={<RegionGamePage />} path="/regions/:regionSlug/game" />
      </Route>

      <Route element={<HomePage />} path="/" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  )
}

function App() {
  useEffect(() => {
    useAuthStore.getState().bootstrapAuth()
  }, [])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
