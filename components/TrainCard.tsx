import React, { useRef, useEffect } from 'react';
import type { Trainset, Decision } from '../types';
import { FitnessStatus, JobCardStatus } from '../types';

interface TrainCardProps {
  train: Trainset;
  highlightedTrainId: number | null;
}

const getStatusColor = (status: FitnessStatus) => {
  switch (status) {
    case FitnessStatus.Valid: return 'text-status-green-text';
    case FitnessStatus.ExpiringSoon: return 'text-status-yellow-text';
    case FitnessStatus.Expired: return 'text-status-red-text';
    default: return 'text-gray-500';
  }
};

const MaintenanceProgressBar: React.FC<{ value: number; max: number; highIsBad?: boolean; title?: string }> = ({ value, max, highIsBad = false, title }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    
    let colorClass = 'bg-status-green';
    if (highIsBad) { // For things like "wear" or "low score"
        if (percentage > 80) colorClass = 'bg-status-red';
        else if (percentage > 60) colorClass = 'bg-status-yellow';
    } else { // For things like "efficiency" or "high score"
        if (percentage < 70) colorClass = 'bg-status-red';
        else if (percentage < 85) colorClass = 'bg-status-yellow';
    }

    const displayPercentage = Math.max(0, Math.min(percentage, 100));

    return (
        <div title={title}>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} 
                    style={{ width: `${displayPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                ></div>
            </div>
        </div>
    );
};

const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch (e) {
        return 'Invalid Date';
    }
};

const getDateColor = (dateString: string): string => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-status-red-text';
    if (diffDays <= 7) return 'text-status-red-text';
    if (diffDays <= 30) return 'text-status-yellow-text';
    return 'text-metro-text-body';
};

const TrainCard: React.FC<TrainCardProps> = ({ train, highlightedTrainId }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isHighlighted = highlightedTrainId === train.id;

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [isHighlighted]);

  const highlightClasses = isHighlighted 
    ? 'ring-2 ring-metro-blue ring-offset-2 ring-offset-metro-light-bg' 
    : 'border-metro-border hover:border-metro-blue hover:shadow-xl hover:-translate-y-1';

  const jobCardColor = {
    [JobCardStatus.Open]: 'bg-red-100 text-status-red-text',
    [JobCardStatus.Pending]: 'bg-yellow-100 text-status-yellow-text',
    [JobCardStatus.Closed]: 'bg-green-100 text-status-green-text',
  }

  const decisionColor: Record<Decision, string> = {
    'Revenue Service': 'bg-green-100 text-status-green-text',
    'Standby': 'bg-yellow-100 text-status-yellow-text',
    'Maintenance': 'bg-red-100 text-status-red-text',
  }
  const decisionText: Record<Decision, string> = {
    'Revenue Service': 'Service',
    'Standby': 'Standby',
    'Maintenance': 'Maintenance',
  }

  return (
    <div
      ref={cardRef}
      className={`bg-metro-panel rounded-lg p-4 shadow-lg border transition-all duration-300 flex flex-col ${highlightClasses}`}
      id={`train-card-${train.id}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-metro-text-heading">Train #{train.id}</h3>
        <div className="text-right flex flex-col items-end space-y-1">
             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${decisionColor[train.decision]}`}>
                {decisionText[train.decision]}
             </span>
             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${jobCardColor[train.jobCardStatus]}`}>
                Job Card: {train.jobCardStatus}
            </span>
             <p className={`mt-1 text-xs font-bold ${getStatusColor(train.fitnessCertificateStatus)}`}>
                Cert: {train.fitnessCertificateStatus}
             </p>
        </div>
      </div>
      
      {/* Health Score */}
      <div className="mb-4">
          <div className="flex justify-between items-center mb-1 text-sm">
              <p className="font-semibold text-metro-text-heading">Health Score</p>
              <p className="font-bold">{train.calculatedHealthScore}</p>
          </div>
          <MaintenanceProgressBar value={train.calculatedHealthScore} max={100} highIsBad={false} title={`Health Score: ${train.calculatedHealthScore}/100`} />
      </div>


      <div className="space-y-4 text-sm flex-grow">
        
        {/* Health & Scheduling */}
        <div>
          <p className="font-semibold text-metro-text-heading mb-1">Health & Scheduling</p>
          <div className="space-y-1 text-xs p-2 bg-gray-50 rounded-md">
             <div className="flex justify-between">
                <span className="text-gray-500">Cert. Expiry:</span> 
                <span className={`font-semibold ${getDateColor(train.fitnessCertificateExpiryDate)}`}>{formatDate(train.fitnessCertificateExpiryDate)}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-gray-500">Next Service Due:</span> 
                <span className={`font-semibold ${getDateColor(train.nextServiceDueDate)}`}>{formatDate(train.nextServiceDueDate)}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-gray-500">Brake Pad Wear:</span> 
                <span className="font-semibold">{train.brakePadWearPercent}%</span>
            </div>
             <div className="flex justify-between">
                <span className="text-gray-500">HVAC Efficiency:</span> 
                <span className="font-semibold">{train.hvacEfficiency}%</span>
            </div>
          </div>
        </div>

        {/* Operational Info */}
         <div>
            <p className="font-semibold text-metro-text-heading mb-1">Operational Status</p>
            <div className="space-y-1 text-xs p-2 bg-gray-50 rounded-md">
               <div className="flex justify-between"><span className="text-gray-500">Total Mileage:</span> <span className="font-semibold">{train.totalKmTravelled.toLocaleString()} km</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Avg. Monthly:</span> <span className="font-semibold">{train.monthlyKmAverage.toLocaleString()} km</span></div>
               <div className="flex justify-between"><span className="text-gray-500">Branding Hours:</span> <span className="font-semibold">{train.brandingHoursLeft} hrs</span></div>
               <div className="flex justify-between"><span className="text-gray-500">Stabling:</span> <span className="font-semibold">Bay {train.stablingPosition} ({train.stablingGeometry})</span></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TrainCard;