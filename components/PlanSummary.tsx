import React from 'react';
import type { Recommendation } from '../types';
import { ChartPieIcon } from './icons/Icons';

interface PlanSummaryProps {
    recommendation: Recommendation;
}

const PieChart: React.FC<{
    data: { name: string; value: number; color: string }[];
    total: number;
}> = ({ data, total }) => {
    const radius = 15.91549430918954;
    let cumulativePercent = 0;

    return (
        <div className="relative w-40 h-40">
            <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle cx="18" cy="18" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                {data.map(({ value, color }) => {
                    const percent = (value / total) * 100;
                    const offset = 25 - cumulativePercent;
                    cumulativePercent += percent;
                    if (percent === 0) return null;
                    return (
                        <circle
                            key={color}
                            cx="18"
                            cy="18"
                            r={radius}
                            fill="transparent"
                            stroke={color}
                            strokeWidth="4"
                            strokeDasharray={`${percent} ${100 - percent}`}
                            strokeDashoffset={offset}
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <span className="text-3xl font-bold text-metro-text-heading">{total}</span>
                 <span className="text-xs text-metro-text-body">Total</span>
            </div>
        </div>
    );
};

const PlanSummary: React.FC<PlanSummaryProps> = ({ recommendation }) => {
    const revenueCount = recommendation.revenueService.length;
    const standbyCount = recommendation.standby.length;
    const maintenanceCount = recommendation.maintenance.length;
    const totalTrains = revenueCount + standbyCount + maintenanceCount;

    if (totalTrains === 0) {
        return null; // Don't render if there's no data
    }
    
    const chartData = [
        { name: 'Revenue Service', value: revenueCount, color: '#10b981' },
        { name: 'Standby', value: standbyCount, color: '#f59e0b' },
        { name: 'Maintenance', value: maintenanceCount, color: '#ef4444' },
    ];

    return (
        <div className="bg-metro-panel p-4 rounded-lg shadow-lg border border-metro-border">
            <div className="flex items-center mb-4">
                 <ChartPieIcon className="w-6 h-6 text-metro-blue mr-3" />
                 <h3 className="text-xl font-bold text-metro-text-heading">Plan Overview</h3>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <PieChart data={chartData} total={totalTrains} />
                <div className="w-full sm:w-auto">
                    <ul className="space-y-2">
                        {chartData.map(({name, value, color}) => (
                            <li key={name} className="flex items-center justify-between sm:justify-start sm:gap-4 text-sm">
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                                    <span className="font-semibold text-metro-text-body">{name}</span>
                                </div>
                                <div className="text-right sm:text-left">
                                    <span className="font-bold text-metro-text-heading">{value} trains</span>
                                    <span className="text-gray-500 ml-2">({((value / totalTrains) * 100).toFixed(0)}%)</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PlanSummary;