"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { useState, createContext, useContext, ReactNode } from "react";

interface FilterContextType {
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function useAnalyticsFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useAnalyticsFilters must be used within AnalyticsFilterProvider");
  }
  return context;
}

export function AnalyticsFilterProvider({ children }: { children: ReactNode }) {
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  return (
    <FilterContext.Provider
      value={{ selectedGroup, setSelectedGroup, selectedPeriod, setSelectedPeriod }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function AnalyticsFilters() {
  const { selectedGroup, setSelectedGroup, selectedPeriod, setSelectedPeriod } = useAnalyticsFilters();

  const { data: groups } = useQuery({
    queryKey: ["groups-list"],
    queryFn: async () => {
      const response = await fetch("/api/groups");
      if (!response.ok) throw new Error("Failed to fetch groups");
      return response.json();
    },
  });

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Label htmlFor="period-filter">Time Period</Label>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger id="period-filter" className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last 24 hours</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="group-filter">Group</Label>
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger id="group-filter" className="w-[200px]">
            <SelectValue placeholder="All groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {groups?.groups?.map((group: any) => (
              <SelectItem key={group.id} value={group.id}>
                {group.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}