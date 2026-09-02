import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/ui-shared/components/ui/button"
import { Input } from "@/ui-shared/components/ui/input"
import { Label } from "@/ui-shared/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/ui-shared/components/ui/card"
import {
  Eye,
  EyeSlash,
  CircleNotch,
  Lock,
  Envelope,
  GraduationCap,
  ArrowLeft,
} from "@phosphor-icons/react"
// Import SDK client
import { authenticateUser } from "@/client"

interface LoginPageProps {
  // Callback function to notify parent of successful login
  onLoginSuccess: (accessToken: string, email: string, roleId: number) => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  // State variables for form inputs and loading state
  // E.g. Email state to store form inputs
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // Cosmetics: Whether to show password or (fake) loading
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Error states, used for frontend validation & Backend error messages
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    general?: string
  }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!email) {
      // regex UX email validation
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      // Very basic regex, will make a better one later
      newErrors.email = "Please enter a valid email address"
    }
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      // Checking for the sake of checking on god
      newErrors.password = "Password must be at least 6 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (!validate()) return
    setIsLoading(true)
    try {
      // 1. SDK call to authenticate user
      const response = await authenticateUser({
        body: { email, password },
        throwOnError: true,
      })
      const data = response.data

      // 2. Hand the session to AuthProvider, which persists it and
      //    updates the app state in one place.
      onLoginSuccess(data.accessToken, data.user.email, data.user.roleId)
    } catch (error) {
      // Enhanced error handling for various backend responses
      const err: any = error;
      let errMsg = "Authentication failed. Please check your credentials.";
      if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      } else if (err.response?.status) {
        switch (err.response.status) {
          case 400:
            errMsg = "Invalid request.";
            break;
          case 401:
          case 404:
            errMsg = "Invalid email or password.";
            break;
          case 403:
            errMsg = "Your account has been banned.";
            break;
          default:
            errMsg = `Request failed with status code ${err.response.status}`;
        }
      } else if (err.message) {
        errMsg = err.message;
      }
      setErrors({ general: errMsg });
    } finally {
      setIsLoading(false)
    }
  }

  // Fancy TailwindCSS stuff that I don't care about
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background font-sans px-4 py-12">
      {/* Subtle dot-grid background matching the landing page Hero */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,82,255,0.06),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,82,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,82,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative w-full max-w-[420px]">
        {/* Back to landing */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-brand transition-colors"
        >
          <ArrowLeft size={13} weight="bold" />
          Back to Home
        </Link>

        <Card className="border border-foreground/10 bg-card shadow-lg">
          {/* Card Header */}
          <CardHeader className="space-y-3 border-b border-foreground/10 pb-6">
            {/* Brand mark */}
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center bg-brand text-white">
                <GraduationCap size={18} weight="fill" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-foreground">
                Academia<span className="text-brand">Connect</span>
              </span>
            </div>

            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                Welcome back
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Sign in to your account to continue
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {/* General error */}
              {errors.general && (
                <div className="rounded-none border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive">
                  {errors.general}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-foreground"
                >
                  Email address
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Envelope size={15} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className={`h-10 pl-9 text-sm ${
                      errors.email
                        ? "border-destructive focus-visible:ring-destructive/20"
                        : "border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold text-foreground"
                  >
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock size={15} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className={`h-10 pl-9 pr-10 text-sm ${
                      errors.password
                        ? "border-destructive focus-visible:ring-destructive/20"
                        : "border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeSlash size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t border-foreground/10 pt-5 mt-2">
              {/* Primary CTA */}
              <Button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-brand hover:bg-brand/90 text-white text-sm font-bold cursor-pointer transition-colors border-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <CircleNotch className="animate-spin" size={15} />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Register link */}
              <p className="text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-brand hover:underline"
                >
                  Create one
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}