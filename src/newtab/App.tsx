import React, { useState } from 'react';
import { RockBackground } from './components/rock-sequence';
import {
  DashboardGrid,
  SearchBar,
  WidgetSelectorModal,
  useWidgetStore,
  type WidgetCatalogEntry,
} from './components/dashboard';
import {
  useBackgroundStore,
  BACKGROUND_PRESETS,
} from './components/dashboard/useBackgroundStore';
import { BackgroundPickerModal } from './components/dashboard/BackgroundPickerModal';
import {
  VideoDownloadProvider,
  useVideoDownload,
} from './components/dashboard/VideoDownloadContext';
import { VideoDownloadHUD } from './components/dashboard/VideoDownloadHUD';
import { Plus, Image as ImageIcon } from 'lucide-react';

// dynamic background view rendering either indexeddb cached video, nature preset, 3d rocks, or custom upload
const BackgroundView: React.FC = () => {
  const bgStore = useBackgroundStore();
  const { activeVideoUrl } = useVideoDownload();

  // prioritized active video wallpaper from indexeddb or direct stream
  if (activeVideoUrl) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
        <video
          key={activeVideoUrl}
          src={activeVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
    );
  }

  if (bgStore.config.type === 'rock') {
    return <RockBackground />;
  }

  if (bgStore.config.type === 'custom_image' && bgStore.config.customUrl) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
        <img
          src={bgStore.config.customUrl}
          alt="Custom Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>
    );
  }

  const preset =
    BACKGROUND_PRESETS.find((p) => p.id === bgStore.config.presetId) ||
    BACKGROUND_PRESETS[0];

  if (preset.type === 'video' && preset.url) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
        <video
          src={preset.url}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
    );
  }

  if (preset.type === 'image' && preset.url) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
        <img
          src={preset.url}
          alt={preset.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }

  return <div className="fixed inset-0 bg-[#121212] z-0" />;
};

// primary dashboard workspace containing navigation, widget grid, search, and wallpaper picker
const DashboardMain: React.FC = () => {
  const store = useWidgetStore();
  const bgStore = useBackgroundStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTargetCol, setModalTargetCol] = useState(0);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);

  // opens the widget catalog modal targeting a specific column
  const handleOpenAddWidget = (targetColumn = 0) => {
    setModalTargetCol(targetColumn);
    setIsModalOpen(true);
  };

  // handles commit from the widget selector modal into the persistent store
  const handleAddWidget = (entry: WidgetCatalogEntry, column: number) => {
    store.addWidget({
      type: entry.type,
      title: entry.defaultTitle,
      column,
      data: entry.defaultData,
    });
  };

  return (
    <main className="relative w-screen min-h-screen flex flex-col justify-start overflow-x-hidden select-none bg-[#121212]">
      {/* dynamic background rendering layer */}
      <BackgroundView />

      {/* live video download hud notification */}
      <VideoDownloadHUD />

      {/* top right utility actions: change background and 2x translucent add widget trigger */}
      <div className="relative z-30 w-full px-6 pt-4 flex justify-end items-center space-x-2.5">
        {/* translucent change background button */}
        <button
          type="button"
          onClick={() => setIsBgModalOpen(true)}
          className="w-11 h-11 rounded-xl bg-black/40 hover:bg-black/60 active:bg-black/70 border border-white/10 text-white/80 hover:text-white backdrop-blur-md flex items-center justify-center transition-all shadow-md focus:outline-none cursor-pointer"
          title="Change Background"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* 2x bigger translucent add widget button without text and not blue matching screenshot */}
        <button
          type="button"
          onClick={() => handleOpenAddWidget(0)}
          className="w-11 h-11 rounded-xl bg-black/40 hover:bg-black/60 active:bg-black/70 border border-white/10 text-white/80 hover:text-white backdrop-blur-md flex items-center justify-center transition-all shadow-md focus:outline-none cursor-pointer"
          title="Add Widget"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* calm web search bar matching screenshot 1 */}
      <div className="relative z-30 w-full px-6 pt-2 pb-3 flex justify-center">
        <SearchBar />
      </div>

      {/* dynamic unified 4-column dashboard layout */}
      <section className="relative z-30 flex-1 w-full flex justify-center pb-16">
        <DashboardGrid
          store={store}
          onOpenAddWidget={handleOpenAddWidget}
        />
      </section>

      {/* subtle grayish archivewalls button anchored low on the bottom viewport */}
      <div className="fixed bottom-4 left-6 z-30">
        <button
          type="button"
          className="px-2.5 py-1 rounded bg-[#181818]/80 hover:bg-[#222222] border border-[#2a2a2a] text-[11px] text-[#858585] hover:text-[#cccccc] transition-colors cursor-pointer"
        >
          ArchiveWalls
        </button>
      </div>

      {/* 3-pane widget selector modal */}
      <WidgetSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWidget={handleAddWidget}
        totalColumns={store.state.columns || 4}
        defaultTargetColumn={modalTargetCol}
      />

      {/* background picker & custom upload modal */}
      <BackgroundPickerModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        config={bgStore.config}
        onSelectPreset={bgStore.selectPreset}
        onSetCustomImage={bgStore.setCustomImage}
      />
    </main>
  );
};

// root app container wrapping dashboard with video download provider
export const App: React.FC = () => {
  return (
    <VideoDownloadProvider>
      <DashboardMain />
    </VideoDownloadProvider>
  );
};

export default App;
