import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
  User,
  GraduationCap,
  ArrowLeft,
  BookOpen,
} from "@phosphor-icons/react"
// Import SDK client
import { registerUser } from "@/client"

export default function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [major, setMajor] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    general?: string
  }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!name.trim()) {
      newErrors.name = "Full name is required"
    }
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match"
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
      await registerUser({
        body: {
          email,
          password,
          // roleId is assigned server‑side (default 1) – do not send from client
        },
        throwOnError: true
      });
      navigate("/login")
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background font-sans px-4 py-12">
      {/* Subtle dot-grid background — matching Hero and LoginPage */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,82,255,0.06),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,82,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,82,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative w-full max-w-[460px]">
        {/* Back link */}
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
                Create your account
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Join the university recruitment network
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

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                  Full name
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <User size={15} />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className={`h-10 pl-9 text-sm ${errors.name
                        ? "border-destructive focus-visible:ring-destructive/20"
                        : "border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                      }`}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] font-medium text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                  University email
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
                    className={`h-10 pl-9 text-sm ${errors.email
                        ? "border-destructive focus-visible:ring-destructive/20"
                        : "border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                      }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] font-medium text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Major — optional */}
              <div className="space-y-1.5">
                <Label htmlFor="major" className="text-xs font-semibold text-foreground">
                  Major / Field of study{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <BookOpen size={15} />
                  </div>
                  <Input
                    id="major"
                    type="text"
                    placeholder="e.g. Computer Science, Economics…"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    disabled={isLoading}
                    className="h-10 pl-9 text-sm border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                  />
                </div>
              </div>

              {/* Password row — two columns on wider cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                    Password
                  </Label>
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
                      className={`h-10 pl-9 pr-10 text-sm ${errors.password
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
                    <p className="text-[11px] font-medium text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <Lock size={15} />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className={`h-10 pl-9 pr-10 text-sm ${errors.confirmPassword
                          ? "border-destructive focus-visible:ring-destructive/20"
                          : "border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                        }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      disabled={isLoading}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirm ? <EyeSlash size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] font-medium text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t border-foreground/10 pt-5 mt-2">
              {/* Primary CTA */}
              <Button
                id="register-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-brand hover:bg-brand/90 text-white text-sm font-bold cursor-pointer transition-colors border-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <CircleNotch className="animate-spin" size={15} />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Sign in link */}
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-brand hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
