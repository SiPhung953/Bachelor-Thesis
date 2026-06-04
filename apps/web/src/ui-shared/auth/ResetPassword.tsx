import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeft, Eye, EyeSlash, CircleNotchIcon, GraduationCapIcon } from "@phosphor-icons/react";
import { resetPassword, validateResetToken } from "@/client/sdk.gen";

/**
 * ResetPassword page – users arrive here via the link sent to their email.
 * The URL contains a "token" query‑parameter which is forwarded to the backend.
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    token?: string;
    general?: string;
  }>({});

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  useEffect(() => {
    async function checkToken() {
      const token = new URLSearchParams(window.location.search).get("token");
      
      if (!token) {
        setTokenValid(false);
        return;
      }
      const response = await validateResetToken({
        query: { 
          token,
        },
      });
      setTokenValid(response?.data?.valid ?? false);
    }
    checkToken();
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setIsLoading(true);
    try {
      await resetPassword({
        body: {
          token,
          newPassword: password,
        },
      });
      // On success, redirect to login with a friendly message.
      navigate("/login", { replace: true });
    } catch (error: any) {
      let errMsg = "Failed to reset password. Please try again later.";
      if (error?.response?.data?.message) {
        errMsg = error.response.data.message;
      } else if (error?.message) {
        errMsg = error.message;
      }
      setErrors({ general: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircleNotchIcon className="animate-spin" size={24} />
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-[420px] border border-foreground/10">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-sm text-destructive font-medium">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password" className="text-sm text-brand hover:underline font-semibold">
              Request a new link
            </Link>
            <br></br>
            <Link to="/" className="text-sm text-brand hover:underline font-semibold">
              Home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background font-sans px-4 py-12">
      {/* Subtle background – matches other auth pages */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,82,255,0.06),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,82,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,82,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative w-full max-w-[420px]">
        {/* Back link */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-brand transition-colors"
        >
          <ArrowLeft size={13} weight="bold" />
          Back to Home
        </Link>

        <Card className="border border-foreground/10 bg-card shadow-lg">
          <CardHeader className="space-y-3 border-b border-foreground/10 pb-6">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center bg-brand text-white">
                <GraduationCapIcon size={18} weight="fill" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-foreground">
                Academia<span className="text-brand">Connect</span>
              </span>
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                Reset Your Password
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Choose a new password for your account.
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

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                  New password
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <GraduationCapIcon size={15} />
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
                  Confirm new password
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <GraduationCapIcon size={15} />
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
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t border-foreground/10 pt-5 mt-2">
              <Button
                id="reset-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-brand hover:bg-brand/90 text-white text-sm font-bold cursor-pointer transition-colors border-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <CircleNotchIcon className="animate-spin" size={15} />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Remembered your password?{' '}
                <Link to="/login" className="font-semibold text-brand hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
