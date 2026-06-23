import { Button } from "@/ui-shared/components/ui/button"
import { CheckCircle, Megaphone, ArrowUpRight } from "@phosphor-icons/react"

export default function EmployerCTA() {
  const benefits = [
    "Access to verified university profiles and candidate credentials",
    "Filter applicants instantly by academic major, GPA, and graduation year",
    "Streamline campus recruitment campaigns and virtual info-sessions",
    "Direct integrations with student academic management systems"
  ]

  const handleCTA = (action: string) => {
    alert(`"${action}" is a placeholder action for the employer recruitment dashboard.`)
  }

  return (
    <section className="relative overflow-hidden bg-foreground text-background py-20 font-sans" id="employer-cta">
      {/* Subtle design accents */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Decorative gradient radial glow */}
      <div className="pointer-events-none absolute -bottom-48 -right-48 size-[400px] rounded-full bg-brand/10 blur-[120px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text content - 7 columns on large screens */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-brand/20 border border-brand/30 px-3 py-1 text-xs font-semibold text-brand-foreground mb-2 uppercase tracking-wider text-blue-400">
              <Megaphone size={14} weight="fill" />
              <span>For Recruiters & Companies</span>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Looking to Hire Next-Gen University Talent?
            </h2>
            
            <p className="text-sm/relaxed text-muted-foreground/80 max-w-xl">
              AcademiaConnect bridges the gap between classrooms and boardrooms. Join leading tech firms, labs, and consultancy agencies hiring directly from the university network.
            </p>
            
            <div className="space-y-3 pt-2">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle size={18} weight="fill" className="text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-xs font-medium text-white/90">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Actions Panel - 5 columns on large screens */}
          <div className="lg:col-span-5">
            <div className="border border-white/10 bg-white/5 p-6 backdrop-blur-md relative">
              {/* Technical design accent corners */}
              <div className="absolute -top-1 -left-1 size-2 border-t border-l border-blue-500" />
              <div className="absolute -top-1 -right-1 size-2 border-t border-r border-blue-500" />
              <div className="absolute -bottom-1 -left-1 size-2 border-b border-l border-blue-500" />
              <div className="absolute -bottom-1 -right-1 size-2 border-b border-r border-blue-500" />

              <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-4 mb-6">
                Recruitment Dashboard
              </h3>

              <div className="space-y-4">
                <Button
                  onClick={() => handleCTA("Post a Job")}
                  className="w-full h-11 bg-brand hover:bg-brand/90 text-white uppercase tracking-wider text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-none cursor-pointer"
                >
                  <span>Post a Role Now</span>
                  <ArrowUpRight size={14} weight="bold" />
                </Button>
                
                <Button
                  onClick={() => handleCTA("Schedule a Demo")}
                  variant="outline"
                  className="w-full h-11 bg-grey border-white/50 text-white hover:bg-white/10 hover:text-white uppercase tracking-wider text-xs font-bold cursor-pointer">
                  Request Platform Demo
                </Button>
              </div>

              <p className="text-[12px] text-center mt-6 uppercase tracking-widest font-mono">
                500+ Active Academic Partners
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
