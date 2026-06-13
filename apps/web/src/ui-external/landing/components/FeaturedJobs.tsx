import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, CurrencyDollar, CalendarBlank, ArrowRight, Briefcase } from "@phosphor-icons/react"

interface Job {
  id: string
  title: string
  company: string
  logoText: string
  logoBg: string
  location: string
  type: "Internship" | "Research" | "Full-time" | "Co-op"
  stipend: string
  posted: string
  skills: string[]
}

const companyIdMap: Record<string, string> = {
  "Google": "google",
  "Stanford AI Lab": "stanford-ai-lab",
  "McKinsey & Company": "mckinsey",
  "Figma": "figma",
  "Stripe": "stripe",
  "Vercel": "vercel"
};

interface FeaturedJobsProps {
  searchKeyword: string
  searchLocation: string
  onResetSearch: () => void
}

export default function FeaturedJobs({ searchKeyword, searchLocation, onResetSearch }: FeaturedJobsProps) {
  const [activeTab, setActiveTab] = useState<string>("All")

  const mockJobs: Job[] = [
    {
      id: "1",
      title: "Software Engineer Intern",
      company: "Google",
      logoText: "G",
      logoBg: "bg-blue-500",
      location: "Mountain View, CA (Hybrid)",
      type: "Internship",
      stipend: "$45 - $60 / hr",
      posted: "2 days ago",
      skills: ["React", "TypeScript", "Python"]
    },
    {
      id: "2",
      title: "Graduate AI Research Assistant",
      company: "Stanford AI Lab",
      logoText: "S",
      logoBg: "bg-red-700",
      location: "Stanford, CA (On-site)",
      type: "Research",
      stipend: "$32 - $42 / hr",
      posted: "1 day ago",
      skills: ["PyTorch", "NLP", "Machine Learning"]
    },
    {
      id: "3",
      title: "Associate Consultant (New Grad)",
      company: "McKinsey & Company",
      logoText: "M",
      logoBg: "bg-indigo-950",
      location: "New York, NY (Hybrid)",
      type: "Full-time",
      stipend: "$110k - $130k / yr",
      posted: "5 days ago",
      skills: ["Problem Solving", "Analytics", "Strategy"]
    },
    {
      id: "4",
      title: "Product Design Co-op",
      company: "Figma",
      logoText: "F",
      logoBg: "bg-orange-500",
      location: "San Francisco, CA (Hybrid)",
      type: "Co-op",
      stipend: "$40 - $55 / hr",
      posted: "3 days ago",
      skills: ["Figma", "UI/UX Design", "Prototyping"]
    },
    {
      id: "5",
      title: "Data Analyst Intern",
      company: "Stripe",
      logoText: "S",
      logoBg: "bg-violet-600",
      location: "Seattle, WA (Remote)",
      type: "Internship",
      stipend: "$38 - $50 / hr",
      posted: "Just now",
      skills: ["SQL", "Python", "Tableau"]
    },
    {
      id: "6",
      title: "Junior Full-Stack Engineer",
      company: "Vercel",
      logoText: "V",
      logoBg: "bg-black",
      location: "Remote (US/Canada)",
      type: "Full-time",
      stipend: "$90k - $120k / yr",
      posted: "4 days ago",
      skills: ["Next.js", "Tailwind CSS", "Node.js"]
    }
  ]

  const tabs = ["All", "Internship", "Research", "Full-time", "Co-op"]

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      // 1. Tab matching
      if (activeTab !== "All" && job.type !== activeTab) {
        return false
      }

      // 2. Keyword matching
      if (searchKeyword.trim() !== "") {
        const query = searchKeyword.toLowerCase()
        const matchTitle = job.title.toLowerCase().includes(query)
        const matchCompany = job.company.toLowerCase().includes(query)
        const matchSkills = job.skills.some((skill) => skill.toLowerCase().includes(query))
        if (!matchTitle && !matchCompany && !matchSkills) {
          return false
        }
      }

      // 3. Location matching
      if (searchLocation.trim() !== "") {
        const locQuery = searchLocation.toLowerCase()
        if (!job.location.toLowerCase().includes(locQuery)) {
          return false
        }
      }

      return true
    })
  }, [activeTab, searchKeyword, searchLocation])

  // const handleApplyClick = (jobTitle: string, company: string) => {
  //   alert(`Mock Application initiated for "${jobTitle}" at ${company}. Ready for integration with job application features.`)
  // }

  return (
    <section className="bg-background py-20 font-sans" id="search-jobs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left md:flex md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Discover Opportunities
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Explore curated positions matching your field of study. Instantly connect with verified university partners.
            </p>
          </div>
        </div>

        {/* Tab Filters and Active Search Info */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-foreground/10 pb-4">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeTab === tab
                    ? "bg-brand text-white border-brand"
                    : "bg-secondary/40 text-foreground/75 hover:bg-secondary border-transparent hover:border-foreground/10"
                }`}
              >
                {tab}s
              </button>
            ))}
          </div>

          {(searchKeyword || searchLocation) && (
            <div className="flex items-center gap-2 bg-brand/5 border border-brand/20 px-3 py-1.5 text-xs text-brand font-medium">
              <span>
                Filtering by: {searchKeyword ? `"${searchKeyword}"` : ""}
                {searchKeyword && searchLocation ? " in " : ""}
                {searchLocation ? `"${searchLocation}"` : ""}
              </span>
              <button
                onClick={onResetSearch}
                className="underline font-bold hover:text-brand/80 cursor-pointer ml-1"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="border border-foreground/10 hover:border-brand/40 bg-card hover:shadow-md transition-all duration-300 flex flex-col relative group"
              >
                {/* Accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <CardHeader className="flex flex-row items-start gap-4 pb-4">
                  {/* Company Logo Badge */}
                  <div className={`size-12 flex items-center justify-center text-white text-lg font-bold shrink-0 ${job.logoBg}`}>
                    {job.logoText}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-bold text-foreground group-hover:text-brand transition-colors line-clamp-1">
                      <Link to={`/jobs/${job.id}`} className="hover:underline">
                        {job.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-xs font-semibold text-foreground/80">
                      <Link to={`/companies/${companyIdMap[job.company] || "google"}`} className="text-brand hover:underline">
                        {job.company}
                      </Link>
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1">
                  {/* Job Metadata */}
                  <div className="space-y-2 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-foreground/40" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CurrencyDollar size={14} className="text-foreground/40" />
                      <span className="text-foreground font-bold">{job.stipend}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarBlank size={14} className="text-foreground/40" />
                      <span>Posted {job.posted}</span>
                    </div>
                  </div>

                  {/* Skills/Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="rounded-none text-[10px] py-0 px-1.5 border-foreground/15 bg-background font-mono text-muted-foreground"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="border-t border-foreground/10 bg-secondary/20 group-hover:bg-secondary/40 transition-colors flex justify-between items-center py-3">
                  <Badge className="bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-wider rounded-none px-2 py-0.5">
                    {job.type}
                  </Badge>
                  <Link to={`/jobs/${job.id}`}>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs font-bold uppercase tracking-wider text-brand hover:text-brand/80 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight size={12} weight="bold" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-foreground/20 p-12 text-center max-w-md mx-auto">
            <Briefcase size={40} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">No opportunities found</h3>
            <p className="text-xs text-muted-foreground mb-6">
              We couldn't find any matches for your query. Try broadening your keywords or clearing the search filters.
            </p>
            <Button
              onClick={onResetSearch}
              className="bg-brand hover:bg-brand/90 text-white uppercase tracking-wider text-xs font-bold"
            >
              Reset Search Filter
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
