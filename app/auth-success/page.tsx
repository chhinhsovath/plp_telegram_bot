"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthSuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (session) {
      // Session is established, redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      // No session, redirect back to login
      router.push("/login");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className="text-xl font-semibold mb-2">Logging you in...</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we set up your dashboard.
        </p>
      </div>
    </div>
  );
}