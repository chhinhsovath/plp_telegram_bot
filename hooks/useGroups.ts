import { useQuery } from "@tanstack/react-query";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await fetch("/api/groups");
      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }
      return response.json();
    },
  });
}