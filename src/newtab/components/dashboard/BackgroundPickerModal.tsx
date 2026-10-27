import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link,
  Check,
  Image as ImageIcon,
  Film,
  Sparkles,
} from 'lucide-react';
import {
  BACKGROUND_PRESETS,
  type BackgroundConfig,
} from './useBackgroundStore';

interface BackgroundPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BackgroundConfig;
  onSelectPreset: (presetId: string) => void;
  onSetCustomImage: (dataUrl: string) => void;
  onSetCustomVideo: (videoUrl: string) => void;
}

// modal allowing user to switch backgrounds between curated presets, local uploads, or direct links
export const BackgroundPickerModal: React.FC<BackgroundPickerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSelectPreset,
  onSetCustomImage,
  onSetCustomVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [urlInput, setUrlInput] = useState('');
  const [isUrlVideo, setIsUrlVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // reads uploaded local image file as base64 data url for persistent local storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSetCustomImage(reader.result);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  // applies custom direct link to image or video
  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (isUrlVideo || urlInput.endsWith('.mp4') || urlInput.endsWith('.webm')) {
      onSetCustomVideo(urlInput.trim());
    } else {
      onSetCustomImage(urlInput.trim());
    }
    setUrlInput('');
    onClose();
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
            className="p-1 text-[#858585] hover:text-[#cccccc] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* tab navigation */}
        <div className="flex border-b border-[#262626] bg-[#141414] px-5 space-x-4 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-2.5 font-medium transition-colors border-b-2 flex items-center space-x-1.5 ${
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
            onClick={() => setActiveTab('upload')}
            className={`py-2.5 font-medium transition-colors border-b-2 flex items-center space-x-1.5 ${
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
            className={`py-2.5 font-medium transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'url'
                ? 'border-[#007acc] text-white'
                : 'border-transparent text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Direct Link</span>
          </button>
        </div>

        {/* tab content body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BACKGROUND_PRESETS.map((preset) => {
                const isSelected =
                  (config.type === 'preset' && config.presetId === preset.id) ||
                  (config.type === 'rock' && preset.type === 'rock');

                return (
                  <div
                    key={preset.id}
                    onClick={() => {
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
                className="px-4 py-2 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-medium rounded-lg transition-colors flex items-center space-x-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse Files</span>
              </button>
            </div>
          )}

          {activeTab === 'url' && (
            <form onSubmit={handleApplyUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#cccccc] mb-1.5">
                  Direct Image or Video URL
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/wallpaper.jpg (or .mp4)"
                  autoFocus
                  className="w-full bg-[#121212] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white placeholder-[#666666] outline-none focus:border-[#007acc]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-video-checkbox"
                  checked={isUrlVideo}
                  onChange={(e) => setIsUrlVideo(e.target.checked)}
                  className="rounded bg-[#222222] border-[#333333] text-[#007acc] focus:ring-0"
                />
                <label htmlFor="is-video-checkbox" className="text-xs text-[#858585] flex items-center space-x-1 cursor-pointer">
                  <Film className="w-3.5 h-3.5" />
                  <span>This is a direct video link (.mp4 / .webm)</span>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="px-4 py-2 bg-[#007acc] hover:bg-[#0062a3] disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Apply Wallpaper
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
