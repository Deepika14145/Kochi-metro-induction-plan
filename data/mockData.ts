import type { Trainset, Decision } from '../types';
import { FitnessStatus, JobCardStatus } from '../types';
import { TOTAL_TRAINSETS } from '../constants';

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number, decimals: number): number => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
};

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// Calculates a health score from 0-100 based on various factors
const calculateHealthScore = (train: Omit<Trainset, 'calculatedHealthScore' | 'decision'>): number => {
    let score = 100;

    // Penalty for brake wear (max -25 points)
    score -= (train.brakePadWearPercent / 100) * 25;

    // Penalty for HVAC efficiency (max -15 points)
    if (train.hvacEfficiency < 85) {
        score -= (1 - (train.hvacEfficiency / 85)) * 15;
    }

    // Penalty for age and mileage (max -15 points)
    const ageMileageFactor = (train.metroAgeYears / 10) * 0.5 + (train.totalKmTravelled / 200000) * 0.5;
    score -= ageMileageFactor * 15;

    // Penalty for approaching service due date (max -30 points)
    const serviceDueDate = new Date(train.nextServiceDueDate);
    const daysToService = (serviceDueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    if (daysToService < 30) {
        score -= (1 - (daysToService / 30)) * 30;
    }

    // Penalty for approaching cert expiry (max -30 points)
    const certExpiryDate = new Date(train.fitnessCertificateExpiryDate);
    const daysToCertExpiry = (certExpiryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    if (daysToCertExpiry < 60) {
        score -= (1 - (daysToCertExpiry / 60)) * 30;
    }
    
    // An open job card is a major penalty
    if (train.jobCardStatus === JobCardStatus.Open) {
        score -= 50;
    }
    
    return Math.max(0, Math.round(score));
};


const generateMockTrainset = (id: number): Trainset => {
  const today = new Date();
  
  // Generate chronologically correct dates
  const lastServiceDate = addDays(today, -getRandomInt(10, 180));
  const nextServiceDueDate = addDays(lastServiceDate, 180); // Service every ~6 months
  const wheelGaugeVerificationDate = addDays(today, -getRandomInt(5, 90));
  
  // Fitness certificate logic
  const certDaysRemaining = getRandomInt(-10, 365); // can be expired
  const fitnessCertificateExpiryDate = addDays(today, certDaysRemaining);
  let fitnessCertificateStatus: FitnessStatus;
  if (certDaysRemaining < 0) {
    fitnessCertificateStatus = FitnessStatus.Expired;
  } else if (certDaysRemaining <= 30) {
    fitnessCertificateStatus = FitnessStatus.ExpiringSoon;
  } else {
    fitnessCertificateStatus = FitnessStatus.Valid;
  }
  
  const jobCardStatus = getRandomElement([JobCardStatus.Closed, JobCardStatus.Closed, JobCardStatus.Closed, JobCardStatus.Pending, JobCardStatus.Open]);

  const partialTrain: Omit<Trainset, 'calculatedHealthScore' | 'decision'> = {
    id: id,
    fitnessCertificateStatus,
    jobCardStatus,
    brandingHoursLeft: getRandomInt(0, 200),
    mileageTodayKm: getRandomInt(100, 500),
    cleaningSlotAvailable: Math.random() > 0.5,
    stablingPosition: getRandomInt(1, 10),
    totalKmTravelled: getRandomInt(10000, 200000),
    metroAgeYears: getRandomInt(1, 10),
    plannedKmTomorrow: getRandomInt(100, 400),
    stablingGeometry: Math.random() > 0.5 ? 'Optimal' : 'Suboptimal',
    iblAvailability: Math.random() > 0.5 ? 'Available' : 'Occupied',
    energyConsumptionIndex: getRandomFloat(0.8, 1.5, 2),
    brakePadWearPercent: getRandomInt(0, 100),
    hvacEfficiency: getRandomFloat(60, 100, 2),
    telecomClearance: Math.random() > 0.5,
    // Dates
    fitnessCertificateExpiryDate: fitnessCertificateExpiryDate.toISOString(),
    nextServiceDueDate: nextServiceDueDate.toISOString(),
    wheelGaugeVerificationDate: wheelGaugeVerificationDate.toISOString(),
    lastServiceDate: lastServiceDate.toISOString(),
    // Monthly average
    monthlyKmAverage: getRandomInt(10000, 15000),
  };

  const healthScore = calculateHealthScore(partialTrain);
  
  let decision: Decision;
  if (partialTrain.fitnessCertificateStatus === FitnessStatus.Expired || partialTrain.jobCardStatus === JobCardStatus.Open || healthScore < 35) {
      decision = 'Maintenance';
  } else if (partialTrain.fitnessCertificateStatus === FitnessStatus.ExpiringSoon || healthScore < 65) {
      decision = 'Standby';
  } else {
      decision = 'Revenue Service';
  }

  return {
    ...partialTrain,
    calculatedHealthScore: healthScore,
    decision: decision,
  };
};

export const generateAllMockData = (): Trainset[] => {
    return Array.from({ length: TOTAL_TRAINSETS }, (_, i) => generateMockTrainset(i + 1));
};