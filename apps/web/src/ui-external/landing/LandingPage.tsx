import { useState, useEffect } from "react"
import Header from "@/ui-external/landing/components/Header"
import Hero from "@/ui-external/landing/components/Hero"
import FeaturedJobs from "@/ui-external/landing/components/FeaturedJobs"
import EmployerCTA from "@/ui-external/landing/components/EmployerCTA"
import Footer from "@/ui-external/landing/components/Footer"

export default function LandingPage() {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [searchLocation, setSearchLocation] = useState("")

  useEffect(() => {
    // SEO title setting
    document.title = "AcademiaConnect | University Recruitment & Career Hub"
  }, [])

  const handleSearch = (keyword: string, location: string) => {
    setSearchKeyword(keyword)
    setSearchLocation(location)
    
    // Smoothly scroll down to the jobs listing section
    const jobsSection = document.getElementById("search-jobs")
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleResetSearch = () => {
    setSearchKeyword("")
    setSearchLocation("")
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-brand/20 selection:text-brand flex flex-col">
      {/* 1. Sticky Navigation Header */}
      <Header />

      {/* Main Page Layout */}
      <main className="flex-1">
        {/* 2. Hero Section with Headline & Interactive Search */}
        <Hero onSearch={handleSearch} />

        {/* 3. Featured Jobs Section (Grid and Tab-Filters) */}
        <FeaturedJobs
          searchKeyword={searchKeyword}
          searchLocation={searchLocation}
          onResetSearch={handleResetSearch}
        />

        {/* 4. Recruiter Call to Action */}
        <EmployerCTA />
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  )
}
