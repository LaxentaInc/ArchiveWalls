import React, { useState, useEffect } from 'react';
import type { ClockData } from '../types';

interface ClockWidgetProps {
  data: Partial<ClockData>;
  onUpdate: (data: Partial<ClockData>) => void;
}

// clean digital clock widget with customizable 12/24 hour display
export const ClockWidget: React.FC<ClockWidgetProps> = ({ data, onUpdate }) => {
  const is24Hour = data.format === '24h';
  const showSeconds = data.showSeconds ?? false;

  const [time, setTime] = useState(new Date());

  // updates clock state every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFormat = () => {
    onUpdate({
      format: is24Hour ? '12h' : '24h',
      showSeconds,
    });
  };

  const toggleSeconds = () => {
    onUpdate({
      format: is24Hour ? '24h' : '12h',
      showSeconds: !showSeconds,
    });
  };

  // formats current time string according to preferences
  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: !is24Hour,
  });

  const formattedDate = time.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 select-none text-center">
      <div
        onClick={toggleFormat}
        className="text-4xl font-light tracking-tight text-white cursor-pointer hover:text-blue-300 transition-colors"
        title="Click to toggle 12h / 24h format"
      >
        {formattedTime}
      </div>

      <div className="text-xs text-white/50 mt-1 font-normal tracking-wide">
        {formattedDate}
      </div>

      <div className="flex items-center space-x-3 text-[10px] text-white/30 mt-3 pt-2 border-t border-white/5">
        <button
          type="button"
          onClick={toggleFormat}
          className="hover:text-white transition-colors"
        >
          {is24Hour ? '24h' : '12h'}
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={toggleSeconds}
          className="hover:text-white transition-colors"
        >
          {showSeconds ? 'Hide Seconds' : 'Show Seconds'}
        </button>
      </div>
    </div>
  );
};

export default ClockWidget;
