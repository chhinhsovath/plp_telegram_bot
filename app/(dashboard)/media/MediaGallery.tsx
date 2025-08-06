'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Download, 
  Grid3x3, 
  List,
  Search,
  Calendar,
  Filter
} from "lucide-react";
import { PhotoThumbnail } from "@/components/PhotoThumbnail";
import { MediaAttachment } from "@/components/MediaAttachment";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MediaGalleryProps {
  initialMedia: any[];
  groups: any[];
  stats: any;
  totalSize: bigint;
}

export default function MediaGallery({ initialMedia, groups, stats, totalSize }: MediaGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaItems] = useState(initialMedia);

  const mediaTypes = {
    photo: { icon: ImageIcon, label: "Photos", color: "text-blue-500" },
    video: { icon: Video, label: "Videos", color: "text-purple-500" },
    document: { icon: FileText, label: "Documents", color: "text-green-500" },
  };

  const filteredMedia = mediaItems.filter(item => {
    const matchesGroup = selectedGroup === "all" || item.message.groupId === selectedGroup;
    const matchesSearch = !searchQuery || 
      item.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.text?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const getMediaByType = (type: string) => {
    return type === 'all' ? filteredMedia : filteredMedia.filter(item => item.fileType === type);
  };

  const renderGridView = (items: any[]) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold mb-2">No media files found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search query
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            {item.fileType === 'photo' ? (
              <PhotoThumbnail
                attachment={item}
                size="medium"
                showHoverPreview={true}
              />
            ) : (
              <MediaAttachment
                attachment={item}
                className="h-32 w-full"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs truncate">{item.fileName || 'Untitled'}</p>
              <p className="text-xs">{format(new Date(item.createdAt), 'MMM d, yyyy')}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderListView = (items: any[]) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No media files found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search query
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex-shrink-0 mr-4">
              {item.fileType === 'photo' ? (
                <PhotoThumbnail
                  attachment={item}
                  size="small"
                  showHoverPreview={false}
                />
              ) : item.fileType === 'video' ? (
                <Video className="h-10 w-10 text-purple-500" />
              ) : (
                <FileText className="h-10 w-10 text-green-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.fileName || 'Untitled'}</p>
              <p className="text-sm text-gray-500">
                {item.message.group.title} • {format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {item.fileSize ? `${(Number(item.fileSize) / 1024).toFixed(1)} KB` : 'Unknown size'}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(item.storageUrl || `/api/files/${item.id}`, '_blank')}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
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
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(mediaTypes).map(([type, config]) => {
          const count = stats.find((s: any) => s.fileType === type)?._count || 0;
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by filename..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {groups.map((group: any) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Media Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Media ({filteredMedia.length})</TabsTrigger>
          <TabsTrigger value="photo">Photos ({getMediaByType('photo').length})</TabsTrigger>
          <TabsTrigger value="video">Videos ({getMediaByType('video').length})</TabsTrigger>
          <TabsTrigger value="document">Documents ({getMediaByType('document').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-6">
              {viewMode === 'grid' ? renderGridView(filteredMedia) : renderListView(filteredMedia)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photo">
          <Card>
            <CardContent className="p-6">
              {renderGridView(getMediaByType('photo'))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video">
          <Card>
            <CardContent className="p-6">
              {viewMode === 'grid' ? renderGridView(getMediaByType('video')) : renderListView(getMediaByType('video'))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="document">
          <Card>
            <CardContent className="p-6">
              {renderListView(getMediaByType('document'))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}