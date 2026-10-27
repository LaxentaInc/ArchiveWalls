import React, { useState } from 'react';
import type { NotesData } from '../types';

interface NotesWidgetProps {
  data: Partial<NotesData>;
  onUpdate: (data: Partial<NotesData>) => void;
}

// vscode cool dark matte scratchpad notes widget providing instant local persistence
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
        className="w-full bg-[#1e1e1e] hover:bg-[#252526] focus:bg-[#252526] border border-[#333333] focus:border-[#007acc] rounded-lg p-3 text-xs text-[#cccccc] placeholder-[#666666] outline-none resize-none transition-colors leading-relaxed"
      />
      <div className="flex justify-between items-center text-[10px] text-[#858585] pt-1">
        <span>{content.length} characters</span>
        <span>Auto-saved</span>
      </div>
    </div>
  );
};

export default NotesWidget;
