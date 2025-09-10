import type { Trainset, StablingGeometry, IBLAvailability, Decision } from '../types';
import { FitnessStatus, JobCardStatus } from '../types';

const requiredHeaders = [
    'Trainset_ID', 'Fitness_Certificate_Status', 'Job_Card_Status',
    'Branding_Hours_Left', 'Mileage_Today_km', 'Cleaning_Slot_Available',
    'Stabling_Position', 'Total_Km_Travelled', 'Metro_Age_Years',
    'Planned_Km_Tomorrow', 'Stabling_Geometry', 'IBL_Availability',
    'Energy_Consumption_Index', 'Brake_Pad_Wear_Percent', 'HVAC_Efficiency',
    'Telecom_Clearance', 'Fitness_Certificate_Expiry_Date', 'Next_Service_Due_Date',
    'Wheel_Gauge_Verification_Date', 'Last_Service_Date', 'Monthly_Km_Average',
    'Calculated_Health_Score', 'Decision'
];

const headerMapping: { [key: string]: keyof Trainset } = {
    'Trainset_ID': 'id',
    'Fitness_Certificate_Status': 'fitnessCertificateStatus',
    'Job_Card_Status': 'jobCardStatus',
    'Branding_Hours_Left': 'brandingHoursLeft',
    'Mileage_Today_km': 'mileageTodayKm',
    'Cleaning_Slot_Available': 'cleaningSlotAvailable',
    'Stabling_Position': 'stablingPosition',
    'Total_Km_Travelled': 'totalKmTravelled',
    'Metro_Age_Years': 'metroAgeYears',
    'Planned_Km_Tomorrow': 'plannedKmTomorrow',
    'Stabling_Geometry': 'stablingGeometry',
    'IBL_Availability': 'iblAvailability',
    'Energy_Consumption_Index': 'energyConsumptionIndex',
    'Brake_Pad_Wear_Percent': 'brakePadWearPercent',
    'HVAC_Efficiency': 'hvacEfficiency',
    'Telecom_Clearance': 'telecomClearance',
    'Fitness_Certificate_Expiry_Date': 'fitnessCertificateExpiryDate',
    'Next_Service_Due_Date': 'nextServiceDueDate',
    'Wheel_Gauge_Verification_Date': 'wheelGaugeVerificationDate',
    'Last_Service_Date': 'lastServiceDate',
    'Monthly_Km_Average': 'monthlyKmAverage',
    'Calculated_Health_Score': 'calculatedHealthScore',
    'Decision': 'decision',
};

// A simple check to see if a string looks like a date
const isDateString = (value: string): boolean => {
    return !isNaN(Date.parse(value));
}

export const parseTrainsetCSV = (csvText: string): Trainset[] => {
    const lines = csvText.trim().split(/\r\n|\n|\r/);
    if (lines.length < 2) {
        throw new Error("CSV must have a header and at least one data row.");
    }

    const header = lines[0].split(',').map(h => h.trim());
    
    // Check for required headers
    const missingHeaders = requiredHeaders.filter(h => !header.includes(h));
    if (missingHeaders.length > 0) {
        throw new Error(`CSV is missing required headers: ${missingHeaders.join(', ')}.`);
    }

    const headerIndices: { [key: string]: number } = {};
    header.forEach((h, i) => {
        headerIndices[h] = i;
    });

    const trainsets: Trainset[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const data = line.split(',').map(d => d.trim());
        if (data.length !== header.length) {
             console.warn(`Row ${i + 1} has an incorrect number of columns. Expected ${header.length}, got ${data.length}. Skipping.`);
             continue;
        }

        try {
            const train: { [key: string]: any } = {};
            
            for (const csvHeader of requiredHeaders) {
                const trainsetKey = headerMapping[csvHeader];
                const value = data[headerIndices[csvHeader]];

                switch(trainsetKey) {
                    case 'id':
                        train[trainsetKey] = parseInt(value.replace('Train_', ''), 10);
                        break;
                    case 'fitnessCertificateStatus':
                        train[trainsetKey] = value as FitnessStatus;
                        break;
                    case 'jobCardStatus':
                        train[trainsetKey] = value as JobCardStatus;
                        break;
                    case 'stablingGeometry':
                        train[trainsetKey] = value as StablingGeometry;
                        break;
                    case 'iblAvailability':
                        train[trainsetKey] = value as IBLAvailability;
                        break;
                    case 'cleaningSlotAvailable':
                    case 'telecomClearance':
                        train[trainsetKey] = value.toLowerCase() === 'yes';
                        break;
                    case 'fitnessCertificateExpiryDate':
                    case 'nextServiceDueDate':
                    case 'wheelGaugeVerificationDate':
                    case 'lastServiceDate':
                        if (!isDateString(value)) throw new Error(`Invalid date format for ${csvHeader}: ${value}`);
                        train[trainsetKey] = new Date(value).toISOString();
                        break;
                    case 'decision':
                        if (value === 'Service') train[trainsetKey] = 'Revenue Service';
                        else if (value === 'IBL') train[trainsetKey] = 'Maintenance';
                        else train[trainsetKey] = value as Decision;
                        break;
                    default:
                        train[trainsetKey] = parseFloat(value);
                }
            }
            
            if (
                !Object.values(FitnessStatus).includes(train.fitnessCertificateStatus) ||
                !Object.values(JobCardStatus).includes(train.jobCardStatus)
            ) {
                throw new Error(`Row ${i + 1} contains invalid status values (e.g., 'Valid', 'Open'). Check for typos.`);
            }

            if (isNaN(train.id)) {
                throw new Error(`Row ${i + 1} has an invalid Trainset_ID.`);
            }

            trainsets.push(train as Trainset);
        } catch (e) {
            throw new Error(`Error parsing row ${i + 1}: ${(e as Error).message}`);
        }
    }
    return trainsets;
};