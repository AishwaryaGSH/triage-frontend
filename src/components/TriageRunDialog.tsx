import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parsePatientIds, validatePositiveInteger } from "@/lib/triage";

interface TriageRunDialogProps {
  open: boolean;
  disabled?: boolean;
  onOpenChange: (open: boolean) => void;
  onRun: (monthsBack: number | null, limit: number | null, patientIds: string[]) => void | Promise<void>;
}

export default function TriageRunDialog({ open, disabled = false, onOpenChange, onRun }: TriageRunDialogProps) {
  const [monthsBack, setMonthsBack] = useState("");
  const [limit, setLimit] = useState("");
  const [patientIds, setPatientIds] = useState("");
  const [errors, setErrors] = useState<{ monthsBack?: string; limit?: string }>({});

  const reset = () => {
    setMonthsBack("");
    setLimit("");
    setPatientIds("");
    setErrors({});
  };

  const handleSubmit = () => {
    const monthsValidation = validatePositiveInteger(monthsBack, "Months back");
    const limitValidation = validatePositiveInteger(limit, "Patient limit");
    const nextErrors = { monthsBack: monthsValidation.error, limit: limitValidation.error };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    void onRun(monthsValidation.value, limitValidation.value, parsePatientIds(patientIds));
    onOpenChange(false);
    reset();
  };

  return <Dialog open={open} onOpenChange={disabled ? undefined : onOpenChange}>
    <DialogContent>
      <DialogHeader><DialogTitle>Run Triage Classification</DialogTitle><DialogDescription>Leave filters empty to process all eligible patients.</DialogDescription></DialogHeader>
      <div className="grid gap-4 py-3">
        <div className="grid gap-2"><Label htmlFor="months-back">Months Back</Label><Input id="months-back" type="number" min="1" step="1" placeholder="e.g. 5" value={monthsBack} disabled={disabled} aria-invalid={Boolean(errors.monthsBack)} onChange={event => setMonthsBack(event.target.value)} />{errors.monthsBack ? <p className="text-xs text-destructive">{errors.monthsBack}</p> : <p className="text-xs text-muted-foreground">Look back from the current date for first-assessment records.</p>}</div>
        <div className="grid gap-2"><Label htmlFor="patient-limit">Patient Limit</Label><Input id="patient-limit" type="number" min="1" step="1" placeholder="e.g. 100" value={limit} disabled={disabled} aria-invalid={Boolean(errors.limit)} onChange={event => setLimit(event.target.value)} />{errors.limit ? <p className="text-xs text-destructive">{errors.limit}</p> : <p className="text-xs text-muted-foreground">Maximum candidate patients to scan before eligibility filtering.</p>}</div>
        <div className="grid gap-2"><Label htmlFor="patient-ids">Patient IDs (optional)</Label><textarea id="patient-ids" rows={3} placeholder="One or more IDs separated by commas or spaces" value={patientIds} disabled={disabled} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" onChange={event => setPatientIds(event.target.value)} /><p className="text-xs text-muted-foreground">When provided, only these patients are processed.</p></div>
      </div>
      <DialogFooter><Button variant="outline" disabled={disabled} onClick={() => { onOpenChange(false); reset(); }}>Cancel</Button><Button disabled={disabled} onClick={handleSubmit}>{disabled ? "Starting..." : "Run Classification"}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}
