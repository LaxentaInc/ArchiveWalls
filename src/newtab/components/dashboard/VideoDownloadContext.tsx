import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { saveVideoBlob, getVideoBlob, deleteVideoBlob } from './videoStorage';

export interface SavedVideoItem {
  id: string;
  name: string;
  url: string;
  sizeFormatted?: string;
  cachedInIndexedDb: boolean;
  createdAt: number;
}

interface VideoDownloadContextType {
  savedVideos: SavedVideoItem[];
  activeVideoId: string | null;
  activeVideoUrl: string | null;
  isDownloading: boolean;
  downloadProgress: number;
  downloadSpeed: string;
  downloadedSize: string;
  totalSize: string;
  currentDownloadingName: string;
  error: string | null;
  downloadAndSaveVideo: (url: string, name: string) => Promise<boolean>;
  selectSavedVideo: (id: string) => Promise<void>;
  removeSavedVideo: (id: string) => Promise<void>;
  cancelDownload: () => void;
  clearActiveVideo: () => void;
}

const STORAGE_SAVED_VIDEOS = 'archive_walls_saved_videos';
const STORAGE_ACTIVE_VIDEO_ID = 'archive_walls_active_video_id';

const VideoDownloadContext = createContext<VideoDownloadContextType | null>(null);

