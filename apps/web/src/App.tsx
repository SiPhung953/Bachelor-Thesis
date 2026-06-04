import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { LoginPage } from "@/ui-shared/auth/LoginPage"
import ForgotPasswordPage from "@/ui-shared/auth/ForgotPasswordPage"
import RegisterPage from "@/ui-shared/auth/RegisterPage"
import LandingPage from "@/ui-external/landing/LandingPage"
import DashboardPage from "@/ui-internal/dashboard/DashboardPage"
import ResetPasswordPage from "./ui-shared/auth/ResetPassword"

function AppContent() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  // Restore user session from localStorage if present
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const email = localStorage.getItem("userEmail")
    if (token && email) {
      setIsLoggedIn(true)
      setUserEmail(email)
    }
  }, [])

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email)
    setIsLoggedIn(true)
    localStorage.setItem("userEmail", email)
    navigate("/dashboard")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserEmail("")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userEmail")
    navigate("/")
  }

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Registration Page */}
      <Route
        path="/register"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      {/* Secure Sign In Page */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <DashboardPage userEmail={userEmail} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Fallback to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
