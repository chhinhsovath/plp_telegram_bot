"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { AnimatedCard } from "@/components/ui/animated-card";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Eye,
  Loader2,
  Grid3X3,
  List,
  Calendar,
  HardDrive,
  Play,
  Maximize2,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, formatDistanceToNow } from "date-fns";
import { PhotoThumbnail } from "@/components/PhotoThumbnail";
import { DocumentThumbnail } from "@/components/DocumentThumbnail";
import { animations, colors } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface MediaGalleryProps {
  initialMedia?: any[];
  groups?: any[];
  stats?: any[];
  totalSize?: number;
}

export default function MediaGallery({ initialMedia = [], groups = [], stats = [], totalSize = 0 }: MediaGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [mediaType, setMediaType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [hoveredMedia, setHoveredMedia] = useState<string | null>(null);
  
  // Pagination state
  const [media, setMedia] = useState(initialMedia);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Refs for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch media from API
  const fetchMedia = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '50',
        search: debouncedSearchQuery,
        groupId: selectedGroup,
        fileType: mediaType,
      });

      const response = await fetch(`/api/media?${params}`);
      const data = await response.json();

      if (reset) {
        setMedia(data.attachments);
      } else {
        setMedia(prev => [...prev, ...data.attachments]);
      }
      
      setHasMore(data.pagination.hasMore);
      setTotalCount(data.pagination.totalCount);
      setPage(data.pagination.page);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, selectedGroup, mediaType]);

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    fetchMedia(1, true);
  }, [debouncedSearchQuery, selectedGroup, mediaType]);

  // Set up infinite scroll observer
  useEffect(() => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMedia(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, page, fetchMedia]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaIcon = (type: string) => {
    const iconMap = {
      photo: { icon: ImageIcon, color: "text-green-500", bg: "bg-green-500/10" },
      video: { icon: Video, color: "text-blue-500", bg: "bg-blue-500/10" },
      document: { icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
    };
    return iconMap[type as keyof typeof iconMap] || iconMap.document;
  };

  const mediaStats = {
    photos: stats.find(s => s.fileType === 'photo')?._count || 0,
    videos: stats.find(s => s.fileType === 'video')?._count || 0,
    documents: stats.find(s => s.fileType === 'document')?._count || 0,
    totalSize: formatFileSize(totalSize),
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        variants={animations.pageTransition}
        className="space-y-8"
      >
        <PageHeader
          title="Media Gallery"
          description={`Browse all media files collected from your groups${totalCount > 0 ? ` • ${media.length} of ${totalCount} loaded` : ''}`}
          icon={<ImageIcon className="w-6 h-6" />}
          actions={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === "grid" 
                      ? "bg-purple-600 text-white" 
                      : "hover:bg-white/10 text-gray-400"
                  )}
                  title="Grid View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === "list" 
                      ? "bg-purple-600 text-white" 
                      : "hover:bg-white/10 text-gray-400"
                  )}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export All
              </motion.button>
            </div>
          }
        />

        {/* Stats Overview */}
        <motion.div
          variants={animations.staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-4 md:grid-cols-4"
        >
          {[
            { label: "Photos", value: mediaStats.photos.toLocaleString(), icon: ImageIcon, color: "green" },
            { label: "Videos", value: mediaStats.videos.toLocaleString(), icon: Video, color: "blue" },
            { label: "Documents", value: mediaStats.documents.toLocaleString(), icon: FileText, color: "purple" },
            { label: "Total Size", value: mediaStats.totalSize, icon: HardDrive, color: "pink" },
          ].map((stat, index) => (
            <motion.div key={stat.label} variants={animations.staggerItem} custom={index}>
              <AnimatedCard variant="hover" className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <motion.div 
                    className={`p-3 rounded-lg bg-${stat.color}-500/10`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                  </motion.div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <AnimatedCard variant="hover" className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search media files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-white/5 border-white/10 focus:border-purple-500 transition-colors"
              />
            </div>
            
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-[200px] bg-white/5 border-white/10">
                <SelectValue placeholder="All Groups" />
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

            <Select value={mediaType} onValueChange={setMediaType}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AnimatedCard>

        {/* Media Grid/List */}
        <motion.div
          variants={animations.staggerContainer}
          initial="initial"
          animate="animate"
          className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              : "space-y-4"
          )}
        >
          {media.length === 0 && !loading ? (
            <AnimatedCard variant="hover" className="col-span-full p-12 text-center">
              <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-semibold mb-2">No media found</p>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </AnimatedCard>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {media.map((attachment: any, index: number) => {
                const mediaIcon = getMediaIcon(attachment.fileType);
                const IconComponent = mediaIcon.icon;
                
                return (
                  <motion.div
                    key={attachment.id}
                    layout
                    variants={animations.staggerItem}
                    custom={index}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onHoverStart={() => setHoveredMedia(attachment.id)}
                    onHoverEnd={() => setHoveredMedia(null)}
                    onClick={() => setSelectedMedia(attachment)}
                  >
                    {viewMode === "grid" ? (
                      <AnimatedCard 
                        variant="hover" 
                        className="relative overflow-hidden cursor-pointer group"
                        hover={true}
                      >
                        <div className="aspect-square relative">
                          {attachment.fileType === "photo" ? (
                            <>
                              <div className="w-full h-full">
                                <PhotoThumbnail
                                  attachment={attachment}
                                  size="large"
                                />
                              </div>
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                                animate={{
                                  opacity: hoveredMedia === attachment.id ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                              />
                            </>
                          ) : attachment.fileType === "video" ? (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                              {attachment.thumbnailUrl && (
                                <div className="absolute inset-0">
                                  <PhotoThumbnail
                                    attachment={attachment}
                                    size="large"
                                  />
                                </div>
                              )}
                              <motion.div
                                className="absolute inset-0 bg-black/40 flex items-center justify-center"
                                animate={{
                                  opacity: hoveredMedia === attachment.id ? 0.8 : 0.5,
                                }}
                              >
                                <Play className="w-12 h-12 text-white" />
                              </motion.div>
                            </div>
                          ) : (
                            <div className="w-full h-full">
                              {attachment.mimeType?.includes('pdf') || 
                               attachment.mimeType?.includes('word') || 
                               attachment.mimeType?.includes('document') ||
                               attachment.fileName?.toLowerCase().match(/\.(pdf|doc|docx)$/) ? (
                                <DocumentThumbnail
                                  attachment={attachment}
                                  size="large"
                                  className="w-full h-full"
                                />
                              ) : (
                                <div className={`w-full h-full ${mediaIcon.bg} flex items-center justify-center`}>
                                  <IconComponent className={`w-12 h-12 ${mediaIcon.color}`} />
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Hover Actions */}
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center gap-2 p-4"
                            animate={{
                              opacity: hoveredMedia === attachment.id ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/90 rounded-full text-gray-800 shadow-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMedia(attachment);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/90 rounded-full text-gray-800 shadow-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Download logic
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        </div>
                        
                        {/* Info */}
                        <div className="p-3 space-y-1">
                          <p className="text-sm font-medium truncate">
                            {attachment.fileName || "Unnamed file"}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatFileSize(Number(attachment.fileSize || 0))}</span>
                            <span>{formatDistanceToNow(new Date(attachment.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </AnimatedCard>
                    ) : (
                      <AnimatedCard variant="hover" className="p-4 cursor-pointer" hover={true}>
                        <div className="flex items-center gap-4">
                          {/* Thumbnail for list view */}
                          {attachment.fileType === "photo" ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <PhotoThumbnail
                                attachment={attachment}
                                size="small"
                              />
                            </div>
                          ) : attachment.fileType === "video" && attachment.thumbnailUrl ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                              <PhotoThumbnail
                                attachment={attachment}
                                size="small"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Play className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          ) : (attachment.mimeType?.includes('pdf') || 
                                 attachment.mimeType?.includes('word') || 
                                 attachment.mimeType?.includes('document') ||
                                 attachment.fileName?.toLowerCase().match(/\.(pdf|doc|docx)$/)) ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <DocumentThumbnail
                                attachment={attachment}
                                size="small"
                              />
                            </div>
                          ) : (
                            <motion.div
                              className={`p-3 rounded-lg ${mediaIcon.bg} flex-shrink-0`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <IconComponent className={`w-6 h-6 ${mediaIcon.color}`} />
                            </motion.div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {attachment.fileName || "Unnamed file"}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{formatFileSize(Number(attachment.fileSize || 0))}</span>
                              <span>•</span>
                              <span>{attachment.message?.group?.title || "Unknown Group"}</span>
                              <span>•</span>
                              <span>{formatDistanceToNow(new Date(attachment.createdAt), { addSuffix: true })}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMedia(attachment);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Download logic
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </AnimatedCard>
                    )}
                  </motion.div>
                );
              })}
              </AnimatePresence>
              
              {/* Loading indicator and infinite scroll trigger */}
              <div 
                ref={loadMoreRef} 
                className={cn(
                  "col-span-full flex justify-center py-8",
                  viewMode === "list" ? "mt-4" : ""
                )}
              >
                {loading && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm text-gray-500">Loading more media...</span>
                  </div>
                )}
                {!loading && !hasMore && media.length > 0 && (
                  <p className="text-sm text-gray-500">
                    No more media to load • {totalCount} total files
                  </p>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] bg-gray-900 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-10">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="font-medium">{selectedMedia.fileName || "Unnamed file"}</p>
                    <p className="text-sm opacity-75">
                      {formatFileSize(Number(selectedMedia.fileSize || 0))} • 
                      {selectedMedia.message?.group?.title || "Unknown Group"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedMedia(null)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex items-center justify-center p-16 min-h-[400px]">
                {selectedMedia.fileType === "photo" ? (
                  <div className="relative max-w-full max-h-[70vh]">
                    <Image
                      src={selectedMedia.storageUrl}
                      alt={selectedMedia.fileName || "Image"}
                      width={800}
                      height={600}
                      className="object-contain"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
                ) : selectedMedia.fileType === "video" ? (
                  <video
                    src={selectedMedia.storageUrl}
                    controls
                    className="max-w-full max-h-[70vh]"
                  />
                ) : (
                  <div className="text-center text-white">
                    <FileText className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">{selectedMedia.fileName}</p>
                    <p className="text-sm opacity-75">{selectedMedia.mimeType}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                    >
                      Download File
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}