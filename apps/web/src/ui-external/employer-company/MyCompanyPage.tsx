import { useState, useEffect } from "react"
import { Buildings, CheckCircle } from "@phosphor-icons/react"
import Header from "@/ui-external/landing/components/Header"
import Footer from "@/ui-external/landing/components/Footer"
import { Button } from "@/ui-shared/components/ui/button"
import { Card, CardContent } from "@/ui-shared/components/ui/card"
import { Input } from "@/ui-shared/components/ui/input"
import { Label } from "@/ui-shared/components/ui/label"
import ErrorAlert from "@/ui-shared/components/ErrorAlert"
import LoadingSpinner from "@/ui-shared/components/LoadingSpinner"
import { getCompany, createCompany, updateCompany } from "@/client"

/** Whether the page is registering a new company or editing the existing one. */
type Mode = "CREATE" | "EDIT"

interface CompanyForm {
  name: string
  city: string
  district: string
  description: string
}

const EMPTY_FORM: CompanyForm = { name: "", city: "", district: "", description: "" }

const FIELD_CLASS =
  "h-11 rounded-none border-foreground/10 bg-transparent px-4 text-xs placeholder:text-muted-foreground/60 focus-visible:ring-brand/30"

export default function MyCompanyPage() {
  const [mode, setMode] = useState<Mode>("CREATE")
  const [form, setForm] = useState<CompanyForm>(EMPTY_FORM)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadCompany = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getCompany({ throwOnError: true })
        const company = res.data
        setForm({
          name: company.name,
          city: company.city,
          district: company.district ?? "",
          description: company.description,
        })
        setMode("EDIT")
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // 404 is expected when the Employer has no company yet.
          setMode("CREATE") // This is only the intent, the throw will skip it.
          setError(null) // Even though setError(null) is already done before the catch, it doesn't hurt to have it here again (just in case).
          return
        }
        // 401 branch will not be included (redundancy/duplication/potential dead code)
        // The global interceptor in apiClient.ts handles session expiration centrally for all non-auth pages in the app
        setError(err?.response?.data?.message || "Failed to load your company profile. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadCompany()
  }, [])

  const setField = (field: keyof CompanyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    const body = {
      name: form.name.trim(),
      city: form.city.trim(),
      district: form.district.trim() || undefined,
      description: form.description.trim(),
    }

    try {
      if (mode === "CREATE") {
        await createCompany({ body, throwOnError: true })
        setMode("EDIT")
        setSuccessMessage("Company profile created. You can now publish job postings.")
      } else {
        await updateCompany({ body, throwOnError: true })
        setSuccessMessage("Company profile updated successfully.")
      }
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to save your company profile. Please try again."
      )
    } finally {
      setSaving(false)
    }
  }

  const isCreate = mode === "CREATE"

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-brand/20 selection:text-brand flex flex-col">
      <Header />

      <main className="flex-1 bg-secondary/35 py-10">
        <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-1.5">
            <h1 className="text-xl font-black uppercase tracking-tight text-foreground md:text-2xl">
              {isCreate ? "Register Your Company" : "Company Profile"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isCreate
                ? "A company profile is required before you can publish job postings."
                : "This information is shown to Job Seekers on your job postings."}
            </p>
          </div>

          {successMessage && (
            <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle size={16} weight="fill" className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && <ErrorAlert title="Company Profile Error" message={error} />}

          {loading ? (
            <Card className="border border-foreground/10 bg-card shadow-sm">
              <CardContent className="py-12">
                <LoadingSpinner message="Loading your company profile..." />
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-foreground/10 bg-card shadow-sm">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-[11px] font-bold uppercase tracking-wider text-foreground"
                    >
                      Company Name
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="e.g. Nexus Technologies"
                      maxLength={255}
                      required
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-[11px] font-bold uppercase tracking-wider text-foreground"
                      >
                        City
                      </Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        placeholder="e.g. Ho Chi Minh City"
                        maxLength={255}
                        required
                        className={FIELD_CLASS}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="district"
                        className="text-[11px] font-bold uppercase tracking-wider text-foreground"
                      >
                        District{" "}
                        <span className="font-medium normal-case tracking-normal text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="district"
                        value={form.district}
                        onChange={(e) => setField("district", e.target.value)}
                        placeholder="e.g. District 1"
                        maxLength={255}
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-[11px] font-bold uppercase tracking-wider text-foreground"
                    >
                      Description
                    </Label>
                    <textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                      placeholder="Tell candidates what your company does, its size, and what makes it a good place to work."
                      rows={7}
                      maxLength={5000}
                      required
                      className="w-full resize-y rounded-none border border-foreground/10 bg-transparent px-4 py-3 text-xs leading-relaxed placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                    />
                    <p className="text-right text-[10px] text-muted-foreground">
                      {form.description.length} / 5000
                    </p>
                  </div>

                  <div className="flex justify-end border-t border-foreground/10 pt-5">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="h-10 gap-2 rounded-none bg-brand px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand/90"
                    >
                      <Buildings size={15} weight="bold" />
                      {saving
                        ? "Saving…"
                        : isCreate
                          ? "Create Company"
                          : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
