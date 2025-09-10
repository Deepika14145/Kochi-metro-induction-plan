import React from 'react';
import type { Trainset } from '../types';
import TrainCard from './TrainCard';
import { SearchIcon } from './icons/Icons'; // Using an icon for visual aid

interface TrainDashboardProps {
  trains: Trainset[];
  highlightedTrainId: number | null;
}

const TrainDashboard: React.FC<TrainDashboardProps> = ({ trains, highlightedTrainId }) => {
  if (trains.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
        <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-metro-text-heading">No Trainsets Found Matching Your Criteria</h3>
        <p className="mt-2">Please try a different search query or adjust the filters.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-metro-text-heading sr-only">Fleet Status Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {trains.map(train => (
          <TrainCard key={train.id} train={train} highlightedTrainId={highlightedTrainId} />
        ))}
      </div>
    </div>
  );
};

export default TrainDashboard;