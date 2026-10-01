import type { TriageProgress as TriageProgressState } from "@/lib/api";

export default function TriageProgress({ progress }: { progress: TriageProgressState }) {
  const total = progress.total || 0;
  const current = progress.current || 0;
  const percentage = total ? Math.min(100, Math.round((current / total) * 100)) : 0;
  const active = progress.status === "running";
  return <section className="triage-card p-5" aria-live="polite">
    <div className="mb-3 flex items-center justify-between gap-3"><div><h2 className="font-semibold">Triage progress</h2><p className="triage-muted text-sm">{progress.message || (active ? "Classification is running..." : `Status: ${progress.status}`)}</p></div><strong>{total ? `${current}/${total}` : progress.status}</strong></div>
    <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} /></div>
    {progress.error && <p className="mt-3 text-sm text-destructive">{progress.error}</p>}
  </section>;
}
