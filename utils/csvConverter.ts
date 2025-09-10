import type { Trainset } from '../types';

// The order of headers is important for the CSV file.
const CSV_HEADERS = [
    'Trainset_ID',
    'Fitness_Certificate_Status',
    'Job_Card_Status',
    'Branding_Hours_Left',
    'Mileage_Today_km',
    'Cleaning_Slot_Available',
    'Stabling_Position',
    'Total_Km_Travelled',
    'Metro_Age_Years',
    'Planned_Km_Tomorrow',
    'Stabling_Geometry',
    'IBL_Availability',
    'Energy_Consumption_Index',
    'Brake_Pad_Wear_Percent',
    'HVAC_Efficiency',
    'Telecom_Clearance',
    'Fitness_Certificate_Expiry_Date',
    'Next_Service_Due_Date',
    'Wheel_Gauge_Verification_Date',
    'Last_Service_Date',
    'Monthly_Km_Average',
    'Calculated_Health_Score',
    'Decision',
];

const formatDateForCSV = (isoString: string): string => {
    try {
        return new Date(isoString).toISOString().split('T')[0];
    } catch {
        return 'Invalid Date';
    }
};

export const convertTrainsetsToCSV = (trains: Trainset[]): string => {
    const headerRow = CSV_HEADERS.join(',');
    
    const dataRows = trains.map(train => {
        const row = [
            `Train_${train.id}`,
            train.fitnessCertificateStatus,
            train.jobCardStatus,
            train.brandingHoursLeft,
            train.mileageTodayKm,
            train.cleaningSlotAvailable ? 'Yes' : 'No',
            train.stablingPosition,
            train.totalKmTravelled,
            train.metroAgeYears,
            train.plannedKmTomorrow,
            train.stablingGeometry,
            train.iblAvailability,
            train.energyConsumptionIndex,
            train.brakePadWearPercent,
            train.hvacEfficiency,
            train.telecomClearance ? 'Yes' : 'No',
            formatDateForCSV(train.fitnessCertificateExpiryDate),
            formatDateForCSV(train.nextServiceDueDate),
            formatDateForCSV(train.wheelGaugeVerificationDate),
            formatDateForCSV(train.lastServiceDate),
            train.monthlyKmAverage,
            train.calculatedHealthScore,
            train.decision,
        ];
        return row.join(',');
    });

    return [headerRow, ...dataRows].join('\n');
};