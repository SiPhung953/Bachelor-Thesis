import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/ui-shared/components/ui/button"
import { GraduationCap, List, X } from "@phosphor-icons/react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-md font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <div className="flex size-10 items-center justify-center bg-brand text-white">
                <GraduationCap size={24} weight="fill" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                Academia<span className="text-brand">Connect</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:text-brand transition-colors"
            >
              Search Jobs
            </Link>
            <a
              href="#employer-cta"
              className="text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:text-brand transition-colors"
            >
              For Employers
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault()
                alert("About page is a placeholder for this thesis MVP.")
              }}
              className="text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:text-brand transition-colors"
            >
              About
            </a>
            <a
              href="#resources"
              onClick={(e) => {
                e.preventDefault()
                alert("Resources center is a placeholder for this thesis MVP.")
              }}
              className="text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:text-brand transition-colors"
            >
              Resources
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="outline"
                className="h-9 px-4 text-xs font-bold uppercase tracking-wider border-foreground/20 hover:border-brand hover:text-brand cursor-pointer transition-colors"
              >
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                className="h-9 px-4 text-xs font-bold uppercase tracking-wider bg-brand hover:bg-brand/90 text-white border-none cursor-pointer transition-colors"
              >
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-foreground/80 hover:text-brand focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-b border-foreground/10 bg-background/95 backdrop-blur-md">
          <div className="space-y-1.5 px-4 pt-2 pb-6">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block py-2.5 text-xs font-bold uppercase tracking-wider text-foreground/80 hover:text-brand"
            >
              Search Jobs
            </Link>
            <a
              href="#employer-cta"
              onClick={() => setIsOpen(false)}
              className="block py-2.5 text-xs font-bold uppercase tracking-wider text-foreground/80 hover:text-brand"
            >
              For Employers
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault()
                setIsOpen(false)
                alert("About page is a placeholder for this thesis MVP.")
              }}
              className="block py-2.5 text-xs font-bold uppercase tracking-wider text-foreground/80 hover:text-brand"
            >
              About
            </a>
            <a
              href="#resources"
              onClick={(e) => {
                e.preventDefault()
                setIsOpen(false)
                alert("Resources center is a placeholder for this thesis MVP.")
              }}
              className="block py-2.5 text-xs font-bold uppercase tracking-wider text-foreground/80 hover:text-brand"
            >
              Resources
            </a>
            <div className="pt-4 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                <Button
                  variant="outline"
                  className="w-full h-9 text-xs font-bold uppercase tracking-wider border-foreground/20 hover:border-brand hover:text-brand cursor-pointer"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="w-full">
                <Button
                  className="w-full h-9 text-xs font-bold uppercase tracking-wider bg-brand hover:bg-brand/90 text-white border-none cursor-pointer"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
