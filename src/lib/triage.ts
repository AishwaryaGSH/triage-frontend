import type { TriageProgress } from "@/lib/api";

export function validatePositiveInteger(value: string, label: string): { value: number | null; error?: string } {
  const trimmed = value.trim();
  if (!trimmed) return { value: null };
  if (!/^[1-9]\d*$/.test(trimmed)) return { value: null, error: `${label} must be a whole number greater than 0.` };
  return { value: Number(trimmed) };
}

export function parsePatientIds(input: string): string[] {
  return input.split(/[\s,]+/).map(id => id.trim()).filter(Boolean);
}

export function buildTriageRunBody(monthsBack: number | null, limit: number | null, patientIds: string[]) {
  return {
    ...(monthsBack !== null ? { months_back: monthsBack } : {}),
    ...(limit !== null ? { limit } : {}),
    ...(patientIds.length ? { patient_ids: patientIds } : {}),
  };
}

export function isActiveTriageStatus(status?: string | null) {
  return status === "running" || status === "starting";
}

export function shouldRefreshPatients(status?: string | null) {
  return status === "completed" || status === "error";
}

export function progressError(message = "The triage backend is unavailable. Check the API URL and connection."): TriageProgress {
  return { status: "error", current: 0, total: 0, message: null, error: message };
}

export function completionMessage(progress: TriageProgress) {
  if (progress.status === "error") return progress.error || "Triage completed with an error. Check backend logs.";
  const saved = progress.saved ?? progress.current;
  const failed = progress.failed ?? 0;
  return failed
    ? `Triage completed with partial results: ${saved} saved, ${failed} failed.`
    : `Triage completed: ${saved} classification${saved === 1 ? "" : "s"} saved.`;
}
