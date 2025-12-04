import { createContext, useContext, useState, useEffect } from 'react'
import { auth, getStoredTokens, storeTokens } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

const AUTH_USER_KEY = 'authUser'

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const storeUser = (user) => {
  if (!user) {
    localStorage.removeItem(AUTH_USER_KEY)
    return
  }
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const restoreSession = async () => {
    try {
      const tokens = getStoredTokens()
      const storedUser = getStoredUser()

      if (!tokens?.access) {
        setLoading(false)
        return
      }

      if (storedUser) {
        setUser(storedUser)
      }

      const profile = await auth.getProfile()
      setUser(profile)
      storeUser(profile)
    } catch {
      setUser(null)
      storeUser(null)
      storeTokens(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    restoreSession()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await auth.login({ email, password })
      storeTokens({ access: data.access, refresh: data.refresh })
      storeUser(data.user)
      setUser(data.user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.detail || 'Login failed'
      }
    }
  }

  const register = async (data) => {
    try {
      const result = await auth.register(data)
      storeTokens({ access: result.access, refresh: result.refresh })
      storeUser(result.user)
      setUser(result.user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.detail || 'Registration failed'
      }
    }
  }

  const logout = () => {
    setUser(null)
    storeTokens(null)
    storeUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      restoreSession
    }}>
      {children}
    </AuthContext.Provider>
  )
}
