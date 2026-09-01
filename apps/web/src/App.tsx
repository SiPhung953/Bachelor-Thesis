import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { LoginPage } from "@/ui-external/auth/LoginPage"
import ForgotPasswordPage from "@/ui-external/auth/ForgotPasswordPage"
import RegisterPage from "@/ui-external/auth/RegisterPage"
import LandingPage from "@/ui-external/landing/LandingPage"
import DashboardPage from "@/ui-external/dashboard/DashboardPage"
import ResetPasswordPage from "./ui-external/auth/ResetPassword"
import JobDetailPage from "@/ui-external/public/JobDetailPage"
import CompanyProfilePage from "@/ui-external/public/CompanyProfilePage"
import ProfilePage from "@/ui-external/profile/ProfilePage"
import ApplyJobPage from "@/ui-external/applications/ApplyJobPage"
import MyApplicationsPage from "@/ui-external/applications/MyApplicationsPage"

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

      {/* Public Job Details Page */}
      <Route path="/jobs/:jobId" element={<JobDetailPage />} />

      {/* Public Company Profile Page */}
      <Route path="/companies/:companyId" element={<CompanyProfilePage />} />

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

      {/* Protected Profile Route */}
      <Route
        path="/profile"
        element={
          isLoggedIn ? (
            <ProfilePage userEmail={userEmail} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected Applications Routes */}
      <Route
        path="/applications"
        element={
          isLoggedIn ? (
            <MyApplicationsPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/jobs/:jobId/apply"
        element={
          isLoggedIn ? (
            <ApplyJobPage />
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

