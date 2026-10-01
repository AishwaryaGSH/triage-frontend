import { useMemo, useState } from "react";
import type { PatientMasterView } from "@/types/clinical";

interface PatientTableProps { patients: PatientMasterView[]; isLoading?: boolean; }

function value(value: unknown, fallback = "Unclear") {
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

export default function PatientTable({ patients, isLoading = false }: PatientTableProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter(patient => [patient.patientName, patient.canonicalDiagnosis, patient.primaryJoint, patient.functionalRegion, patient.clinicalStage, patient.intentCategory].some(field => value(field, "").toLowerCase().includes(term)));
  }, [patients, query]);

  return <section className="triage-card overflow-hidden">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5"><div><h2 className="text-lg font-semibold">Patient classifications</h2><p className="triage-muted text-sm">Structured output returned by the triage API.</p></div><input className="h-9 w-64 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Search patients..." value={query} onChange={event => setQuery(event.target.value)} /></div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr>{["Patient", "Diagnosis", "Joint / Region", "Stage", "Activity", "Occupation", "Pain / NPRS", "Intent"].map(header => <th className="px-4 py-3" key={header}>{header}</th>)}</tr></thead>
        <tbody className="divide-y">
          {isLoading && <tr><td className="px-4 py-10 text-center text-muted-foreground" colSpan={8}>Loading classifications...</td></tr>}
          {!isLoading && filtered.length === 0 && <tr><td className="px-4 py-10 text-center text-muted-foreground" colSpan={8}>{patients.length ? "No patients match the search." : "No completed classifications. Run triage to generate data."}</td></tr>}
          {!isLoading && filtered.map(patient => <tr key={patient.id} className="hover:bg-muted/30">
            <td className="px-4 py-3"><div className="font-medium">{value(patient.patientName, "Unknown patient")}</div><div className="text-xs text-muted-foreground">{patient.id}</div></td>
            <td className="px-4 py-3">{value(patient.canonicalDiagnosis || patient.provisionalDiagnosis)}</td>
            <td className="px-4 py-3">{value(patient.primaryJoint)}<br /><span className="text-xs text-muted-foreground">{value(patient.functionalRegion)}</span></td>
            <td className="px-4 py-3">{value(patient.clinicalStage)}</td>
            <td className="px-4 py-3">{value(patient.activityProfile)}</td>
            <td className="px-4 py-3">{value(patient.occupationCategory)}</td>
            <td className="px-4 py-3">{value(patient.painInterference)}<br /><span className="text-xs text-muted-foreground">NPRS: {patient.nprsAvailable && patient.nprsScore !== null && patient.nprsScore !== undefined ? `${patient.nprsScore}/10` : "Not recorded"}</span></td>
            <td className="px-4 py-3">{value(patient.intentCategory)}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
    <div className="border-t px-5 py-3 text-xs text-muted-foreground">Showing {filtered.length} of {patients.length} patients</div>
  </section>;
}
