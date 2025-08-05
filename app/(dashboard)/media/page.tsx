import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Video, FileText, Download, Grid3x3, List } from "lucide-react";
import prisma from "@/lib/db";

async function getMediaStats() {
  const stats = await prisma.attachment.groupBy({
    by: ['fileType'],
    _count: true,
  });

  const totalSize = await prisma.attachment.aggregate({
    _sum: {
      fileSize: true,
    },
  });

  return { stats, totalSize: totalSize._sum.fileSize || BigInt(0) };
}

export default async function MediaPage() {
  const { stats, totalSize } = await getMediaStats();

  const mediaTypes = {
    photo: { icon: Image, label: "Photos", color: "text-blue-500" },
    video: { icon: Video, label: "Videos", color: "text-purple-500" },
    document: { icon: FileText, label: "Documents", color: "text-green-500" },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Media Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400">
            All photos, videos, and documents from your groups
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(mediaTypes).map(([type, config]) => {
          const count = stats.find(s => s.fileType === type)?._count || 0;
          return (
            <Card key={type}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {config.label}
                  </p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <config.icon className={`h-8 w-8 ${config.color}`} />
              </CardContent>
            </Card>
          );
        })}
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Size
              </p>
              <p className="text-2xl font-bold">
                {(Number(totalSize) / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Download className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      {/* Media Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Media</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No media files yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Media files will appear here once the bot collects them from your groups.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Photo grid would go here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Video grid would go here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                {/* Document list would go here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}