// formats raw bytes into human readable megabytes or gigabytes
function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 MB';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const mb = bytes / (k * k);
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(dm)} GB`;
  }
  return `${mb.toFixed(dm)} MB`;
}

// central context provider managing video downloads, streaming fallbacks, and indexeddb caching
export const VideoDownloadProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [savedVideos, setSavedVideos] = useState<SavedVideoItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_VIDEOS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  const [activeVideoId, setActiveVideoId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_ACTIVE_VIDEO_ID);
    } catch {}
    return null;
  });

  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState('');
  const [downloadedSize, setDownloadedSize] = useState('0 MB');
  const [totalSize, setTotalSize] = useState('0 MB');
  const [currentDownloadingName, setCurrentDownloadingName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // syncs saved video list to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_VIDEOS, JSON.stringify(savedVideos));
    } catch {}
  }, [savedVideos]);

  // syncs active video id to local storage
  useEffect(() => {
    try {
      if (activeVideoId) {
        localStorage.setItem(STORAGE_ACTIVE_VIDEO_ID, activeVideoId);
      } else {
        localStorage.removeItem(STORAGE_ACTIVE_VIDEO_ID);
      }
    } catch {}
  }, [activeVideoId]);

  // loads active video from indexeddb blob cache or streaming url on mount
  useEffect(() => {
    let isCancelled = false;

    async function loadActiveMedia() {
      if (!activeVideoId) {
        setActiveVideoUrl(null);
        return;
      }

      const found = savedVideos.find((v) => v.id === activeVideoId);
      if (!found) return;

      // attempt to load blob from indexeddb
      if (found.cachedInIndexedDb) {
        const blob = await getVideoBlob(found.id);
        if (blob && !isCancelled) {
          if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
          const objUrl = URL.createObjectURL(blob);
          objectUrlRef.current = objUrl;
          setActiveVideoUrl(objUrl);
          return;
        }
      }

      // fallback to streaming direct url
      if (!isCancelled) {
        setActiveVideoUrl(found.url);
      }
    }

    loadActiveMedia();

    return () => {
      isCancelled = true;
    };
  }, [activeVideoId, savedVideos]);

  // downloads video via byte stream with real-time percentage and saves blob to indexeddb
  const downloadAndSaveVideo = useCallback(
    async (url: string, name: string): Promise<boolean> => {
      const videoId = Math.random().toString(36).slice(2, 10);
      const videoName = name.trim() || 'Custom Video Wallpaper';

      setIsDownloading(true);
      setDownloadProgress(0);
      setError(null);
      setCurrentDownloadingName(videoName);
      setDownloadedSize('0 MB');
      setTotalSize('Calculating...');
      setDownloadSpeed('Connecting...');

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const contentLengthHeader = response.headers.get('content-length');
        const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
        if (totalBytes > 0) {
          setTotalSize(formatBytes(totalBytes));
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Unable to read video stream from server');
        }

        // collect stream chunks as blob parts for indexeddb binary storage
        const chunks: BlobPart[] = [];
        let receivedBytes = 0;
        let lastTime = Date.now();
        let lastLoaded = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (value) {
            chunks.push(value);
            receivedBytes += value.length;

            const now = Date.now();
            const timeDiff = (now - lastTime) / 1000;
            if (timeDiff >= 0.3) {
              const speedBytes = (receivedBytes - lastLoaded) / timeDiff;
              setDownloadSpeed(`${(speedBytes / (1024 * 1024)).toFixed(1)} MB/s`);
              lastTime = now;
              lastLoaded = receivedBytes;
            }

            setDownloadedSize(formatBytes(receivedBytes));

            if (totalBytes > 0) {
              const percent = Math.min(99, Math.round((receivedBytes / totalBytes) * 100));
              setDownloadProgress(percent);
            }
          }
        }

        // assemble final blob and persist in indexeddb
        const mimeType = response.headers.get('content-type') || 'video/mp4';
        const finalBlob = new Blob(chunks, { type: mimeType });
        await saveVideoBlob(videoId, finalBlob);

        const newSavedItem: SavedVideoItem = {
          id: videoId,
          name: videoName,
          url,
          sizeFormatted: formatBytes(finalBlob.size),
          cachedInIndexedDb: true,
          createdAt: Date.now(),
        };

        setSavedVideos((prev) => [newSavedItem, ...prev]);
        setActiveVideoId(videoId);
        setDownloadProgress(100);

        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        const objUrl = URL.createObjectURL(finalBlob);
        objectUrlRef.current = objUrl;
        setActiveVideoUrl(objUrl);

        setIsDownloading(false);
        return true;
      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') {
          setIsDownloading(false);
          return false;
        }

        // if cors blocks chunk reading fallback to saving metadata and direct streaming
        const fallbackItem: SavedVideoItem = {
          id: videoId,
          name: videoName,
          url,
          sizeFormatted: 'Streaming (CORS)',
          cachedInIndexedDb: false,
          createdAt: Date.now(),
        };

        setSavedVideos((prev) => [fallbackItem, ...prev]);
        setActiveVideoId(videoId);
        setActiveVideoUrl(url);
        setIsDownloading(false);
        return true;
      }
    },
    []
  );

  // activates a previously saved video
  const selectSavedVideo = useCallback(
    async (id: string) => {
      const target = savedVideos.find((v) => v.id === id);
      if (!target) return;

      setActiveVideoId(id);
      if (target.cachedInIndexedDb) {
        const blob = await getVideoBlob(id);
        if (blob) {
          if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
          const objUrl = URL.createObjectURL(blob);
          objectUrlRef.current = objUrl;
          setActiveVideoUrl(objUrl);
          return;
        }
      }
      setActiveVideoUrl(target.url);
    },
    [savedVideos]
  );

  // deletes a saved video from list and indexeddb
  const removeSavedVideo = useCallback(
    async (id: string) => {
      await deleteVideoBlob(id);
      setSavedVideos((prev) => prev.filter((v) => v.id !== id));
      if (activeVideoId === id) {
        setActiveVideoId(null);
        setActiveVideoUrl(null);
      }
    },
    [activeVideoId]
  );

  // cancels active download stream
  const cancelDownload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsDownloading(false);
    setError(null);
  }, []);

  // clears active video wallpaper
  const clearActiveVideo = useCallback(() => {
    setActiveVideoId(null);
    setActiveVideoUrl(null);
  }, []);

  return (
    <VideoDownloadContext.Provider
      value={{
        savedVideos,
        activeVideoId,
        activeVideoUrl,
        isDownloading,
        downloadProgress,
        downloadSpeed,
        downloadedSize,
        totalSize,
        currentDownloadingName,
        error,
        downloadAndSaveVideo,
        selectSavedVideo,
        removeSavedVideo,
        cancelDownload,
        clearActiveVideo,
      }}
    >
      {children}
    </VideoDownloadContext.Provider>
  );
};

// custom hook to access video download state across dashboard components
export function useVideoDownload(): VideoDownloadContextType {
  const context = useContext(VideoDownloadContext);
  if (!context) {
    throw new Error('useVideoDownload must be used within a VideoDownloadProvider');
  }
  return context;
}

export default VideoDownloadContext;
