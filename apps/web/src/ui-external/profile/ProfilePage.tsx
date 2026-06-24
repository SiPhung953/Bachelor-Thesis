import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/ui-external/landing/components/Header"
import Footer from "@/ui-external/landing/components/Footer"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/ui-shared/components/ui/card"
import { Button } from "@/ui-shared/components/ui/button"
import { Input } from "@/ui-shared/components/ui/input"
import { Label } from "@/ui-shared/components/ui/label"
import {
  User,
  Briefcase,
  FilePdf,
  Lock,
  CircleNotch,
  Eye,
  EyeSlash,
  CheckCircle,
  CloudArrowUp,
  DownloadSimple,
  Trash,
  Warning,
  File,
} from "@phosphor-icons/react"
import {
  getMyProfile,
  updatePersonalInformation,
  getJobPreference,
  updateJobPreference,
  getMyResumes,
  uploadResume,
  deleteResume,
  changePassword,
  changeAvatar,
} from "@/client"
import type {
  ResumeDto,
} from "@/client/types.gen"

// ─── helpers ───────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// ─── sub-components ────────────────────────────────────────────────────────

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
      <CheckCircle size={14} weight="fill" className="shrink-0" />
      {message}
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive">
      <Warning size={14} weight="fill" className="shrink-0" />
      {message}
    </div>
  )
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <CardHeader className="border-b border-foreground/10 pb-5">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center bg-brand/10 text-brand">
          {icon}
        </div>
        <div>
          <CardTitle className="text-sm font-bold tracking-tight text-foreground uppercase">
            {title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  )
}

