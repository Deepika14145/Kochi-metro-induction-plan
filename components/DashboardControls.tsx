import React from 'react';
import { FitnessStatus, JobCardStatus } from '../types';
import { SearchIcon } from './icons/Icons';

interface DashboardControlsProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    fitnessFilter: 'All' | FitnessStatus;
    setFitnessFilter: (status: 'All' | FitnessStatus) => void;
    jobCardFilter: 'All' | JobCardStatus;
    setJobCardFilter: (status: 'All' | JobCardStatus) => void;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
    searchQuery,
    setSearchQuery,
    fitnessFilter,
    setFitnessFilter,
    jobCardFilter,
    setJobCardFilter,
}) => {
    return (
        <div className="bg-metro-panel p-4 rounded-lg shadow-md border border-metro-border flex flex-col sm:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by Train ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-metro-blue focus:border-metro-blue bg-white text-black"
                />
            </div>
            
            {/* Filter Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                 <div className="w-full sm:w-48">
                    <label htmlFor="fitness-filter" className="sr-only">Filter by Fitness</label>
                    <select
                        id="fitness-filter"
                        value={fitnessFilter}
                        onChange={(e) => setFitnessFilter(e.target.value as 'All' | FitnessStatus)}
                        className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-metro-blue focus:border-metro-blue"
                    >
                        <option value="All">All Fitness</option>
                        {Object.values(FitnessStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                <div className="w-full sm:w-48">
                     <label htmlFor="jobcard-filter" className="sr-only">Filter by Job Card</label>
                    <select
                        id="jobcard-filter"
                        value={jobCardFilter}
                        onChange={(e) => setJobCardFilter(e.target.value as 'All' | JobCardStatus)}
                        className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-metro-blue focus:border-metro-blue"
                    >
                        <option value="All">All Job Cards</option>
                         {Object.values(JobCardStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default DashboardControls;