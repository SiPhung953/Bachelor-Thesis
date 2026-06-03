import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GraduationCap, GithubLogo, LinkedinLogo, TwitterLogo, PaperPlaneRight } from "@phosphor-icons/react"
import React, { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    alert(`Thank you for subscribing! "${email}" has been added to our updates newsletter.`)
    setEmail("")
  }

  const columns = [
    {
      title: "For Students",
      links: [
        { label: "Search Jobs", path: "/" },
        { label: "Mock Interviews", path: "#" },
        { label: "Career Path Finder", path: "#" },
        { label: "Resume Review", path: "#" }
      ]
    },
    {
      title: "For Employers",
      links: [
        { label: "Recruiter Solutions", path: "#" },
        { label: "Post an Opportunity", path: "#" },
        { label: "University Partners", path: "#" },
        { label: "Pricing Model", path: "#" }
      ]
    },
    {
      title: "Legal & Info",
      links: [
        { label: "About AcademiaConnect", path: "#" },
        { label: "Terms of Service", path: "#" },
        { label: "Privacy Guidelines", path: "#" },
        { label: "Contact Support", path: "#" }
      ]
    }
  ]

  return (
    <footer className="bg-secondary/35 border-t border-foreground/10 py-16 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-foreground/10">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center bg-brand text-white">
                <GraduationCap size={20} weight="fill" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                Academia<span className="text-brand">Connect</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              A modern student career accelerator designed to connect top academic minds with leading employers, internships, and co-ops.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="text-muted-foreground hover:text-brand transition-colors" title="Github">
                <GithubLogo size={20} weight="bold" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-brand transition-colors" title="LinkedIn">
                <LinkedinLogo size={20} weight="bold" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-brand transition-colors" title="Twitter / X">
                <TwitterLogo size={20} weight="bold" />
              </a>
            </div>
          </div>

          {/* Directory Links Columns */}
          <div className="grid grid-cols-3 gap-6 lg:col-span-5">
            {columns.map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {col.title}
                </h3>
                <ul className="space-y-2 text-xs font-medium">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      {link.path === "/" ? (
                        <Link to={link.path} className="text-muted-foreground hover:text-brand transition-colors">
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.path}
                          onClick={(e) => {
                            if (link.path === "#") {
                              e.preventDefault()
                              alert(`${link.label} is a placeholder link for this thesis MVP.`)
                            }
                          }}
                          className="text-muted-foreground hover:text-brand transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Newsletter Signup
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stay updated with new job posts, academic partnerships, and event schedules.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative flex items-center bg-card border border-foreground/10 p-1">
              <Input
                type="email"
                placeholder="Email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none h-8 pl-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs font-medium bg-transparent"
                required
              />
              <Button
                type="submit"
                size="icon-sm"
                className="bg-brand hover:bg-brand/90 text-white border-none cursor-pointer"
                title="Subscribe"
              >
                <PaperPlaneRight size={12} weight="bold" />
              </Button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground font-medium">
          <div>
            &copy; {new Date().getFullYear()} AcademiaConnect. Created for University Bachelor Thesis Project.
          </div>
          <div className="flex gap-4">
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Mock Privacy Policy"); }} className="hover:underline">Privacy Policy</a>
            <span>&middot;</span>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Mock Terms of Use"); }} className="hover:underline">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
