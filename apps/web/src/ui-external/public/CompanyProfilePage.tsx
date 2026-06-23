import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/ui-shared/components/ui/button";
import { Badge } from "@/ui-shared/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui-shared/components/ui/card";
import Header from "@/ui-external/landing/components/Header";
import Footer from "@/ui-external/landing/components/Footer";
import {
  MapPin,
  Briefcase,
  ArrowLeft,
  Buildings,
  WarningCircle,
  ArrowRight,
  Info
} from "@phosphor-icons/react";
import { mockJobs, mockCompanies } from "./mockData";
// TODO: Replace mock data with real data from API using fetch
// TODO: Write a function to derive first letter of company name

export default function CompanyProfilePage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  const company = mockCompanies.find((c) => c.id === companyId);
  
  // Filter jobs: only ACTIVE postings belonging to this company
  const activeJobs = mockJobs.filter(
    (j) => j.companyId === companyId && j.status === "ACTIVE"
  );

  useEffect(() => {
    if (company) {
      document.title = `${company.name} Profile | AcademiaConnect`;
    } else {
      document.title = "Company Profile | AcademiaConnect";
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [company]);

  if (!company) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <WarningCircle size={48} className="text-muted-foreground mb-4 opacity-75" />
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-foreground mb-2">
            Company Profile Not Found
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            The company profile you are looking for does not exist or may have been deactivated.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-brand hover:bg-brand/90 text-white uppercase tracking-wider text-xs font-bold px-6 h-10 border-none cursor-pointer"
          >
            Back to Job Search
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case "ON_SITE":
        return "On-site";
      case "REMOTE":
        return "Remote";
      case "HYBRID":
        return "Hybrid";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-brand/20 selection:text-brand flex flex-col">
      {/* Navigation Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-secondary/10 py-10 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation Link */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-brand transition-colors"
            >
              <ArrowLeft size={14} weight="bold" />
              <span>Back to search</span>
            </Link>
          </div>

          {/* Company Profile Hero Header */}
          <Card className="border border-foreground/10 bg-card mb-8 shadow-sm relative overflow-hidden">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand" />
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                
                {/* Company Logo Box */}
                <div className={`size-20 md:size-24 flex items-center justify-center text-white text-4xl font-extrabold shrink-0 ${company.logoBg} shadow-inner`}>
                  {company.logoText}
                </div>

                {/* Company Branding details */}
                <div className="space-y-3">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                    {company.name}
                  </h1>

                  <div className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-foreground/40" />
                      <span className="text-foreground font-semibold">{company.address}</span>
                    </div>
                    {company.district && (
                      <div className="flex items-center gap-1.5">
                        <Buildings size={16} className="text-foreground/40" />
                        <span>
                          {company.district}, {company.city}
                        </span>
                      </div>
                    )}
                    {!company.district && (
                      <div className="flex items-center gap-1.5">
                        <Buildings size={16} className="text-foreground/40" />
                        <span>{company.city}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </Card>

          {/* Content Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Company Overview Left */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border border-foreground/10 bg-card p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-1.5">
                  <Info size={16} className="text-brand" />
                  About the Company
                </h3>
                <p className="text-xs md:text-sm text-foreground/90 leading-relaxed font-normal whitespace-pre-wrap">
                  {company.description}
                </p>
              </Card>
            </div>

            {/* Open Job Listings Right */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-foreground mb-4 flex items-center gap-2">
                  <span>Open Opportunities</span>
                  <Badge className="bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-wider rounded-none px-2 py-0.5">
                    {activeJobs.length} {activeJobs.length === 1 ? "Job" : "Jobs"}
                  </Badge>
                </h2>

                {activeJobs.length > 0 ? (
                  <div className="space-y-4">
                    {activeJobs.map((job) => (
                      <Card
                        key={job.id}
                        className="border border-foreground/10 hover:border-brand/40 bg-card hover:shadow-sm transition-all duration-300 relative group overflow-hidden"
                      >
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-brand transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                        
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-4">
                            <CardTitle className="text-sm md:text-base font-bold text-foreground group-hover:text-brand transition-colors">
                              <Link to={`/jobs/${job.id}`} className="hover:underline">
                                {job.title}
                              </Link>
                            </CardTitle>
                            <Badge className="bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-wider rounded-none px-2 py-0.5 shrink-0">
                              {getEmploymentTypeLabel(job.employmentType)}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pb-4 pt-0">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            
                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} className="text-foreground/30" />
                                {job.location}
                              </span>
                              <span className="text-foreground font-bold">
                                {job.stipend}
                              </span>
                            </div>

                            {/* View details action */}
                            <Link to={`/jobs/${job.id}`} className="w-full sm:w-auto self-end">
                              <Button
                                variant="link"
                                className="h-auto p-0 text-xs font-bold uppercase tracking-wider text-brand hover:text-brand/80 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                              >
                                <span>View Details</span>
                                <ArrowRight size={12} weight="bold" />
                              </Button>
                            </Link>

                          </div>
                        </CardContent>

                      </Card>
                    ))}
                  </div>
                ) : (
                  // Empty state for active jobs
                  <Card className="border border-dashed border-foreground/20 p-12 text-center bg-card">
                    <Briefcase size={40} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                      No Active Opportunities
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      {company.name} is not accepting applications for any active positions at this time. Check back later or explore other open opportunities.
                    </p>
                  </Card>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
