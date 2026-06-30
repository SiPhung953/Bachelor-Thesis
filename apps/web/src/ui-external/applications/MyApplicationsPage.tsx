import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/ui-external/landing/components/Header"
import Footer from "@/ui-external/landing/components/Footer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/ui-shared/components/ui/card"
import { Briefcase, CheckCircle, Warning } from "@phosphor-icons/react"
import { getMyApplications, withdrawApplication } from "@/client"
import type { ApplicationListDto } from "@/client/types.gen"
import ApplicationCard from "./components/ApplicationCard"
import EmptyState from "@/ui-shared/components/EmptyState"
import ConfirmationDialog from "@/ui-shared/components/ConfirmationDialog"
import ErrorAlert from "@/ui-shared/components/ErrorAlert"
import LoadingSpinner from "@/ui-shared/components/LoadingSpinner"

export default function MyApplicationsPage() {
  const navigate = useNavigate()

  // State
  const [applications, setApplications] = useState<ApplicationListDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Withdrawal modal state
  const [withdrawId, setWithdrawId] = useState<string | null>(null)
  const [withdrawLoading, setWithdrawLoading] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login", { replace: true })
    }
  }, [navigate])

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getMyApplications({ throwOnError: true })
      setApplications(res.data || [])
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 
        "Failed to retrieve your applications. Please try again later."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  // Start withdrawal flow
  const handleWithdrawClick = (applicationId: string) => {
    setWithdrawId(applicationId)
  }

  // Confirm and execute withdrawal
  const handleWithdrawConfirm = async () => {
    if (!withdrawId) return

    setWithdrawLoading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      await withdrawApplication({
        path: { applicationId: withdrawId },
        throwOnError: true,
      })

      // Update status in local UI state
      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === withdrawId
            ? { ...app, status: "WITHDRAWN" as const }
            : app
        )
      )
      
      setSuccessMessage("Application withdrawn successfully.")
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 
        "Failed to withdraw application. Please try again."
      )
    } finally {
      setWithdrawLoading(false)
      setWithdrawId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-brand/20 selection:text-brand flex flex-col">
      <Header />

      <main className="flex-1 bg-secondary/35 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header area */}
          <div className="space-y-1.5">
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground">
              My Applications
            </h1>
            <p className="text-xs text-muted-foreground">
              Monitor the status of your submitted job applications and manage withdrawals.
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle size={16} weight="fill" className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Alert */}
          {error && <ErrorAlert title="Application Error" message={error} />}

          {/* Main content card */}
          {loading ? (
            <Card className="border border-foreground/10 bg-card shadow-sm">
              <CardContent className="py-12">
                <LoadingSpinner message="Loading your applications..." />
              </CardContent>
            </Card>
          ) : applications.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={40} />}
              title="No Applications Found"
              description="You haven't applied for any jobs yet. Browse available jobs and submit your first application."
              actionLabel="Search Jobs"
              onActionClick={() => navigate("/")}
            />
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <ApplicationCard
                  key={app.applicationId}
                  application={app}
                  onWithdraw={handleWithdrawClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Dialog for Withdrawal */}
      <ConfirmationDialog
        isOpen={withdrawId !== null}
        onClose={() => setWithdrawId(null)}
        onConfirm={handleWithdrawConfirm}
        isLoading={withdrawLoading}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone, and the employer will see that your application has been withdrawn."
        confirmLabel="Yes, Withdraw"
        cancelLabel="Cancel"
        isDestructive
      />

      <Footer />
    </div>
  )
}
