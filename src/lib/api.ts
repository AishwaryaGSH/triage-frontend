import type { PatientMasterView } from "@/types/clinical";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8013").replace(/\/$/, "");

export interface TriageProgress {
  status: string;
  current: number;
  total: number;
  message?: string | null;
  error?: string | null;
  saved?: number;
  failed?: number;
}

export interface TriageRunRequest {
  months_back?: number | null;
  limit?: number | null;
  patient_ids?: string[];
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`API ${response.status}: ${detail || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export const endpoints = {
  patients: "/api/patients",
  triageRun: "/api/triage/run",
  triageProgress: "/api/triage/progress",
  triageStatus: "/api/triage/status",
} as const;

export function loadPatients() {
  return apiRequest<PatientMasterView[]>(endpoints.patients);
}
