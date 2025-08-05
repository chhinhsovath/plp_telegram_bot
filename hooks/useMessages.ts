import { useQuery } from "@tanstack/react-query";

interface UseMessagesOptions {
  page?: number;
  limit?: number;
  search?: string;
  groupId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export function useMessages(options: UseMessagesOptions = {}) {
  const {
    page = 1,
    limit = 20,
    search = "",
    groupId = "all",
    type = "all",
    startDate,
    endDate,
  } = options;

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append("search", search);
  if (groupId && groupId !== "all") params.append("groupId", groupId);
  if (type && type !== "all") params.append("type", type);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  return useQuery({
    queryKey: ["messages", params.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/messages?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      return response.json();
    },
  });
}