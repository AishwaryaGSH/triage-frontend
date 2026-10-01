import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TriageRunDialog from "@/components/TriageRunDialog";
import TriageProgress from "@/components/TriageProgress";
import PatientTable from "@/components/PatientTable";
import { apiRequest, endpoints, loadPatients } from "@/lib/api";
import { useTriageStatus } from "@/hooks/useTriageStatus";

export default function TriageDashboard() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [runActive, setRunActive] = useState(false);
  const [message, setMessage] = useState("");
  const progressQuery = useTriageStatus();
  const patientsQuery = useQuery({ queryKey: ["patients"], queryFn: loadPatients, staleTime: 30_000 });
  const progress = progressQuery.data || { status: "idle", current: 0, total: 0 };

  useEffect(() => {
    if (!runActive || !["completed", "error"].includes(progress.status)) return;
    setRunActive(false);
    if (progress.status === "completed") {
      setMessage("Triage completed. Classifications were refreshed.");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    } else {
      setMessage(progress.error || "Triage completed with an error. Check backend logs.");
    }
  }, [progress.status, progress.error, runActive, queryClient]);

  async function runTriage(monthsBack: number | null, limit: number | null) {
    setMessage("Starting triage...");
    try {
      await apiRequest<{ status: string; message: string }>(endpoints.triageRun, { method: "POST", body: JSON.stringify({ ...(monthsBack ? { months_back: monthsBack } : {}), ...(limit ? { limit } : {}) }) });
      setRunActive(true);
      setMessage("Triage started in the backend.");
      await queryClient.invalidateQueries({ queryKey: ["triage-progress"] });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to start triage.");
    }
  }

  const patients = patientsQuery.data || [];
  return <main className="mx-auto min-h-screen max-w-[1440px] space-y-5 p-5 md:p-8">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-1 text-sm font-semibold text-primary">HealthFlex</p><h1 className="text-3xl font-bold tracking-tight">Triage classifications</h1><p className="triage-muted mt-1">Run the triage agent and review structured patient output.</p></div><button className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50" onClick={() => setDialogOpen(true)} disabled={runActive}>{runActive ? "Triage running..." : "Run triage"}</button></header>
    <TriageRunDialog open={dialogOpen} onOpenChange={setDialogOpen} onRun={runTriage} />
    {message && <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800" role="status">{message}</div>}
    <TriageProgress progress={progress} />
    <PatientTable patients={patients} isLoading={patientsQuery.isLoading} />
    {patientsQuery.error && <p className="text-sm text-destructive">Could not load patients: {patientsQuery.error.message}</p>}
  </main>;
}
