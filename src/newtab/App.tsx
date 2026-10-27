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
  Plus,
  Compass,
} from 'lucide-react';

// authentic archivewalls new tab page architecture
export const App: React.FC = () => {
  const store = useWidgetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTargetCol, setModalTargetCol] = useState(0);

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
    <main className="relative w-screen min-h-screen flex flex-col justify-start overflow-x-hidden select-none bg-[#0c0d12]">
      {/* 3d rock sequence dynamic background */}
      <RockBackground />

      {/* archivewalls top navigation header */}
      <header className="relative z-30 w-full px-6 py-2.5 flex items-center justify-between text-xs text-white/70 bg-[#14171f] border-b border-[#252a36]">
        {/* left branding */}
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white/80">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-semibold text-white tracking-normal">
            ArchiveWalls
          </span>
        </div>

        {/* right actions */}
        <div className="flex items-center space-x-2.5 text-white/70">
          <button
            type="button"
            onClick={() => handleOpenAddWidget(0)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-md font-medium text-xs transition-colors"
            title="Add new widget"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Widget</span>
          </button>
        </div>
      </header>

      {/* calm web search bar */}
      <div className="relative z-30 w-full px-6 pt-5 pb-3 flex justify-center">
        <SearchBar />
      </div>

      {/* dynamic 4-column dashboard layout */}
      <section className="relative z-30 flex-1 w-full flex justify-center pb-12">
        <DashboardGrid
          store={store}
          onOpenAddWidget={handleOpenAddWidget}
        />
      </section>

      {/* 3-pane widget selector modal */}
      <WidgetSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWidget={handleAddWidget}
        totalColumns={store.state.columns || 4}
        defaultTargetColumn={modalTargetCol}
      />
    </main>
  );
};

export default App;
