import React, { useState } from 'react';
import { RockBackground } from './components/rock-sequence';
import {
  DashboardGrid,
  SearchBar,
  WidgetSelectorModal,
  useWidgetStore,
  type WidgetCatalogEntry,
} from './components/dashboard';
import { Plus } from 'lucide-react';

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
    <main className="relative w-screen min-h-screen flex flex-col justify-start overflow-x-hidden select-none bg-[#121212]">
      {/* 3d rock sequence dynamic background */}
      <RockBackground />

      {/* top right floating add widget trigger in vscode blue */}
      <div className="relative z-30 w-full px-6 pt-4 flex justify-end">
        <button
          type="button"
          onClick={() => handleOpenAddWidget(0)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white rounded font-medium text-xs transition-colors"
          title="Add new widget"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Widget</span>
        </button>
      </div>

      {/* calm web search bar */}
      <div className="relative z-30 w-full px-6 pt-2 pb-3 flex justify-center">
        <SearchBar />
      </div>

      {/* dynamic 4-column dashboard layout */}
      <section className="relative z-30 flex-1 w-full flex justify-center pb-16">
        <DashboardGrid
          store={store}
          onOpenAddWidget={handleOpenAddWidget}
        />
      </section>

      {/* subtle grayish archivewalls button anchored low on the bottom viewport in vscode dark */}
      <div className="fixed bottom-4 left-6 z-30">
        <button
          type="button"
          className="px-2.5 py-1 rounded bg-[#1e1e1e]/80 hover:bg-[#252526] border border-[#2d2d2d] text-[11px] text-[#858585] hover:text-[#cccccc] transition-colors"
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
    </main>
  );
};

export default App;
