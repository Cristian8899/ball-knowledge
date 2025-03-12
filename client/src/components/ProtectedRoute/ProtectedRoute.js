import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const isAuthenticatedSelector = state => state.loginUser?.user?.token

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useSelector(isAuthenticatedSelector)
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated) {
      window.localStorage.setItem('protected-route-history', location.pathname)
    }
  }, [isAuthenticated, location])

  return isAuthenticated ? element : <Navigate to={{ pathname: '/login', state: { from: location } }} />
}

export default ProtectedRoute
