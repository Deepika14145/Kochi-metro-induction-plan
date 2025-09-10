import React, { useState, useCallback } from 'react';
import type { PriorityWeights } from '../types';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rules: string, weights: PriorityWeights) => void;
  initialRules: string;
  initialWeights: PriorityWeights;
}

const WeightSlider: React.FC<{ label: string; value: number; onChange: (value: number) => void; }> = ({ label, value, onChange }) => {
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-metro-text-body flex justify-between">
                <span>{label}</span>
                <span className="font-bold text-metro-blue">{value}</span>
            </label>
            <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
            />
        </div>
    )
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, onSave, initialRules, initialWeights }) => {
  const [rules, setRules] = useState(initialRules);
  const [weights, setWeights] = useState(initialWeights);

  const handleSave = useCallback(() => {
    onSave(rules, weights);
    onClose();
  }, [onSave, onClose, rules, weights]);

  const handleWeightChange = (key: keyof PriorityWeights, value: number) => {
    setWeights(prev => ({...prev, [key]: value}))
  }

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-modal-title"
    >
      <div 
        className="bg-metro-panel rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 text-metro-text-body border border-metro-border"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="rules-modal-title" className="text-2xl font-bold text-metro-text-heading mb-4">Edit Decision Rules & Priorities</h2>
        
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-metro-blue mb-2">Priority Weights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4 bg-metro-light-bg rounded-md border border-metro-border">
                   <WeightSlider label="Fitness Certificate" value={weights.fitnessCertificate} onChange={v => handleWeightChange('fitnessCertificate', v)} />
                   <WeightSlider label="Job Card" value={weights.jobCard} onChange={v => handleWeightChange('jobCard', v)} />
                   <WeightSlider label="Maintenance Factors" value={weights.maintenanceFactors} onChange={v => handleWeightChange('maintenanceFactors', v)} />
                   <WeightSlider label="Branding" value={weights.branding} onChange={v => handleWeightChange('branding', v)} />
                   <WeightSlider label="Mileage" value={weights.mileage} onChange={v => handleWeightChange('mileage', v)} />
                   <WeightSlider label="Cleaning" value={weights.cleaning} onChange={v => handleWeightChange('cleaning', v)} />
                </div>
            </div>
            <div>
                 <label htmlFor="rules-textarea" className="block mb-2 text-lg font-semibold text-metro-blue">Decision Criteria</label>
                 <textarea
                    id="rules-textarea"
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    rows={10}
                    className="w-full p-2 bg-white border border-metro-border rounded-md focus:ring-2 focus:ring-metro-blue focus:outline-none"
                 />
            </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-metro-text-body font-bold rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2 bg-metro-blue text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
