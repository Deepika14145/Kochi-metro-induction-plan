import React, { useState } from 'react';
import type { Recommendation, RecommendedTrain } from '../types';
import { ResultCard, ResultCardSkeleton } from './ResultCard';
import { ClipboardListIcon } from './icons/Icons';
import PlanSummary from './PlanSummary';

interface InteractiveResultsPanelProps {
  recommendation: Recommendation | null;
  isLoading: boolean;
  error: string | null;
  onTrainSelect: (trainId: number) => void;
  highlightedTrainId: number | null;
}

type ResultTab = 'revenueService' | 'standby' | 'maintenance';

const tabConfig: {
    id: ResultTab;
    title: string;
    color: string;
    activeClasses: string;
}[] = [
    { id: 'revenueService', title: 'Revenue Service', color: 'border-status-green', activeClasses: 'border-status-green text-status-green-text' },
    { id: 'standby', title: 'Standby', color: 'border-status-yellow', activeClasses: 'border-status-yellow text-status-yellow-text' },
    { id: 'maintenance', title: 'Maintenance', color: 'border-status-red', activeClasses: 'border-status-red text-status-red-text' },
];

const LoadingState: React.FC = () => (
    <div className="bg-metro-panel p-4 rounded-lg shadow-lg border border-metro-border">
        <div className="flex space-x-4 border-b border-gray-200 mb-4">
            <div className="h-8 w-32 rounded bg-gray-200 animate-pulse"></div>
            <div className="h-8 w-24 rounded bg-gray-200 animate-pulse"></div>
            <div className="h-8 w-28 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => <ResultCardSkeleton key={i} />)}
        </div>
    </div>
);

const InteractiveResultsPanel: React.FC<InteractiveResultsPanelProps> = ({ recommendation, isLoading, error, onTrainSelect, highlightedTrainId }) => {
  const [activeTab, setActiveTab] = useState<ResultTab>('revenueService');

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (error) {
      return <p role="alert" className="text-status-red-text text-sm bg-red-100 p-3 rounded-md">{error}</p>;
    }
    if (recommendation) {
      const activeTabData = recommendation[activeTab];
      return (
        <div className="space-y-6">
          <PlanSummary recommendation={recommendation} />
          <div className="bg-metro-panel p-4 rounded-lg shadow-lg border border-metro-border">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6" aria-label="Results Tabs">
                {tabConfig.map(tab => {
                    const count = recommendation[tab.id].length;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-3 px-1 border-b-4 font-semibold text-sm transition-colors duration-200 ${
                                activeTab === tab.id
                                ? tab.activeClasses
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.title}
                            <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-current text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {count}
                            </span>
                        </button>
                    )
                })}
              </nav>
            </div>
            <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
                {activeTabData.length > 0 ? (
                    activeTabData.map(train => (
                        <ResultCard
                            key={train.trainId}
                            train={train}
                            categoryColor={tabConfig.find(t => t.id === activeTab)?.color || ''}
                            onSelect={onTrainSelect}
                            isHighlighted={highlightedTrainId === parseInt(train.trainId, 10)}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500 italic px-2 pt-2">No trains assigned to this category.</p>
                )}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="text-center text-gray-400 p-6 border-2 border-dashed border-gray-300 rounded-lg h-full flex flex-col items-center justify-center min-h-[40vh]">
          <ClipboardListIcon className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-metro-text-heading">Awaiting Induction Plan</h3>
          <p>Generate a plan from the Configuration tab to see the results.</p>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-metro-text-heading sr-only">AI Induction Plan</h2>
      {renderContent()}
    </div>
  );
};

export default InteractiveResultsPanel;