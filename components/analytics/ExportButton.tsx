"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all analytics data
      const [overview, activity, groups, users] = await Promise.all([
        fetch("/api/analytics/overview").then(res => res.json()),
        fetch("/api/analytics/activity?days=30").then(res => res.json()),
        fetch("/api/analytics/groups?days=30").then(res => res.json()),
        fetch("/api/analytics/users?days=30").then(res => res.json()),
      ]);

      // Create report data
      const report = {
        generatedAt: new Date().toISOString(),
        dateRange: {
          from: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
          to: format(new Date(), "yyyy-MM-dd"),
        },
        overview: {
          messagestoday: overview.messagestoday,
          messageChange: overview.messageChange,
          activeUsers: overview.activeUsersCount,
          userChange: overview.userChange,
          avgMessagesPerDay: overview.avgMessagesPerDay,
          peakHour: overview.peakHour,
        },
        activity: {
          dailyMessages: activity.dailyActivity,
          hourlyDistribution: activity.hourlyDistribution,
          messageTypes: activity.messageTypes,
        },
        groups: {
          topGroups: groups.topGroups,
          stats: groups.groupStats,
        },
        users: {
          topContributors: users.topContributors,
          growth: users.userGrowth,
        },
      };

      // Convert to CSV
      const csvContent = generateCSV(report);

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `telegram-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSV = (report: any) => {
    let csv = "Telegram Bot Analytics Report\n";
    csv += `Generated at: ${format(new Date(report.generatedAt), "yyyy-MM-dd HH:mm:ss")}\n`;
    csv += `Date Range: ${report.dateRange.from} to ${report.dateRange.to}\n\n`;

    // Overview Section
    csv += "OVERVIEW METRICS\n";
    csv += "Metric,Value,Change\n";
    csv += `Messages Today,${report.overview.messagestoday},${report.overview.messageChange}%\n`;
    csv += `Active Users,${report.overview.activeUsers},${report.overview.userChange}%\n`;
    csv += `Average Messages/Day,${report.overview.avgMessagesPerDay},-\n`;
    csv += `Peak Hour,${report.overview.peakHour},-\n\n`;

    // Daily Activity
    csv += "DAILY MESSAGE ACTIVITY\n";
    csv += "Date,Messages\n";
    report.activity.dailyMessages.forEach((day: any) => {
      csv += `${day.date},${day.messages}\n`;
    });
    csv += "\n";

    // Top Groups
    csv += "TOP GROUPS\n";
    csv += "Group Name,Messages,Members,Active Members,Engagement Rate\n";
    report.groups.topGroups.forEach((group: any) => {
      csv += `"${group.name}",${group.messages},${group.members},${group.activeMembers},${group.engagementRate}%\n`;
    });
    csv += "\n";

    // Top Contributors
    csv += "TOP CONTRIBUTORS\n";
    csv += "Username,User ID,Message Count\n";
    report.users.topContributors.forEach((user: any) => {
      csv += `${user.username},${user.userId},${user.messageCount}\n`;
    });

    return csv;
  };

  return (
    <Button onClick={handleExport} disabled={isExporting}>
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? "Exporting..." : "Export Report"}
    </Button>
  );
}