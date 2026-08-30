import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'

export const GuestRoute = () => {
  const authStatus = useAuthStore((state) => state.authStatus)

  if (authStatus === 'authenticated') {
    return <Navigate replace to="/dashboard" />
  }

  return <Outlet />
}
