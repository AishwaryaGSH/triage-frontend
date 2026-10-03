export type FunctionalRegion = "Upper limb" | "Lower limb" | "Spine" | "Posterior chain" | "Multi-joint" | string;
export type ActivityProfile = "Sedentary / minimally active" | "Recreationally active" | "Structured fitness" | "Competitive / elite sport" | "Unclear" | string;
export type ActivitySubtype = "Running-dominant" | "Gym / strength-dominant" | "Sport-specific" | "Mixed / general fitness" | "Unclear" | string;
export type ClinicalStage = "Acute" | "Subacute" | "Chronic" | "Recurrent" | "Pre-hab / pre-surgical" | "Post-operative" | "Unclear" | string;
export type PainInterference = "No / minimal interference" | "Activity-only interference" | "Work / daily function interference" | "Multi-domain interference" | "Forced entry (surgery or trauma)" | "Unclear" | string;
export type IntentCategory = "Pain relief only" | "Return to daily function" | "Return to activity / fitness" | "Return to sport" | "Performance / optimisation" | "Post-surgical recovery" | "Unclear" | string;

export interface PatientMasterView {
  id: string;
  patientName: string;
  provisionalDiagnosis?: string | null;
  canonicalDiagnosis?: string | null;
  primaryJoint?: string | null;
  functionalRegion?: FunctionalRegion | null;
  occupationCategory?: string | null;
  activityProfile?: ActivityProfile | null;
  activitySubtype?: ActivitySubtype | null;
  clinicalStage?: ClinicalStage | null;
  painInterference?: PainInterference | null;
  nprsAvailable: boolean;
  nprsScore?: number | null;
  intentCategory?: IntentCategory | null;
  strengthAsymmetry?: number | null;
  absoluteForceLevel?: string | null;
  romAsymmetryDegrees?: number | null;
  status?: string | null;
  attempt_status?: string | null;
  attempt_error?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  attempt_started_at?: string | null;
  attempt_completed_at?: string | null;
  source_data?: Record<string, unknown> | null;
  extracted_fields?: Record<string, any> | null;
  data_quality_flags?: Record<string, boolean> | null;
}
