import React from 'react';
import type { WidgetConfig } from './types';
import { WidgetWrapper } from './WidgetWrapper';
import { BookmarksWidget } from './widgets/BookmarksWidget';
import { EmbedWidget } from './widgets/EmbedWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { NotesWidget } from './widgets/NotesWidget';
import { ClockWidget } from './widgets/ClockWidget';

interface WidgetRendererProps {
  widget: WidgetConfig;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateColSpan?: (id: string, colSpan: number) => void;
  onStartDrag?: (e: React.PointerEvent<HTMLDivElement>, widget: WidgetConfig, el: HTMLElement) => void;
  isDraggingThis?: boolean;
}

// polymorphic widget renderer mapping widget type enum to concrete widget components
export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onRemove,
  onUpdate,
  onUpdateTitle,
  onUpdateColSpan,
  onStartDrag,
  isDraggingThis = false,
}) => {
  // renders concrete widget body based on widget.type
  const renderBody = () => {
    switch (widget.type) {
      case 'bookmarks':
        return (
          <BookmarksWidget
            data={widget.data}
            onUpdate={(data) => onUpdate(widget.id, data)}
          />
        );
      case 'embed':
        return (
          <EmbedWidget
            data={widget.data}
            onUpdate={(data) => onUpdate(widget.id, data)}
            height={widget.height}
          />
        );
      case 'weather':
        return (
          <WeatherWidget
            data={widget.data}
            onUpdate={(data) => onUpdate(widget.id, data)}
          />
        );
      case 'notes':
        return (
          <NotesWidget
            data={widget.data}
            onUpdate={(data) => onUpdate(widget.id, data)}
          />
        );
      case 'clock':
        return (
          <ClockWidget
            data={widget.data}
            onUpdate={(data) => onUpdate(widget.id, data)}
          />
        );
      default:
        return (
          <div className="text-xs text-gray-500 p-3">
            Unknown widget type: {widget.type}
          </div>
        );
    }
  };

  return (
    <WidgetWrapper
      widget={widget}
      onRemove={onRemove}
      onUpdateTitle={onUpdateTitle}
      onUpdateColSpan={onUpdateColSpan}
      onStartDrag={onStartDrag}
      isDraggingThis={isDraggingThis}
    >
      {renderBody()}
    </WidgetWrapper>
  );
};

export default WidgetRenderer;
