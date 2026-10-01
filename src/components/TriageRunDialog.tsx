import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TriageRunDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRun: (monthsBack: number | null, limit: number | null) => void;
}

export default function TriageRunDialog({ open, onOpenChange, onRun }: TriageRunDialogProps) {
  const [monthsBack, setMonthsBack] = useState("");
  const [limit, setLimit] = useState("");
  const reset = () => { setMonthsBack(""); setLimit(""); };
  const handleSubmit = () => {
    const monthsBackValue = monthsBack.trim() ? Number.parseInt(monthsBack.trim(), 10) : null;
    const limitValue = limit.trim() ? Number.parseInt(limit.trim(), 10) : null;
    if ((monthsBackValue !== null && (!Number.isInteger(monthsBackValue) || monthsBackValue < 1)) || (limitValue !== null && (!Number.isInteger(limitValue) || limitValue < 1))) return;
    onRun(monthsBackValue, limitValue); onOpenChange(false); reset();
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader><DialogTitle>Run Triage Classification</DialogTitle><DialogDescription>Leave fields empty to process all eligible patients.</DialogDescription></DialogHeader>
      <div className="grid gap-4 py-3">
        <div className="grid gap-2"><Label htmlFor="months-back">Months Back</Label><Input id="months-back" type="number" min="1" placeholder="e.g. 5" value={monthsBack} onChange={event => setMonthsBack(event.target.value)} /><p className="text-xs text-muted-foreground">Look back from the current date for first-assessment records.</p></div>
        <div className="grid gap-2"><Label htmlFor="patient-limit">Number of Patients</Label><Input id="patient-limit" type="number" min="1" placeholder="e.g. 100" value={limit} onChange={event => setLimit(event.target.value)} /><p className="text-xs text-muted-foreground">Maximum eligible patients to classify.</p></div>
      </div>
      <DialogFooter><Button variant="outline" onClick={() => { onOpenChange(false); reset(); }}>Cancel</Button><Button onClick={handleSubmit}>Run Classification</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}
