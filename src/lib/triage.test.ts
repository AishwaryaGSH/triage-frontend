import { describe, expect, it } from "vitest";
import { buildTriageRunBody, completionMessage, isActiveTriageStatus, parsePatientIds, progressError, shouldRefreshPatients, validatePositiveInteger } from "@/lib/triage";

describe("triage workflow helpers", () => {
  it("accepts only positive whole numbers", () => {
    expect(validatePositiveInteger("5", "Limit")).toEqual({ value: 5 });
    expect(validatePositiveInteger("1.5", "Limit").error).toContain("whole number");
    expect(validatePositiveInteger("0", "Limit").error).toContain("greater than 0");
    expect(validatePositiveInteger("-1", "Limit").error).toBeTruthy();
    expect(validatePositiveInteger("", "Limit")).toEqual({ value: null });
  });

  it("parses one or more patient IDs separated by whitespace or commas", () => {
    expect(parsePatientIds("p1, p2\np3")).toEqual(["p1", "p2", "p3"]);
    expect(parsePatientIds("  ")).toEqual([]);
  });

  it("builds a request without sending empty filters", () => {
    expect(buildTriageRunBody(5, null, ["p1"])).toEqual({ months_back: 5, patient_ids: ["p1"] });
    expect(buildTriageRunBody(null, null, [])).toEqual({});
  });

  it("treats starting and running as active states", () => {
    expect(isActiveTriageStatus("starting")).toBe(true);
    expect(isActiveTriageStatus("running")).toBe(true);
    expect(isActiveTriageStatus("completed")).toBe(false);
  });

  it("refreshes results for completion and partial/error outcomes", () => {
    expect(shouldRefreshPatients("completed")).toBe(true);
    expect(shouldRefreshPatients("error")).toBe(true);
    expect(shouldRefreshPatients("running")).toBe(false);
  });

  it("preserves connection failures as errors rather than idle", () => {
    expect(progressError().status).toBe("error");
    expect(progressError().error).toContain("backend is unavailable");
  });

  it("reports saved and failed counts for partial runs", () => {
    expect(completionMessage({ status: "completed", current: 8, total: 10, saved: 8, failed: 2 })).toContain("8 saved, 2 failed");
  });
});
