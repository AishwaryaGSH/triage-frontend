import { useMemo, useState } from "react";
import type { PatientMasterView } from "@/types/clinical";

interface PatientTableProps { patients: PatientMasterView[]; isLoading?: boolean; }

function value(value: unknown, fallback = "Unclear") {
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

function formatDate(valueToFormat?: string | null) {
  if (!valueToFormat) return "Not recorded";
  const date = new Date(valueToFormat);
  return Number.isNaN(date.getTime()) ? valueToFormat : date.toLocaleString();
}

function json(valueToFormat: unknown) {
  return valueToFormat && Object.keys(valueToFormat).length ? JSON.stringify(valueToFormat, null, 2) : "Not recorded";
}

function statusClass(status?: string | null) {
  return status === "failed" ? "bg-red-100 text-red-800" : status === "completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800";
}

function Details({ patient }: { patient: PatientMasterView }) {
  const diagnosis = patient.extracted_fields?.provisional_diagnosis || {};
  const joint = patient.extracted_fields?.joint_mapping || {};
  const stage = patient.extracted_fields?.clinical_stage || {};
  const activity = patient.extracted_fields?.activity_profile || {};
  const occupation = patient.extracted_fields?.occupation || {};
  const pain = patient.extracted_fields?.pain_interference || {};
  const nprs = patient.extracted_fields?.pain_intensity_nprs || {};
  const intent = patient.extracted_fields?.intent || {};
  return <tr><td colSpan={9} className="bg-muted/20 px-5 py-4"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <DetailSection title="Source assessment"><Detail label="Raw diagnosis" value={patient.source_data?.provisional_diagnosis_raw} /><Detail label="Chief complaint" value={patient.source_data?.chief_complaint} /><Detail label="Clinical history" value={patient.source_data?.clinical_history} /><Detail label="Goals" value={patient.source_data?.goals_raw} /></DetailSection>
    <DetailSection title="Classification evidence"><Detail label="Diagnosis confidence" value={diagnosis.confidence} /><Detail label="Diagnosis evidence" value={diagnosis.raw_matches} /><Detail label="Stage evidence" value={stage.evidence} /><Detail label="Activity evidence" value={activity.evidence} /><Detail label="Intent evidence" value={intent.evidence} /></DetailSection>
    <DetailSection title="Extracted fields"><Detail label="Joint" value={joint.primary_joint} /><Detail label="Region" value={joint.functional_region} /><Detail label="Occupation" value={occupation.category} /><Detail label="Pain domains" value={pain.domains_affected} /><Detail label="NPRS evidence" value={nprs.evidence_text} /></DetailSection>
    <DetailSection title="Quality and processing"><Detail label="Quality flags" value={json(patient.data_quality_flags)} /><Detail label="Record status" value={patient.status} /><Detail label="Attempt status" value={patient.attempt_status} /><Detail label="Attempt error" value={patient.attempt_error} /><Detail label="Updated" value={formatDate(patient.updated_at)} /></DetailSection>
  </div><div className="mt-4 grid gap-2 text-xs text-muted-foreground md:grid-cols-3"><span>Created: {formatDate(patient.created_at)}</span><span>Attempt started: {formatDate(patient.attempt_started_at)}</span><span>Attempt completed: {formatDate(patient.attempt_completed_at)}</span></div></td></tr>;
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border bg-background p-3"><h3 className="mb-3 text-sm font-semibold">{title}</h3><div className="space-y-2">{children}</div></section>;
}

function Detail({ label, value: detailValue }: { label: string; value: unknown }) {
  return <div><dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt><dd className="whitespace-pre-wrap break-words text-sm">{detailValue === undefined || detailValue === null || detailValue === "" ? "Not recorded" : typeof detailValue === "object" ? JSON.stringify(detailValue) : String(detailValue)}</dd></div>;
}

export default function PatientTable({ patients, isLoading = false }: PatientTableProps) {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter(patient => [patient.id, patient.patientName, patient.canonicalDiagnosis, patient.primaryJoint, patient.functionalRegion, patient.clinicalStage, patient.intentCategory, patient.attempt_status, patient.status].some(field => value(field, "").toLowerCase().includes(term)));
  }, [patients, query]);

  return <section className="triage-card overflow-hidden">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5"><div><h2 className="text-lg font-semibold">Patient classifications</h2><p className="triage-muted text-sm">Expand a row to inspect evidence, quality flags, and processing status.</p></div><input className="h-9 w-64 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Search name, ID, or status..." value={query} onChange={event => setQuery(event.target.value)} /></div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1200px] text-left text-sm"><thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr>{["Patient", "Diagnosis", "Joint / Region", "Stage", "Activity", "Occupation", "Pain / NPRS", "Intent", "Status", "Details"].map(header => <th className="px-4 py-3" key={header}>{header}</th>)}</tr></thead>
        <tbody className="divide-y">
          {isLoading && <tr><td className="px-4 py-10 text-center text-muted-foreground" colSpan={10}>Loading classifications...</td></tr>}
          {!isLoading && filtered.length === 0 && <tr><td className="px-4 py-10 text-center text-muted-foreground" colSpan={10}>{patients.length ? "No patients match the search." : "No completed classifications. Run triage to generate data."}</td></tr>}
          {!isLoading && filtered.map(patient => <>
            <tr key={patient.id} className="hover:bg-muted/30">
              <td className="px-4 py-3"><div className="font-medium">{value(patient.patientName, "Unknown patient")}</div><div className="text-xs text-muted-foreground">{patient.id}</div></td>
              <td className="px-4 py-3">{value(patient.canonicalDiagnosis || patient.provisionalDiagnosis)}</td>
              <td className="px-4 py-3">{value(patient.primaryJoint)}<br /><span className="text-xs text-muted-foreground">{value(patient.functionalRegion)}</span></td>
              <td className="px-4 py-3">{value(patient.clinicalStage)}</td>
              <td className="px-4 py-3">{value(patient.activityProfile)}</td>
              <td className="px-4 py-3">{value(patient.occupationCategory)}</td>
              <td className="px-4 py-3">{value(patient.painInterference)}<br /><span className="text-xs text-muted-foreground">NPRS: {patient.nprsAvailable && patient.nprsScore !== null && patient.nprsScore !== undefined ? `${patient.nprsScore}/10` : "Not recorded"}</span></td>
              <td className="px-4 py-3">{value(patient.intentCategory)}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(patient.attempt_status || patient.status)}`}>{value(patient.attempt_status || patient.status, "unknown")}</span></td>
              <td className="px-4 py-3"><button className="rounded border px-2 py-1 text-xs hover:bg-muted" onClick={() => setExpandedId(expandedId === patient.id ? null : patient.id)}>{expandedId === patient.id ? "Hide" : "Details"}</button></td>
            </tr>
            {expandedId === patient.id && <Details key={`${patient.id}-details`} patient={patient} />}
          </>)}
        </tbody>
      </table>
    </div>
    <div className="border-t px-5 py-3 text-xs text-muted-foreground">Showing {filtered.length} of {patients.length} patients</div>
  </section>;
}
