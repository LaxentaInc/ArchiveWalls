import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, ArrowDown, AlertCircle } from 'lucide-react';
import { useVideoDownload } from './VideoDownloadContext';

// cyber matte floating download hud displaying real-time video buffering, byte progress, and error alerts
export const VideoDownloadHUD: React.FC = () => {
  const {
    isDownloading,
    downloadProgress,
    downloadSpeed,
    downloadedSize,
    totalSize,
    currentDownloadingName,
    error,
    cancelDownload,
    clearError,
  } = useVideoDownload();

  return (
    <AnimatePresence>
      {isDownloading && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-5 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] rounded-2xl bg-[#141416]/95 border border-[#007acc]/50 shadow-[0_10px_35px_rgba(0,122,204,0.25)] backdrop-blur-xl p-4 text-[#cccccc] select-none"
        >
          {/* header row with glowing icon, title, and cancel trigger */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-lg bg-[#007acc]/20 border border-[#007acc]/40 flex items-center justify-center text-[#007acc] shrink-0">
                <Download className="w-4 h-4 animate-bounce" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007acc] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007acc]" />
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold tracking-widest text-[#007acc] uppercase block">
                  Downloading Wallpaper
                </span>
                <h4 className="text-xs font-semibold text-white truncate max-w-[210px]">
                  {currentDownloadingName || 'Video Wallpaper'}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={cancelDownload}
              className="p-1 rounded-md text-[#858585] hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Cancel download"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* progress bar with glowing cyan blue gradient */}
          <div className="w-full h-2 rounded-full bg-[#202022] overflow-hidden mb-2.5 relative border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${downloadProgress}%` }}
              transition={{ ease: 'linear', duration: 0.15 }}
              className="h-full bg-gradient-to-r from-[#007acc] to-[#38bdf8] rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>

          {/* live byte metrics and speed counters */}
          <div className="flex items-center justify-between text-[11px] text-[#858585]">
            <div className="flex items-center space-x-1.5 text-white/90 font-medium">
              <ArrowDown className="w-3 h-3 text-[#38bdf8]" />
              <span>
                {downloadedSize} <span className="text-[#666666]">/ {totalSize}</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {downloadSpeed && (
                <span className="text-[10px] text-[#858585] font-mono">
                  {downloadSpeed}
                </span>
              )}
              <span className="px-1.5 py-0.5 rounded bg-[#007acc]/20 text-[#38bdf8] font-mono text-[10px] font-bold">
                {downloadProgress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* error notification card when video download fails */}
      {error && !isDownloading && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-5 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] rounded-2xl bg-[#141416]/95 border border-red-500/40 shadow-[0_10px_35px_rgba(239,68,68,0.2)] backdrop-blur-xl p-4 text-[#cccccc] select-none"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase block">
                  Download Failed
                </span>
                <h4 className="text-xs font-semibold text-white truncate max-w-[210px]">
                  {error}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={clearError}
              className="p-1 rounded-md text-[#858585] hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-[#858585] mt-1">
            Ensure you provided a direct video link (.mp4 or .webm) that is publicly accessible.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoDownloadHUD;
