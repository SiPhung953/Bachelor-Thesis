import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SignOut, ShieldCheck, Cpu, Database, Network } from "@phosphor-icons/react"

interface DashboardPageProps {
  userEmail: string
  onLogout: () => void
}

export default function DashboardPage({ userEmail, onLogout }: DashboardPageProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 select-none">
      {/* Background patterns matching the LoginPage */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.2)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[600px] -translate-x-1/2 bg-primary/5 blur-[120px] dark:bg-primary/10" />

      <div className="relative w-full max-w-[500px]">
        {/* Decorative corner accents */}
        <div className="absolute -top-1.5 -left-1.5 size-3 border-t-2 border-l-2 border-foreground" />
        <div className="absolute -top-1.5 -right-1.5 size-3 border-t-2 border-r-2 border-foreground" />
        <div className="absolute -bottom-1.5 -left-1.5 size-3 border-b-2 border-l-2 border-foreground" />
        <div className="absolute -bottom-1.5 -right-1.5 size-3 border-b-2 border-r-2 border-foreground" />

        <Card className="border border-foreground/10 bg-card/85 backdrop-blur-md shadow-2xl relative">
          <CardHeader className="space-y-1.5 border-b border-foreground/10 pb-6">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase border border-emerald-500/20 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Session Active
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">
                Terminal
              </span>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight font-heading mt-2 flex items-center gap-2">
              <ShieldCheck size={24} className="text-emerald-500" />
              ACCESS GRANTED
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-mono">
              Welcome back, <span className="text-foreground font-bold">{userEmail}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-6 font-mono text-xs">
            <div className="border border-foreground/10 bg-background/50 p-4 space-y-3">
              <div className="text-[11px] text-muted-foreground border-b border-foreground/10 pb-1.5 uppercase font-bold flex items-center justify-between">
                <span>System Metrics</span>
                <Badge variant="outline" className="text-[9px] rounded-none py-0 px-1 border-foreground/25">
                  Live
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="border border-foreground/10 p-2 flex flex-col gap-1 items-center justify-center text-center">
                  <Cpu size={16} className="text-muted-foreground" />
                  <span className="text-[9px] text-muted-foreground uppercase">CPU Load</span>
                  <span className="text-xs font-bold">12.4%</span>
                </div>
                <div className="border border-foreground/10 p-2 flex flex-col gap-1 items-center justify-center text-center">
                  <Database size={16} className="text-muted-foreground" />
                  <span className="text-[9px] text-muted-foreground uppercase">DB Status</span>
                  <span className="text-xs font-bold text-emerald-500">ONLINE</span>
                </div>
                <div className="border border-foreground/10 p-2 flex flex-col gap-1 items-center justify-center text-center">
                  <Network size={16} className="text-muted-foreground" />
                  <span className="text-[9px] text-muted-foreground uppercase">Latency</span>
                  <span className="text-xs font-bold">14 ms</span>
                </div>
              </div>
            </div>

            <div className="p-3 border border-foreground/10 bg-foreground/5 text-[11px] space-y-1">
              <div className="text-muted-foreground">Session token issued successfully.</div>
              <div className="text-muted-foreground">Environment: <span className="text-foreground">development</span></div>
              <div className="text-muted-foreground">Privileges: <span className="text-foreground">administrator</span></div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t border-foreground/10 pt-4 mt-6">
            <Button
              onClick={onLogout}
              className="w-full relative h-9 font-mono font-bold tracking-wider uppercase bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-all cursor-pointer select-none active:translate-y-[1px] flex items-center justify-center gap-1.5"
            >
              <SignOut size={14} />
              Terminate Session
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
