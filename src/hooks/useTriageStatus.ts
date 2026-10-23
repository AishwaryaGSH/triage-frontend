import { useQuery } from "@tanstack/react-query";
import { apiRequest, endpoints, type TriageProgress } from "@/lib/api";

export function useTriageStatus() {
  return useQuery<TriageProgress>({
    queryKey: ["triage-progress"],
    queryFn: () => apiRequest<TriageProgress>(endpoints.triageProgress),
    refetchInterval: 2000,
    retry: false,
    staleTime: 0,
  });
}
