import React, { useRef, ChangeEvent } from 'react';
import { generateAllMockData } from '../data/mockData';
import { convertTrainsetsToCSV } from '../utils/csvConverter';


interface ControlPanelProps {
  onGenerate: () => void;
  onRegenerateData: () => void;
  onEditRules: () => void;
  onUpload: (file: File) => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onGenerate,
  onRegenerateData,
  onEditRules,
  onUpload,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    // Reset file input to allow re-uploading the same file
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const header = [
        'Trainset_ID', 'Fitness_Certificate_Status', 'Job_Card_Status', 'Branding_Hours_Left', 
        'Mileage_Today_km', 'Cleaning_Slot_Available', 'Stabling_Position', 'Total_Km_Travelled', 
        'Metro_Age_Years', 'Planned_Km_Tomorrow', 'Stabling_Geometry', 'IBL_Availability', 
        'Energy_Consumption_Index', 'Brake_Pad_Wear_Percent', 'HVAC_Efficiency', 'Telecom_Clearance',
        // New Headers
        'Fitness_Certificate_Expiry_Date', 'Next_Service_Due_Date', 'Wheel_Gauge_Verification_Date',
        'Last_Service_Date', 'Monthly_Km_Average', 'Calculated_Health_Score', 'Decision'
    ].join(',');
    
    const today = new Date();
    const futureDate = (days: number) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const pastDate = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const exampleRow = [
        'Train_101', 'Valid', 'Closed', '50', '350', 'Yes', '8', '150234', '4', 
        '300', 'Optimal', 'Available', '1.05', '35', '91.5', 'Yes',
        // New Example Data
        futureDate(120), futureDate(45), pastDate(90), pastDate(15), '12500', '88', 'Service'
    ].join(',');
    const content = `${header}\n${exampleRow}`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
        URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'trainset_template_v3.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadFullData = () => {
    const fullData = generateAllMockData();
    const csvContent = convertTrainsetsToCSV(fullData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'kochi_metro_full_fleet_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="bg-metro-panel p-4 rounded-lg shadow-lg border border-metro-border">
      <h2 className="text-xl font-bold mb-4 text-metro-text-heading">Controls</h2>
      <div className="space-y-3">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full bg-metro-orange text-white font-bold py-3 px-4 rounded-lg hover:bg-metro-orange-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
          )}
          {isLoading ? 'Generating...' : 'Generate Induction Plan'}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleUploadClick}
            className="w-full bg-gray-100 text-metro-text-body font-bold py-2 px-4 rounded-lg hover:bg-gray-200 border border-metro-border transition duration-300 text-sm"
          >
            Upload CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
            aria-hidden="true"
          />
           <button
            onClick={downloadTemplate}
            className="w-full bg-gray-100 text-metro-text-body font-bold py-2 px-4 rounded-lg hover:bg-gray-200 border border-metro-border transition duration-300 text-sm"
          >
            Download Template
          </button>
        </div>
        <button
          onClick={onRegenerateData}
          className="w-full bg-gray-100 text-metro-text-body font-bold py-2 px-4 rounded-lg hover:bg-gray-200 border border-metro-border transition duration-300 text-sm"
        >
          Regenerate Mock Data
        </button>
        <button
          onClick={handleDownloadFullData}
          className="w-full bg-gray-100 text-metro-text-body font-bold py-2 px-4 rounded-lg hover:bg-gray-200 border border-metro-border transition duration-300 text-sm"
        >
          Download Full Fleet Data (CSV)
        </button>
        <button
          onClick={onEditRules}
          className="w-full bg-gray-100 text-metro-text-body font-bold py-2 px-4 rounded-lg hover:bg-gray-200 border border-metro-border transition duration-300 text-sm"
        >
          Edit Rules & Priorities
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;