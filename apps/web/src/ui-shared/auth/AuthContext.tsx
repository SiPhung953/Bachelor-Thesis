import { createContext, useContext, useState, type ReactNode } from "react"
import { RoleConstant } from "./RoleConstant"

const TOKEN_KEY = "accessToken"
const EMAIL_KEY = "userEmail"
const ROLE_KEY = "roleId"

interface AuthState {
  isLoggedIn: boolean
  email: string
  roleId: number | null
  isEmployer: boolean
  isJobSeeker: boolean
  login: (accessToken: string, email: string, roleId: number) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

/** Read the persisted session once, synchronously, before the first render. */
function readStoredSession() {
  const token = localStorage.getItem(TOKEN_KEY)
  const email = localStorage.getItem(EMAIL_KEY)
  const storedRole = localStorage.getItem(ROLE_KEY)
  const roleId = storedRole === null ? null : Number(storedRole)

  return {
    isLoggedIn: Boolean(token && email),
    email: email ?? "",
    roleId: Number.isFinite(roleId) ? roleId : null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // A lazy initialiser runs during the first render, so a refresh never
  // flashes the logged-out UI before the session is restored.
  const [session, setSession] = useState(readStoredSession)

  const login = (accessToken: string, email: string, roleId: number) => {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(EMAIL_KEY, email)
    localStorage.setItem(ROLE_KEY, String(roleId))
    setSession({ isLoggedIn: true, email, roleId })
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
    localStorage.removeItem(ROLE_KEY)
    setSession({ isLoggedIn: false, email: "", roleId: null })
  }

  const value: AuthState = {
    ...session,
    isEmployer: session.roleId === RoleConstant.EMPLOYER,
    isJobSeeker: session.roleId === RoleConstant.JOB_SEEKER,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>")
  }
  return context
}
