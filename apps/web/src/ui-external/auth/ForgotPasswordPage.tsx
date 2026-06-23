import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/ui-shared/components/ui/button";
import { Input } from "@/ui-shared/components/ui/input";
import { Label } from "@/ui-shared/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/ui-shared/components/ui/card";
import { ArrowLeft, Envelope, CircleNotch, GraduationCap } from "@phosphor-icons/react";
import { requestPasswordReset } from "@/client";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  // const [showPassword, setShowPassword] = useState(false); // for consistency, not used
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
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
      await requestPasswordReset({
        body: { email },
        throwOnError: true,
      });
      alert("If an account with this email exists, you will receive reset instructions.");
      navigate("/login");
    } catch (_) {
      setErrors({ general: "Failed to request password reset. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background font-sans px-4 py-12">
      {/* Subtle dot‑grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,82,255,0.06),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,82,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,82,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative w-full max-w-[420px]">
        {/* Back link */}
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-brand transition-colors"
        >
          <ArrowLeft size={13} weight="bold" />
          Back to Sign In
        </Link>

        <Card className="border border-foreground/10 bg-card shadow-lg">
          <CardHeader className="space-y-3 border-b border-foreground/10 pb-6">
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
                Forgot your password?
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Enter your email to receive a password reset link.
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {errors.general && (
                <div className="rounded-none border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive">
                  {errors.general}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground">
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
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                    className={`h-10 pl-9 text-sm ${errors.email ? "border-destructive focus-visible:ring-destructive/20" : "border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] font-medium text-destructive">{errors.email}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t border-foreground/10 pt-5 mt-2">
              <Button
                id="reset-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-brand hover:bg-brand/90 text-white text-sm font-bold transition-colors border-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <CircleNotch className="animate-spin" size={15} />
                    Sending…
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Remembered? <Link to="/login" className="font-semibold text-brand hover:underline">Sign in</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
