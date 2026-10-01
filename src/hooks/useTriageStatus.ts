import { useQuery } from "@tanstack/react-query";
import { apiRequest, endpoints, type TriageProgress } from "@/lib/api";

export function useTriageStatus() {
  return useQuery<TriageProgress>({
    queryKey: ["triage-progress"],
    queryFn: async () => {
      try {
        return await apiRequest<TriageProgress>(endpoints.triageProgress);
      } catch {
        return { status: "idle", current: 0, total: 0, message: null, error: null };
      }
    },
    refetchInterval: 2000,
    retry: false,
    staleTime: 0,
  });
}
