import prisma from "@/lib/db";
import MediaGallery from "./MediaGallery";

async function getMediaData() {
  const [stats, totalSizeResult, attachments, groups] = await Promise.all([
    prisma.attachment.groupBy({
      by: ['fileType'],
      _count: true,
    }),
    prisma.attachment.aggregate({
      _sum: {
        fileSize: true,
      },
    }),
    prisma.attachment.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        message: {
          include: {
            group: true,
            user: true,
          },
        },
      },
    }),
    prisma.telegramGroup.findMany({
      where: { isActive: true },
      orderBy: { title: 'asc' },
    }),
  ]);

  const totalSize = totalSizeResult._sum.fileSize || BigInt(0);

  return { stats, totalSize, attachments, groups };
}

export default async function MediaPage() {
  const { stats, totalSize, attachments, groups } = await getMediaData();

  return (
    <MediaGallery
      initialMedia={attachments}
      groups={groups}
      stats={stats}
      totalSize={totalSize}
    />
  );
}