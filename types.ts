export enum FitnessStatus {
  Valid = 'Valid',
  ExpiringSoon = 'ExpiringSoon',
  Expired = 'Expired',
}

export enum JobCardStatus {
    Open = 'Open',
    Closed = 'Closed',
    Pending = 'Pending',
}

export type StablingGeometry = 'Optimal' | 'Suboptimal';
export type IBLAvailability = 'Available' | 'Occupied';
export type Decision = 'Revenue Service' | 'Standby' | 'Maintenance';


export interface Trainset {
  id: number;
  fitnessCertificateStatus: FitnessStatus;
  jobCardStatus: JobCardStatus;
  brandingHoursLeft: number;
  mileageTodayKm: number;
  cleaningSlotAvailable: boolean;
  stablingPosition: number;
  totalKmTravelled: number;
  metroAgeYears: number;
  plannedKmTomorrow: number;
  stablingGeometry: StablingGeometry;
  iblAvailability: IBLAvailability;
  energyConsumptionIndex: number;
  brakePadWearPercent: number;
  hvacEfficiency: number;
  telecomClearance: boolean;

  // New time-based and calculated fields
  fitnessCertificateExpiryDate: string; // ISO 8601 date string
  nextServiceDueDate: string; // ISO 8601 date string
  wheelGaugeVerificationDate: string; // ISO 8601 date string
  lastServiceDate: string; // ISO 8601 date string
  monthlyKmAverage: number;
  calculatedHealthScore: number; // A score from 0-100
  decision: Decision;
}


export interface RecommendedTrain {
    trainId: string;
    reason: string;
    detailedExplanation: string;
}

export interface Recommendation {
    revenueService: RecommendedTrain[];
    standby: RecommendedTrain[];
    maintenance: RecommendedTrain[];
}

export interface PriorityWeights {
  fitnessCertificate: number;
  jobCard: number;
  maintenanceFactors: number;
  branding: number;
  mileage: number;
  cleaning: number;
}

export type UserRole = 'Operations' | 'Inspectors';

export interface User {
    name: string;
    email: string;
    role: UserRole;
}