import React, { useState } from 'react';
import type { NotesData } from '../types';

interface NotesWidgetProps {
  data: Partial<NotesData>;
  onUpdate: (data: Partial<NotesData>) => void;
}

// clean notes widget providing instant scratchpad persistence
export const NotesWidget: React.FC<NotesWidgetProps> = ({ data, onUpdate }) => {
  const [content, setContent] = useState(data.content || '');

  // propagates note modifications to widget store
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextContent = e.target.value;
    setContent(nextContent);
    onUpdate({ content: nextContent });
  };

  return (
    <div className="w-full select-none">
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Type quick notes, ideas, or reminders here..."
        rows={5}
        className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 border border-white/10 focus:border-white/20 rounded-lg p-3 text-xs text-white/90 placeholder-white/25 outline-none resize-none transition-colors leading-relaxed"
      />
      <div className="flex justify-between items-center text-[10px] text-white/30 pt-1">
        <span>{content.length} characters</span>
        <span>Auto-saved</span>
      </div>
    </div>
  );
};

export default NotesWidget;
