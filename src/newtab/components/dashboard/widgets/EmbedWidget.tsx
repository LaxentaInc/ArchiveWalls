import React, { useState, useEffect } from 'react';
import { Settings, ExternalLink, Check, RotateCcw, X } from 'lucide-react';
import type { EmbedData } from '../types';

// tradingview interactive live chart url strictly locked to light theme ignoring os prefers-color-scheme
export const TRADINGVIEW_DEFAULT_URL =
  'https://s.tradingview.com/widgetembed/?frameElementId=tradingview_931a4&symbol=OANDA%3ASPX500USD&interval=5&hidesidetoolbar=0&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&hideideas=1&theme=light&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%22paneProperties.background%22%3A%22%23ffffff%22%2C%22paneProperties.backgroundType%22%3A%22solid%22%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en';

// normalizes tradingview urls to force theme=light and override system dark mode
function ensureLightTheme(rawUrl: string): string {
  if (!rawUrl.includes('tradingview.com')) return rawUrl;
  let normalized = rawUrl
    .replace('theme=White', 'theme=light')
    .replace('theme=dark', 'theme=light');

  if (normalized.includes('overrides=%7B%7D')) {
    normalized = normalized.replace(
      'overrides=%7B%7D',
      'overrides=%7B%22paneProperties.background%22%3A%22%23ffffff%22%2C%22paneProperties.backgroundType%22%3A%22solid%22%7D'
    );
  }
  return normalized;
}

interface EmbedWidgetProps {
  data: Partial<EmbedData>;
  onUpdate: (data: Partial<EmbedData>) => void;
  height?: number;
}

// edge to edge light mode financial chart in dark matte chrome
export const EmbedWidget: React.FC<EmbedWidgetProps> = ({ data, onUpdate, height }) => {
  const currentUrl = ensureLightTheme(data.url || TRADINGVIEW_DEFAULT_URL);
  const currentHeight = height || data.height || 380;

  const [isEditing, setIsEditing] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl);

  // automatically upgrades stored local storage url to forced light theme
  useEffect(() => {
    if (data.url && (data.url.includes('theme=White') || data.url.includes('theme=dark') || data.url.includes('overrides=%7B%7D'))) {
      onUpdate({
        url: ensureLightTheme(data.url),
      });
    }
  }, [data.url, onUpdate]);

  // saves user custom embed url
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      url: ensureLightTheme(urlInput.trim() || TRADINGVIEW_DEFAULT_URL),
    });
    setIsEditing(false);
  };

  // resets back to default forced-light tradingview live chart
  const handleResetToTradingView = () => {
    setUrlInput(TRADINGVIEW_DEFAULT_URL);
    onUpdate({
      url: TRADINGVIEW_DEFAULT_URL,
    });
    setIsEditing(false);
  };

  return (
    <div className="relative w-full h-full select-none flex flex-col group/embed bg-[#ffffff]">
      {/* subtle floating quick actions visible on hover */}
      <div className="absolute top-2 right-2 z-20 flex items-center space-x-1 opacity-0 group-hover/embed:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 rounded bg-black/60 hover:bg-black/80 text-white/70 hover:text-white transition-colors"
          title="Configure URL"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded bg-black/60 hover:bg-black/80 text-white/70 hover:text-white transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* embed configuration popover overlay in vscode cool dark */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="absolute inset-x-2 top-2 z-30 bg-[#252526] border border-[#3c3c3c] rounded-lg p-3 space-y-2 shadow-2xl text-[#cccccc]"
        >
          <div className="flex items-center justify-between pb-1 border-b border-[#333333]">
            <span className="text-xs font-semibold text-[#cccccc]">Embed Settings</span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-[#858585] hover:text-[#cccccc]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <label className="block text-[10px] text-[#858585] mb-1">Iframe Source URL</label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2.5 py-1 text-xs text-[#cccccc] placeholder-[#666666] outline-none focus:border-[#007acc]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleResetToTradingView}
              className="px-2 py-1 bg-[#1e1e1e] hover:bg-[#2d2d2d] text-[#858585] hover:text-[#cccccc] border border-[#333333] rounded text-[11px] transition-colors flex items-center space-x-1"
              title="Reset to TradingView S&P 500"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset TradingView</span>
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-xs font-medium transition-colors flex items-center space-x-1"
            >
              <Check className="w-3 h-3" />
              <span>Save</span>
            </button>
          </div>
        </form>
      )}

      {/* edge-to-edge forced pure white iframe container */}
      <div
        className="w-full h-full rounded-b-xl overflow-hidden bg-[#ffffff]"
        style={{ height: `${currentHeight}px` }}
      >
        <iframe
          src={currentUrl}
          title="Market Chart"
          className="w-full h-full border-0 block bg-white"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default EmbedWidget;
