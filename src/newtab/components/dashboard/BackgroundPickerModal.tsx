import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link,
  Check,
  Image as ImageIcon,
  Film,
  Sparkles,
  Trash2,
  Play,
} from 'lucide-react';
import {
  BACKGROUND_PRESETS,
  type BackgroundConfig,
} from './useBackgroundStore';
import { useVideoDownload } from './VideoDownloadContext';

interface BackgroundPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BackgroundConfig;
  onSelectPreset: (presetId: string) => void;
  onSetCustomImage: (dataUrl: string) => void;
}

// modal allowing user to switch backgrounds between curated presets, local uploads, or direct links
export const BackgroundPickerModal: React.FC<BackgroundPickerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSelectPreset,
  onSetCustomImage,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'saved' | 'upload' | 'url'>('presets');
  const [nameInput, setNameInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isUrlVideo, setIsUrlVideo] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    savedVideos,
    activeVideoId,
    downloadAndSaveVideo,
    selectSavedVideo,
    removeSavedVideo,
    clearActiveVideo,
  } = useVideoDownload();

  if (!isOpen) return null;

  // reads uploaded local image file as base64 data url for persistent local storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        clearActiveVideo();
        onSetCustomImage(reader.result);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  // initiates video download or sets image url with user-specified or auto-derived name
  const handleApplyUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const trimmedUrl = urlInput.trim();
    
    // auto-extract readable title from url filename if name input was left empty
    let trimmedName = nameInput.trim();
    if (!trimmedName) {
      try {
        const parsed = new URL(trimmedUrl);
        const filename = parsed.pathname.split('/').pop()?.split('.')[0];
        if (filename && filename.length > 1) {
          trimmedName = decodeURIComponent(filename)
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
        }
      } catch {}
      if (!trimmedName) trimmedName = 'Video Wallpaper';
    }

    if (isUrlVideo || trimmedUrl.endsWith('.mp4') || trimmedUrl.endsWith('.webm')) {
      onClose();
      await downloadAndSaveVideo(trimmedUrl, trimmedName);
    } else {
      clearActiveVideo();
      onSetCustomImage(trimmedUrl);
      onClose();
    }

    setUrlInput('');
    setNameInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 select-none">
      <div className="relative w-full max-w-2xl bg-[#181818] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl text-[#cccccc] flex flex-col">
        {/* header */}
        <div className="px-5 py-3.5 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-white/70" />
            <h2 className="text-sm font-semibold text-white">Customize Background</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#858585] hover:text-[#cccccc] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* tab navigation */}
        <div className="flex border-b border-[#262626] bg-[#141414] px-5 space-x-4 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-2.5 font-medium transition-colors border-b-2 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'presets'
                ? 'border-[#007acc] text-white'
                : 'border-transparent text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Presets</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`py-2.5 font-medium transition-colors border-b-2 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'saved'
                ? 'border-[#007acc] text-white'
                : 'border-transparent text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Saved Videos ({savedVideos.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-2.5 font-medium transition-colors border-b-2 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'upload'
                ? 'border-[#007acc] text-white'
                : 'border-transparent text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-2.5 font-medium transition-colors border-b-2 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'url'
                ? 'border-[#007acc] text-white'
                : 'border-transparent text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Link Video / Image</span>
          </button>
        </div>

        {/* tab content body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {/* curated presets */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BACKGROUND_PRESETS.map((preset) => {
                const isSelected =
                  !activeVideoId &&
                  ((config.type === 'preset' && config.presetId === preset.id) ||
                    (config.type === 'rock' && preset.type === 'rock'));

                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      clearActiveVideo();
                      onSelectPreset(preset.id);
                      onClose();
                    }}
                    className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-video flex flex-col justify-end p-2.5 ${
                      isSelected
                        ? 'border-[#007acc] ring-1 ring-[#007acc]'
                        : 'border-[#2d2d2d] hover:border-[#444444]'
                    }`}
                  >
                    <img
                      src={preset.thumbnail}
                      alt={preset.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white drop-shadow truncate mr-1">
                        {preset.title}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#007acc] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* saved video wallpapers library */}
          {activeTab === 'saved' && (
            <div className="space-y-2">
              {savedVideos.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#858585] border border-dashed border-[#2d2d2d] rounded-xl p-6">
                  No saved videos yet. Link an MP4 or WebM video under the &ldquo;Link Video / Image&rdquo; tab to download and save it here.
                </div>
              ) : (
                savedVideos.map((item) => {
                  const isActive = activeVideoId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        selectSavedVideo(item.id);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#007acc]/10 border-[#007acc]'
                          : 'bg-[#202020] border-[#2c2c2c] hover:bg-[#252526]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-[#38bdf8] shrink-0">
                          <Play className="w-4 h-4 fill-current" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-semibold text-white truncate">
                              {item.name}
                            </h4>
                            {isActive && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#007acc] text-white font-medium">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#858585] block truncate mt-0.5">
                            {item.sizeFormatted} &bull; {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSavedVideo(item.id);
                          }}
                          className="p-1.5 rounded-lg text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete saved video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* upload local image */}
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#333333] hover:border-[#007acc] rounded-xl p-8 transition-colors text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Choose an image from your computer
              </h3>
              <p className="text-xs text-[#858585] max-w-sm mb-4">
                Supports JPG, PNG, WEBP, or AVIF. Stored locally on your browser.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-medium rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse Files</span>
              </button>
            </div>
          )}

          {/* direct video or image link with name input and real-time download */}
          {activeTab === 'url' && (
            <form onSubmit={handleApplyUrl} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#cccccc] mb-1">
                  Wallpaper Title
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Cyberpunk Rain Skyline"
                  className="w-full bg-[#121212] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white placeholder-[#666666] outline-none focus:border-[#007acc]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#cccccc] mb-1">
                  Direct Video or Image URL
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://...mp4 (or image url)"
                  className="w-full bg-[#121212] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white placeholder-[#666666] outline-none focus:border-[#007acc]"
                />
                <p className="text-[10px] text-[#707070] mt-1.5 leading-relaxed">
                  Provide direct file links (e.g. .mp4, .webm, or image urls). Web page links like YouTube cannot be stored as raw video files.
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="is-video-checkbox"
                  checked={isUrlVideo}
                  onChange={(e) => setIsUrlVideo(e.target.checked)}
                  className="rounded bg-[#222222] border-[#333333] text-[#007acc] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="is-video-checkbox" className="text-xs text-[#858585] flex items-center space-x-1 cursor-pointer">
                  <Film className="w-3.5 h-3.5 text-[#007acc]" />
                  <span>Download and cache video locally for fast playback</span>
                </label>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#262626]">
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="px-4 py-2 bg-[#007acc] hover:bg-[#0062a3] disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  {isUrlVideo ? 'Download & Set Video' : 'Apply Wallpaper'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundPickerModal;
