import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/ui-external/landing/components/Header";
import Footer from "@/ui-external/landing/components/Footer";
import {
  MapPin,
  CalendarBlank,
  CurrencyDollar,
  ArrowLeft,
  Briefcase,
  WarningCircle,
  CheckCircle,
  Buildings,
} from "@phosphor-icons/react";
import { mockJobs, mockCompanies } from "./mockData";

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [hasApplied, setHasApplied] = useState(false);

  const job = mockJobs.find((j) => j.id === jobId);
  const company = job ? mockCompanies.find((c) => c.id === job.companyId) : undefined;

  useEffect(() => {
    if (job && company) {
      document.title = `${job.title} at ${company.name} | AcademiaConnect`;
    } else {
      document.title = "Job Opportunity | AcademiaConnect";
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [job, company]);

  if (!job || !company) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <WarningCircle size={48} className="text-muted-foreground mb-4 opacity-75" />
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-foreground mb-2">
            Job Opportunity Not Found
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            The job posting you are looking for may have been removed, or the link you followed is incorrect.
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

  const handleApply = () => {
    if (job.status !== "ACTIVE") return;
    setHasApplied(true);
    alert(
      `Mock Application successful!\nYou have successfully applied for "${job.title}" at ${company.name}.\nThis is a simulation for this bachelor thesis project.`
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 text-xs font-bold uppercase tracking-wider rounded-none px-2.5 py-0.5">
            Accepting Applications
          </Badge>
        );
      case "CLOSED":
        return (
          <Badge className="bg-amber-500/10 border border-amber-500/30 text-amber-600 hover:bg-amber-500/10 text-xs font-bold uppercase tracking-wider rounded-none px-2.5 py-0.5">
            Closed
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge className="bg-red-500/10 border border-red-500/30 text-red-600 hover:bg-red-500/10 text-xs font-bold uppercase tracking-wider rounded-none px-2.5 py-0.5">
            Expired
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/10 border border-gray-500/30 text-gray-600 hover:bg-gray-500/10 text-xs font-bold uppercase tracking-wider rounded-none px-2.5 py-0.5">
            {status}
          </Badge>
        );
    }
  };

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

  const formatDeadline = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const isClosedOrInactive = job.status !== "ACTIVE";

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

          {/* Job Inactive Banner Alert */}
          {isClosedOrInactive && (
            <div className="mb-8 border-l-4 border-amber-500 bg-amber-500/5 p-4 flex gap-3 text-amber-800 border-y border-r border-amber-500/20">
              <WarningCircle size={20} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide">Position Not Accepting Applications</h4>
                <p className="text-xs text-amber-700/95 mt-1">
                  This job posting is currently <span className="font-bold">{job.status.toLowerCase()}</span>. No additional submissions are being accepted.
                </p>
              </div>
            </div>
          )}

          {/* Header Card */}
          <Card className="border border-foreground/10 bg-card mb-8 shadow-sm relative overflow-hidden">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand" />
            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              {/* Job Info Left */}
              <div className="flex gap-4 items-start">
                <div className={`size-14 md:size-16 flex items-center justify-center text-white text-2xl font-bold shrink-0 ${company.logoBg} shadow-inner`}>
                  {company.logoText}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
                      {job.title}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs md:text-sm font-medium">
                    <Link
                      to={`/companies/${company.id}`}
                      className="text-brand hover:underline font-bold flex items-center gap-1"
                    >
                      <Buildings size={16} />
                      {company.name}
                    </Link>
                    <span className="text-muted-foreground/50">&middot;</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MapPin size={16} />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                <div className="flex items-center justify-start md:justify-end">
                  {getStatusBadge(job.status)}
                </div>
                {isClosedOrInactive ? (
                  <Button
                    disabled
                    className="h-10 px-6 text-xs font-bold uppercase tracking-wider bg-foreground/10 text-muted-foreground/60 border-none rounded-none"
                  >
                    Applications Closed
                  </Button>
                ) : hasApplied ? (
                  <Button
                    disabled
                    className="h-10 px-6 text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-none flex items-center gap-1.5"
                  >
                    <CheckCircle size={16} weight="fill" />
                    Applied
                  </Button>
                ) : (
                  <Button
                    onClick={handleApply}
                    className="h-10 px-6 text-xs font-bold uppercase tracking-wider bg-brand hover:bg-brand/90 text-white border-none cursor-pointer rounded-none transition-colors"
                  >
                    Apply Now
                  </Button>
                )}
              </div>

            </div>
          </Card>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Detailed Description */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Job Description */}
              <Card className="border border-foreground/10 bg-card p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
                  Job Description
                </h3>
                <div className="text-xs md:text-sm text-foreground/95 leading-relaxed space-y-4 font-normal whitespace-pre-wrap">
                  {job.description}
                </div>
              </Card>

              {/* Job Requirements */}
              <Card className="border border-foreground/10 bg-card p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
                  Key Requirements
                </h3>
                <div className="text-xs md:text-sm text-foreground/95 leading-relaxed space-y-4 font-normal whitespace-pre-wrap">
                  {job.requirement}
                </div>
              </Card>

              {/* Skills Card */}
              <Card className="border border-foreground/10 bg-card p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
                  Target Competencies & Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="rounded-none text-xs py-1 px-3 border-foreground/15 bg-background font-mono text-muted-foreground"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

            </div>

            {/* Right Column - Sidebar Metadata */}
            <div className="space-y-6">
              
              {/* Metadata Card */}
              <Card className="border border-foreground/10 bg-card shadow-sm">
                <CardHeader className="border-b border-foreground/10 pb-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Briefcase size={16} className="text-brand" />
                    Position Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  
                  {/* Stipend */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                      Compensation / Stipend
                    </span>
                    <span className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                      <CurrencyDollar size={16} className="text-muted-foreground/60" />
                      {job.stipend}
                    </span>
                  </div>

                  <Separator className="bg-foreground/10" />

                  {/* Employment Type */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                      Employment Type
                    </span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Briefcase size={16} className="text-muted-foreground/60" />
                      {getEmploymentTypeLabel(job.employmentType)}
                    </span>
                  </div>

                  <Separator className="bg-foreground/10" />

                  {/* Location */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                      Location
                    </span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <MapPin size={16} className="text-muted-foreground/60" />
                      {job.location}
                    </span>
                  </div>

                  <Separator className="bg-foreground/10" />

                  {/* Deadline */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                      Application Deadline
                    </span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <CalendarBlank size={16} className="text-muted-foreground/60" />
                      {formatDeadline(job.deadline)}
                    </span>
                  </div>

                </CardContent>
              </Card>

              {/* Company Snapshot Card */}
              <Card className="border border-foreground/10 bg-card p-6 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Company Snapshot
                </h4>
                <div className="flex gap-3 items-center mb-3">
                  <div className={`size-10 flex items-center justify-center text-white text-md font-bold shrink-0 ${company.logoBg}`}>
                    {company.logoText}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground line-clamp-1">{company.name}</h5>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">{company.city}</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 mb-4 font-normal">
                  {company.description}
                </p>
                <Link to={`/companies/${company.id}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full h-8 text-[10px] font-bold uppercase tracking-wider border-foreground/20 hover:border-brand hover:text-brand cursor-pointer transition-colors"
                  >
                    View Company Profile
                  </Button>
                </Link>
              </Card>

            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
