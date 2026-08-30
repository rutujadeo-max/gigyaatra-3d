import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'

export const ProtectedRoute = () => {
  const authStatus = useAuthStore((state) => state.authStatus)
  const location = useLocation()

  if (authStatus !== 'authenticated') {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}
