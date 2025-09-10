import React from 'react';
import type { RecommendedTrain } from '../types';
import { InformationCircleIcon } from './icons/Icons';

interface ResultCardProps {
    train: RecommendedTrain;
    categoryColor: string;
    onSelect: (trainId: number) => void;
    isHighlighted: boolean;
}

const colorMap: Record<string, string> = {
    'border-status-green': 'border-l-status-green',
    'border-status-yellow': 'border-l-status-yellow',
    'border-status-red': 'border-l-status-red',
};

export const ResultCard: React.FC<ResultCardProps> = ({ train, categoryColor, onSelect, isHighlighted }) => {
    const trainIdNum = parseInt(train.trainId, 10);
    const borderClass = colorMap[categoryColor] || 'border-l-gray-400';

    const highlightClass = isHighlighted 
        ? 'bg-metro-blue/10 ring-2 ring-metro-blue' 
        : 'bg-white hover:bg-gray-50';

    return (
        <div
            onClick={() => onSelect(trainIdNum)}
            className={`p-2.5 rounded-md cursor-pointer transition-all duration-200 border-l-4 border ${borderClass} ${highlightClass} relative group`}
            role="button"
            aria-pressed={isHighlighted}
        >
            <div className="flex justify-between items-center">
                <p className="font-semibold text-metro-text-heading">Trainset #{train.trainId}</p>
                <InformationCircleIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>

            <p className="text-xs text-metro-text-body italic mt-1 pr-4">
                {train.reason}
            </p>

             {/* Tooltip content */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3
                           bg-gray-800 text-white text-xs rounded-lg shadow-lg 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300
                           pointer-events-none z-10"
                 role="tooltip">
                <h4 className="font-bold mb-1 border-b border-gray-600 pb-1">Detailed Reasoning</h4>
                <p>{train.detailedExplanation || 'No detailed explanation provided.'}</p>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
        </div>
    );
};

export const ResultCardSkeleton: React.FC = () => (
    <div className="p-2.5 rounded-md bg-white border border-metro-border h-[62px]">
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
    </div>
);