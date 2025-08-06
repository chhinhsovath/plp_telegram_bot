"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface RealtimeMessage {
  id: string;
  groupName: string;
  username: string;
  messageType: string;
  timestamp: string;
}

export function RealtimeStats() {
  const [recentMessages, setRecentMessages] = useState<RealtimeMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate real-time updates (in production, this would be WebSocket or SSE)
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/analytics/realtime");
        if (response.ok) {
          const data = await response.json();
          setRecentMessages(data.recentMessages || []);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Failed to fetch realtime data:", error);
        setIsConnected(false);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Real-time Activity
        </CardTitle>
        <Badge variant={isConnected ? "default" : "secondary"}>
          {isConnected ? "Live" : "Offline"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Waiting for new messages...
            </p>
          ) : (
            recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm"
              >
                <div className="flex-1">
                  <span className="font-medium">{msg.username}</span>
                  <span className="text-muted-foreground"> in </span>
                  <span className="font-medium">{msg.groupName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {msg.messageType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}