// ─── Toggle Button group ────────────────────────────────────────────────────

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  disabled,
}: {
  options: { label: string; value: T }[]
  value: T
  onChange: (v: T) => void
  disabled?: boolean
}) {
  return (
    <div className="flex border border-foreground/15 overflow-hidden w-full grid grid-cols-2 sm:w-auto">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={[
            "flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
            i > 0 ? "border-l border-foreground/15" : "",
            value === opt.value
              ? "bg-brand text-white"
              : "bg-background text-foreground/70 hover:text-brand hover:bg-brand/5",
            "disabled:opacity-50 disabled:pointer-events-none",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── CV File Type Badge ─────────────────────────────────────────────────────

function FileTypeBadge({ type }: { type: "PDF" | "DOC" | "DOCX" }) {
  const colour =
    type === "PDF"
      ? "text-red-600 bg-red-50 border-red-200"
      : "text-blue-600 bg-blue-50 border-blue-200"
  return (
    <span
      className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colour}`}
    >
      <FilePdf size={10} weight="fill" />
      {type}
    </span>
  )
}

// ─── field helper ──────────────────────────────────────────────────────────

function FormField({
  id,
  label,
  required,
  optional,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
        {optional && (
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p className="text-[11px] font-medium text-destructive">{error}</p>
      )}
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

interface ProfilePageProps {
  userEmail: string
  onLogout: () => void
}

export default function ProfilePage({ userEmail }: ProfilePageProps) {
  const navigate = useNavigate()

  // Redirect to login if no token
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login", { replace: true })
    }
  }, [navigate])

  // ── Section 1: Personal Information ──────────────────────────────────────

  const [pi, setPi] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    city: "",
    headline: "",
    summary: "",
  })
  const [piLoading, setPiLoading] = useState(true)
  const [piSaving, setPiSaving] = useState(false)
  const [piErrors, setPiErrors] = useState<Record<string, string>>({})
  const [piSuccess, setPiSuccess] = useState("")
  const [piError, setPiError] = useState("")

  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState("")
  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getMyProfile({ throwOnError: true })
      .then((res) => {
        const p = res.data.profile
        if (p) {
          setPi({
            fullName: p.fullName ?? "",
            phoneNumber: p.phoneNumber ?? "",
            dateOfBirth: p.dateOfBirth
              ? p.dateOfBirth.slice(0, 10)
              : "",
            city: p.city ?? "",
            headline: p.headline ?? "",
            summary: p.summary ?? "",
          })
          const url = (p as any).avatarUrl || localStorage.getItem(`profile_avatar_${userEmail}`) || ""
          setAvatarUrl(url)
        }
      })
      .catch(() => {})
      .finally(() => setPiLoading(false))
  }, [userEmail])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowed.includes(file.type)) {
      setAvatarError("Only JPG, JPEG, and PNG images are allowed.")
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setAvatarError("Image file must not exceed 3MB.")
      return
    }

    setAvatarError("")
    setAvatarUploading(true)
    try {
      const res = await changeAvatar({
        body: { file },
        throwOnError: true,
      })
      if (res.data?.avatarUrl) {
        setAvatarUrl(res.data.avatarUrl)
        localStorage.setItem(`profile_avatar_${userEmail}`, res.data.avatarUrl)
      }
    } catch (err: any) {
      setAvatarError(err?.response?.data?.message ?? "Failed to upload avatar. Please try again.")
    } finally {
      setAvatarUploading(false)
      if (avatarInputRef.current) avatarInputRef.current.value = ""
    }
  }

  const validatePi = () => {
    const errs: Record<string, string> = {}
    if (!pi.fullName.trim()) errs.fullName = "Full name is required."
    if (!pi.phoneNumber.trim()) errs.phoneNumber = "Phone number is required."
    return errs
  }

  const handleSavePi = async (e: React.FormEvent) => {
    e.preventDefault()
    setPiSuccess("")
    setPiError("")
    const errs = validatePi()
    if (Object.keys(errs).length) { setPiErrors(errs); return }
    setPiErrors({})
    setPiSaving(true)
    try {
      await updatePersonalInformation({
        body: {
          fullName: pi.fullName,
          phoneNumber: pi.phoneNumber,
          dateOfBirth: pi.dateOfBirth || null,
          city: pi.city || undefined,
          headline: pi.headline || undefined,
          summary: pi.summary || undefined,
        },
        throwOnError: true,
      })
      setPiSuccess("Personal information saved successfully.")
    } catch (err: any) {
      setPiError(
        err?.response?.data?.message ?? "Failed to save changes. Please try again."
      )
    } finally {
      setPiSaving(false)
    }
  }

  // ── Section 2: Job Preferences ───────────────────────────────────────────

  const [jp, setJp] = useState({
    profileVisibility: "VISIBLE_TO_EMPLOYERS" as "VISIBLE_TO_EMPLOYERS" | "PRIVATE",
    jobSearchStatus: "OPEN_TO_WORK" as "OPEN_TO_WORK" | "NOT_LOOKING",
    desiredJobTitle: "",
    preferredLocation: "",
  })
  const [jpLoading, setJpLoading] = useState(true)
  const [jpSaving, setJpSaving] = useState(false)
  const [jpSuccess, setJpSuccess] = useState("")
  const [jpError, setJpError] = useState("")

  useEffect(() => {
    getJobPreference({ throwOnError: true })
      .then((res) => {
        const pref = res.data.preference
        if (pref) {
          setJp({
            profileVisibility: pref.profileVisibility ?? "VISIBLE_TO_EMPLOYERS",
            jobSearchStatus: pref.jobSearchStatus ?? "OPEN_TO_WORK",
            desiredJobTitle: pref.desiredJobTitle ?? "",
            preferredLocation: pref.preferredLocation ?? "",
          })
        }
      })
      .catch(() => {})
      .finally(() => setJpLoading(false))
  }, [])

  const handleSaveJp = async (e: React.FormEvent) => {
    e.preventDefault()
    setJpSuccess("")
    setJpError("")
    setJpSaving(true)
    try {
      await updateJobPreference({
        body: {
          profileVisibility: jp.profileVisibility,
          jobSearchStatus: jp.jobSearchStatus,
          desiredJobTitle: jp.desiredJobTitle || undefined,
          preferredLocation: jp.preferredLocation || undefined,
        },
        throwOnError: true,
      })
      setJpSuccess("Job preferences saved successfully.")
    } catch (err: any) {
      setJpError(
        err?.response?.data?.message ?? "Failed to save preferences. Please try again."
      )
    } finally {
      setJpSaving(false)
    }
  }

  // ── Section 3: CV Management ─────────────────────────────────────────────

  const [resumes, setResumes] = useState<ResumeDto[]>([])
  const [resumesLoading, setResumesLoading] = useState(true)
  const [cvTitle, setCvTitle] = useState("")
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvUploading, setCvUploading] = useState(false)
  const [cvUploadError, setCvUploadError] = useState("")
  const [cvUploadSuccess, setCvUploadSuccess] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ACCEPTED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]
  const MAX_SIZE = 5 * 1024 * 1024

  const fetchResumes = () => {
    setResumesLoading(true)
    getMyResumes({ throwOnError: true })
      .then((res) => setResumes(res.data.resumes ?? []))
      .catch(() => setResumes([]))
      .finally(() => setResumesLoading(false))
  }

  useEffect(() => { fetchResumes() }, [])

  const validateFile = (file: File): string => {
    if (!ACCEPTED_TYPES.includes(file.type))
      return "Unsupported file type. Please upload a PDF, DOC, or DOCX file."
    if (file.size > MAX_SIZE)
      return "File size exceeds 5 MB limit."
    return ""
  }

  const handleFileSelect = (file: File) => {
    const err = validateFile(file)
    if (err) { setCvUploadError(err); setCvFile(null); return }
    setCvUploadError("")
    setCvFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setCvUploadSuccess("")
    setCvUploadError("")
    if (!cvTitle.trim()) { setCvUploadError("CV title is required."); return }
    if (!cvFile) { setCvUploadError("Please select a file to upload."); return }
    setCvUploading(true)
    try {
      await uploadResume({
        body: { resumeTitle: cvTitle.trim(), resumeFile: cvFile },
        throwOnError: true,
      })
      setCvUploadSuccess("CV uploaded successfully.")
      setCvTitle("")
      setCvFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      fetchResumes()
    } catch (err: any) {
      setCvUploadError(
        err?.response?.data?.message ?? "Upload failed. Please try again."
      )
    } finally {
      setCvUploading(false)
    }
  }

  const handleDeleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return
    setDeletingId(id)
    try {
      await deleteResume({ path: { resumeId: id }, throwOnError: true })
      fetchResumes()
    } catch {
      // silently ignore
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = (resume: ResumeDto) => {
    const base = "http://localhost:3000"
    const url = `${base}${resume.fileUrl}`
    const a = document.createElement("a")
    a.href = url
    a.download = `${resume.title}.${resume.fileType.toLowerCase()}`
    a.click()
  }

  // ── Section 4: Security ──────────────────────────────────────────────────

  const [sec, setSec] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
  const [secSaving, setSecSaving] = useState(false)
  const [secErrors, setSecErrors] = useState<Record<string, string>>({})
  const [secSuccess, setSecSuccess] = useState("")
  const [secError, setSecError] = useState("")

  const validateSec = () => {
    const errs: Record<string, string> = {}
    if (!sec.currentPassword) errs.currentPassword = "Current password is required."
    if (!sec.newPassword) errs.newPassword = "New password is required."
    else if (sec.newPassword.length < 6) errs.newPassword = "Password must be at least 6 characters."
    if (!sec.confirmPassword) errs.confirmPassword = "Please confirm your new password."
    else if (sec.newPassword !== sec.confirmPassword) errs.confirmPassword = "Passwords do not match."
    else if (sec.currentPassword === sec.newPassword) errs.newPassword = "New password must be different from current password."
    return errs
  }

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault()
    setSecSuccess("")
    setSecError("")
    const errs = validateSec()
    if (Object.keys(errs).length) { setSecErrors(errs); return }
    setSecErrors({})
    setSecSaving(true)
    try {
      await changePassword({
        body: { currentPassword: sec.currentPassword, newPassword: sec.newPassword },
        throwOnError: true,
      })
      setSecSuccess("Password changed successfully.")
      setSec({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err: any) {
      setSecError(
        err?.response?.data?.message ?? "Failed to change password. Please try again."
      )
    } finally {
      setSecSaving(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-brand/20 selection:text-brand flex flex-col">
      <Header />

      <main className="flex-1 bg-secondary/35 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">

          {/* ─── Section 1: Personal Information ─────────────────────── */}
          <Card className="border border-foreground/10 shadow-sm">
            <SectionHeader
              icon={<User size={16} weight="fill" />}
              title="Personal Information"
              description="Manage personal information displayed on your job seeker profile."
            />
            <CardContent className="pt-6">
              {piLoading ? (
                <div className="flex items-center justify-center py-10">
                  <CircleNotch size={24} className="animate-spin text-brand" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Left Column: Avatar Uploader */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group size-48 bg-brand/5 border border-foreground/20 flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={`http://localhost:3000${avatarUrl}`}
                          alt="Avatar"
                          className="size-full object-cover"
                        />
                      ) : (
                        <User size={36} className="text-muted-foreground/60" weight="fill" />
                      )}

                      {/* Uploading Spinner */}
                      {avatarUploading && (
                        <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                          <CircleNotch size={20} className="animate-spin text-brand" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 text-center items-center">
                      <Button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={avatarUploading}
                        className="h-8 px-4 text-[10px] font-bold uppercase tracking-wider bg-brand hover:bg-brand/90 text-white border-none cursor-pointer transition-colors"
                      >
                        {avatarUploading ? "Uploading..." : "Upload Photo"}
                      </Button>
                      <p className="text-[10px] text-muted-foreground leading-normal max-w-[150px]">
                        JPG, JPEG or PNG. Max 3 MB.
                      </p>
                      {avatarError && (
                        <p className="text-[10px] font-semibold text-destructive leading-normal max-w-[150px]">
                          {avatarError}
                        </p>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={avatarInputRef}
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleAvatarChange}
                    />
                  </div>

                  {/* Right Column: Profile Form Fields */}
                  <form onSubmit={handleSavePi} className="md:col-span-3 space-y-5">
                    {piSuccess && <SuccessBanner message={piSuccess} />}
                    {piError && <ErrorBanner message={piError} />}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        id="fullName"
                        label="Full Name"
                        required
                        error={piErrors.fullName}
                      >
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Jane Smith"
                          value={pi.fullName}
                          onChange={(e) => setPi((p) => ({ ...p, fullName: e.target.value }))}
                          disabled={piSaving}
                          className={`h-10 text-sm ${piErrors.fullName ? "border-destructive" : "border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"}`}
                        />
                      </FormField>

                      <FormField
                        id="phoneNumber"
                        label="Phone Number"
                        required
                        error={piErrors.phoneNumber}
                      >
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="+84 012 345 6789"
                          value={pi.phoneNumber}
                          onChange={(e) => setPi((p) => ({ ...p, phoneNumber: e.target.value }))}
                          disabled={piSaving}
                          className={`h-10 text-sm ${piErrors.phoneNumber ? "border-destructive" : "border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"}`}
                        />
                      </FormField>

                      <FormField id="dateOfBirth" label="Date of Birth" optional>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={pi.dateOfBirth}
                          onChange={(e) => setPi((p) => ({ ...p, dateOfBirth: e.target.value }))}
                          disabled={piSaving}
                          className="h-10 text-sm border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                        />
                      </FormField>

                      <FormField id="city" label="Location / City" optional>
                        <Input
                          id="city"
                          type="text"
                          placeholder="Ho Chi Minh City"
                          value={pi.city}
                          onChange={(e) => setPi((p) => ({ ...p, city: e.target.value }))}
                          disabled={piSaving}
                          className="h-10 text-sm border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                        />
                      </FormField>
                    </div>

                    <FormField id="headline" label="Headline" optional>
                      <Input
                        id="headline"
                        type="text"
                        placeholder="e.g. Final-year Computer Science student | Seeking Software Engineering internships"
                        value={pi.headline}
                        onChange={(e) => setPi((p) => ({ ...p, headline: e.target.value }))}
                        disabled={piSaving}
                        className="h-10 text-sm border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                      />
                    </FormField>

                    <FormField id="summary" label="Professional Summary" optional>
                      <textarea
                        id="summary"
                        rows={4}
                        placeholder="Write a brief summary of your skills, experience, and career goals…"
                        value={pi.summary}
                        onChange={(e) => setPi((p) => ({ ...p, summary: e.target.value }))}
                        disabled={piSaving}
                        className="w-full resize-y border border-foreground/15 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-brand/50 focus-visible:ring-1 focus-visible:ring-brand/20 disabled:opacity-50 transition-colors"
                      />
                    </FormField>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        disabled={piSaving}
                        className="h-10 px-6 text-xs font-bold uppercase tracking-wider bg-brand hover:bg-brand/90 text-white border-none cursor-pointer transition-colors"
                      >
                        {piSaving ? (
                          <span className="flex items-center gap-1.5">
                            <CircleNotch className="animate-spin" size={13} />
                            Saving…
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ─── Section 2: Job Preferences ──────────────────────────── */}
          <Card className="border border-foreground/10 shadow-sm">
            <SectionHeader
              icon={<Briefcase size={16} weight="fill" />}
              title="Job Preferences"
              description="Control how employers discover your profile and what opportunities you are seeking."
            />
            <CardContent className="pt-6">
              {jpLoading ? (
                <div className="flex items-center justify-center py-10">
                  <CircleNotch size={24} className="animate-spin text-brand" />
                </div>
              ) : (
                <form onSubmit={handleSaveJp} className="space-y-6">
                  {jpSuccess && <SuccessBanner message={jpSuccess} />}
                  {jpError && <ErrorBanner message={jpError} />}

                  {/* Profile Visibility */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">
                      Profile Visibility
                    </Label>
                    <p className="text-[11px] font-medium text-foreground">
                      Control whether employers can find your profile in search results.
                    </p>
                    <ToggleGroup 
                      options={[
                        { label: "Visible to Employers", value: "VISIBLE_TO_EMPLOYERS" },
                        { label: "Private", value: "PRIVATE" },
                      ]}
                      value={jp.profileVisibility}
                      onChange={(v) => setJp((j) => ({ ...j, profileVisibility: v }))}
                      disabled={jpSaving}
                    />
                  </div>

                  {/* Job Search Status */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">
                      Job Search Status
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Let employers know if you are actively looking for opportunities.
                    </p>
                    <ToggleGroup
                      options={[
                        { label: "Open to Work", value: "OPEN_TO_WORK" },
                        { label: "Not Looking", value: "NOT_LOOKING" },
                      ]}
                      value={jp.jobSearchStatus}
                      onChange={(v) => setJp((j) => ({ ...j, jobSearchStatus: v }))}
                      disabled={jpSaving}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField id="desiredJobTitle" label="Desired Job Title" optional>
                      <Input
                        id="desiredJobTitle"
                        type="text"
                        placeholder="e.g. Software Engineer, Data Analyst"
                        value={jp.desiredJobTitle}
                        onChange={(e) => setJp((j) => ({ ...j, desiredJobTitle: e.target.value }))}
                        disabled={jpSaving}
                        className="h-10 text-sm border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                      />
                    </FormField>

                    <FormField id="preferredLocation" label="Preferred Location" optional>
                      <Input
                        id="preferredLocation"
                        type="text"
                        placeholder="e.g. Ho Chi Minh City, Remote"
                        value={jp.preferredLocation}
                        onChange={(e) => setJp((j) => ({ ...j, preferredLocation: e.target.value }))}
                        disabled={jpSaving}
                        className="h-10 text-sm border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                      />
                    </FormField>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={jpSaving}
                      className="h-10 px-6 text-xs font-bold uppercase tracking-wider bg-brand hover:bg-brand/90 text-white border-none cursor-pointer transition-colors"
                    >
                      {jpSaving ? (
                        <span className="flex items-center gap-1.5">
                          <CircleNotch className="animate-spin" size={13} />
                          Saving…
                        </span>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* ─── Section 3: CV Management ─────────────────────────────── */}
          <Card className="border border-foreground/10 shadow-sm">
            <SectionHeader
              icon={<FilePdf size={16} weight="fill" />}
              title="My CVs"
              description="Manage uploaded CVs used for job applications."
            />
            <CardContent className="pt-6 space-y-8">
              {/* Upload Form */}
              <form onSubmit={handleUpload} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Upload a New CV
                </h3>

                {cvUploadSuccess && <SuccessBanner message={cvUploadSuccess} />}
                {cvUploadError && <ErrorBanner message={cvUploadError} />}

                <FormField id="cvTitle" label="CV Title" required>
                  <Input
                    id="cvTitle"
                    type="text"
                    placeholder="e.g. Software Engineer Resume 2025"
                    value={cvTitle}
                    onChange={(e) => setCvTitle(e.target.value)}
                    disabled={cvUploading}
                    className="h-10 text-sm border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"
                  />
                </FormField>

                {/* Drag & Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={[
                    "flex flex-col items-center justify-center gap-3 border-2 border-dashed py-10 cursor-pointer transition-colors",
                    isDragOver
                      ? "border-brand bg-brand/5"
                      : "border-foreground/15 hover:border-brand/40 hover:bg-brand/5",
                    cvUploading ? "pointer-events-none opacity-50" : "",
                  ].join(" ")}
                >
                  <CloudArrowUp
                    size={36}
                    weight="thin"
                    className={isDragOver ? "text-brand" : "text-muted-foreground"}
                  />
                  {cvFile ? (
                    <div className="text-center space-y-1">
                      <p className="text-xs font-bold text-brand">{cvFile.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatFileSize(cvFile.size)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <p className="text-xs font-semibold text-foreground/80">
                        Drag & drop your CV here, or{" "}
                        <span className="text-brand underline">click to browse</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Accepted: PDF, DOC, DOCX · Max 5 MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleFileSelect(f)
                    }}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={cvUploading || !cvFile}
                    className="h-10 px-6 text-xs font-bold uppercase tracking-wider bg-brand hover:bg-brand/90 text-white border-none cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {cvUploading ? (
                      <span className="flex items-center gap-1.5">
                        <CircleNotch className="animate-spin" size={13} />
                        Uploading…
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <CloudArrowUp size={14} />
                        Upload CV
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              {/* CV List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Uploaded CVs
                  </h3>
                  {!resumesLoading && (
                    <span className="text-[11px] text-muted-foreground">
                      {resumes.length} file{resumes.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {resumesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <CircleNotch size={20} className="animate-spin text-brand" />
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 border border-dashed border-foreground/10">
                    <File size={32} weight="thin" className="text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">
                      No CVs uploaded yet. Upload one above.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-foreground/10 border border-foreground/10">
                    {resumes.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileTypeBadge type={r.fileType} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">
                              {r.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {formatFileSize(r.fileSize)} · Uploaded {formatDate(r.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleDownload(r)}
                            title="Download"
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-foreground/70 hover:text-brand border border-foreground/15 hover:border-brand/40 transition-colors"
                          >
                            <DownloadSimple size={13} />
                            <span className="hidden sm:inline">Download</span>
                          </button>
                          <button
                            onClick={() => handleDeleteResume(r.id)}
                            disabled={deletingId === r.id}
                            title="Delete"
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-destructive border border-destructive/20 hover:bg-destructive/5 transition-colors disabled:opacity-50"
                          >
                            {deletingId === r.id ? (
                              <CircleNotch size={13} className="animate-spin" />
                            ) : (
                              <Trash size={13} />
                            )}
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ─── Section 4: Security ──────────────────────────────────── */}
          <Card className="border border-foreground/10 shadow-sm">
            <SectionHeader
              icon={<Lock size={16} weight="fill" />}
              title="Security"
              description="Update your account password."
            />
            <CardContent className="pt-6">
              <form onSubmit={handleChangePw} className="space-y-5 max-w-md">
                {secSuccess && <SuccessBanner message={secSuccess} />}
                {secError && <ErrorBanner message={secError} />}

                {/* Current Password */}
                <FormField
                  id="currentPassword"
                  label="Current Password"
                  required
                  error={secErrors.currentPassword}
                >
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPw.current ? "text" : "password"}
                      placeholder="••••••••"
                      value={sec.currentPassword}
                      onChange={(e) => setSec((s) => ({ ...s, currentPassword: e.target.value }))}
                      disabled={secSaving}
                      className={`h-10 pr-10 text-sm ${secErrors.currentPassword ? "border-destructive" : "border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => ({ ...s, current: !s.current }))}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPw.current ? <EyeSlash size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </FormField>

                {/* New Password */}
                <FormField
                  id="newPassword"
                  label="New Password"
                  required
                  error={secErrors.newPassword}
                >
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPw.new ? "text" : "password"}
                      placeholder="••••••••"
                      value={sec.newPassword}
                      onChange={(e) => setSec((s) => ({ ...s, newPassword: e.target.value }))}
                      disabled={secSaving}
                      className={`h-10 pr-10 text-sm ${secErrors.newPassword ? "border-destructive" : "border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => ({ ...s, new: !s.new }))}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPw.new ? <EyeSlash size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </FormField>

                {/* Confirm New Password */}
                <FormField
                  id="confirmPassword"
                  label="Confirm New Password"
                  required
                  error={secErrors.confirmPassword}
                >
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPw.confirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={sec.confirmPassword}
                      onChange={(e) => setSec((s) => ({ ...s, confirmPassword: e.target.value }))}
                      disabled={secSaving}
                      className={`h-10 pr-10 text-sm ${secErrors.confirmPassword ? "border-destructive" : "border-foreground/15 focus-visible:border-brand/50 focus-visible:ring-brand/20"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => ({ ...s, confirm: !s.confirm }))}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPw.confirm ? <EyeSlash size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </FormField>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={secSaving}
                    className="h-10 px-6 text-xs font-bold uppercase tracking-wider bg-brand hover:bg-brand/90 text-white border-none cursor-pointer transition-colors"
                  >
                    {secSaving ? (
                      <span className="flex items-center gap-1.5">
                        <CircleNotch className="animate-spin" size={13} />
                        Updating…
                      </span>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  )
}
