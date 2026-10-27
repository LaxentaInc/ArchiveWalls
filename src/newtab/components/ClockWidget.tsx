import React, { useState, useEffect } from 'react';
import type { ClockFormat } from '@/shared/types';

interface ClockWidgetProps {
  format?: ClockFormat;
}

// minimal test clock widget inspired by modern trading dashboards
export const ClockWidget: React.FC<ClockWidgetProps> = ({ format = '12h' }) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeString = (): { timeStr: string; period?: string } => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    let period: string | undefined = undefined;

    if (format === '12h') {
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
    }

    const hoursStr = hours.toString().padStart(2, '0');
    return {
      timeStr: `${hoursStr}:${minutes}`,
      period,
    };
  };

  const formatDateString = (): string => {
    return time.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGreeting = (): string => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const { timeStr, period } = formatTimeString();

  return (
    <div className="flex flex-col items-center justify-center text-center select-none">
      <span className="text-xs uppercase tracking-[0.3em] text-white/50 mb-2 font-medium">
        {getGreeting()}
      </span>

      <div className="flex items-baseline font-outfit font-[100] text-7xl md:text-9xl text-white tracking-[-0.04em] drop-shadow-sm leading-none">
        <span>{timeStr}</span>
        {period && (
          <span className="text-xl md:text-2xl font-light text-white/40 ml-3 tracking-normal">
            {period}
          </span>
        )}
      </div>

      <div className="mt-4 text-sm md:text-base font-light text-white/70 tracking-wide">
        {formatDateString()}
      </div>
    </div>
  );
};

export default ClockWidget;
