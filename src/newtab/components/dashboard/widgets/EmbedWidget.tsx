import React, { useState } from 'react';
import { Settings, ExternalLink, Check, RotateCcw } from 'lucide-react';
import type { EmbedData } from '../types';

export const TRADINGVIEW_DEFAULT_URL =
  'https://s.tradingview.com/widgetembed/?frameElementId=tradingview_931a4&symbol=OANDA%3ASPX500USD&interval=5&hidesidetoolbar=0&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&hideideas=1&theme=White&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en';

interface EmbedWidgetProps {
  data: Partial<EmbedData>;
  onUpdate: (data: Partial<EmbedData>) => void;
}

// scalable embed widget rendering genuine tradingview financial charts or custom iframes
export const EmbedWidget: React.FC<EmbedWidgetProps> = ({ data, onUpdate }) => {
  const currentUrl = data.url || TRADINGVIEW_DEFAULT_URL;
  const currentHeight = data.height || 260;

  const [isEditing, setIsEditing] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [heightInput, setHeightInput] = useState(currentHeight);

  // saves user custom embed url or dimension adjustments
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      url: urlInput.trim() || TRADINGVIEW_DEFAULT_URL,
      height: Math.max(160, Math.min(600, heightInput)),
    });
    setIsEditing(false);
  };

  // resets back to default genuine tradingview live chart
  const handleResetToTradingView = () => {
    setUrlInput(TRADINGVIEW_DEFAULT_URL);
    setHeightInput(260);
    onUpdate({
      url: TRADINGVIEW_DEFAULT_URL,
      height: 260,
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col space-y-2 select-none">
      {/* action header for embed settings */}
      <div className="flex items-center justify-between text-[11px] text-white/40 pb-1">
        <span className="truncate max-w-[200px]">
          {currentUrl.includes('tradingview.com') ? 'TradingView S&P 500' : 'Web Embed'}
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 hover:text-white transition-colors"
            title="Configure embed URL"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:text-white transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* embed configuration form */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-black/30 border border-white/10 rounded-lg p-3 space-y-2.5 mb-2">
          <div>
            <label className="block text-[10px] text-white/50 mb-1">Embed URL / Iframe source</label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="w-full bg-black/50 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-white/30"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <label className="block text-[10px] text-white/50 mb-1">Height (px)</label>
              <input
                type="number"
                value={heightInput}
                onChange={(e) => setHeightInput(Number(e.target.value))}
                min={160}
                max={600}
                className="w-full bg-black/50 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-white/30"
              />
            </div>

            <div className="flex items-end space-x-1.5 pt-3">
              <button
                type="button"
                onClick={handleResetToTradingView}
                className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded text-xs transition-colors flex items-center space-x-1"
                title="Reset to TradingView"
              >
                <RotateCcw className="w-3 h-3" />
                <span>TradingView</span>
              </button>

              <button
                type="submit"
                className="px-3 py-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded text-xs font-medium transition-colors flex items-center space-x-1"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* responsive iframe embed container */}
      <div
        className="w-full rounded-lg overflow-hidden border border-white/10 bg-black/40"
        style={{ height: `${currentHeight}px` }}
      >
        <iframe
          src={currentUrl}
          title="Embed View"
          className="w-full h-full border-0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default EmbedWidget;
