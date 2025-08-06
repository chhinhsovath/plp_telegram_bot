import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GroupsClient from "./GroupsClient";

async function getGroups() {
  const groups = await prisma.telegramGroup.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          messages: true,
          groupMembers: true,
        },
      },
    },
  });

  return groups;
}

export default async function GroupsPage() {
  const groups = await getGroups();
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'admin';

  // Convert BigInt to string for serialization
  const serializedGroups = groups.map(group => ({
    ...group,
    telegramId: group.telegramId.toString() as any,
    botAddedAt: group.botAddedAt.toISOString() as any,
  }));

  return <GroupsClient groups={serializedGroups} isAdmin={isAdmin} />;
}