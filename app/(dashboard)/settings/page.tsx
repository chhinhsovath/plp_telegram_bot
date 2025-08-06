import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return <SettingsClient session={session} />;
}