import { GoogleGenAI, Type } from "@google/genai";
import type { Trainset, Recommendation, PriorityWeights } from '../types';

// FIX: Initialize with process.env.API_KEY as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const detailedItemSchema = {
    type: Type.OBJECT,
    properties: {
      trainId: {
        type: Type.STRING,
        description: 'The numeric ID of the trainset (e.g., "1").',
      },
      reason: {
        type: Type.STRING,
        description: 'A brief, one-sentence justification for this placement.',
      },
      detailedExplanation: {
        type: Type.STRING,
        description: 'A more detailed, multi-sentence explanation for the placement, citing specific data points (like brake wear percentage or certificate status) and the rules that justify the decision.',
      },
    },
    required: ['trainId', 'reason', 'detailedExplanation'],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    revenueService: {
      type: Type.ARRAY,
      description: 'Trains recommended for immediate revenue service.',
      items: detailedItemSchema,
    },
    standby: {
      type: Type.ARRAY,
      description: 'Trains recommended to be on standby.',
      items: detailedItemSchema,
    },
    maintenance: {
      type: Type.ARRAY,
      description: 'Trains recommended for the Inspection Bay Line (IBL) for maintenance.',
      items: detailedItemSchema,
    },
  },
  required: ['revenueService', 'standby', 'maintenance'],
};

const buildPrompt = (trains: Trainset[], rules: string, weights: PriorityWeights): string => {
  const trainDataString = JSON.stringify(trains, null, 2);
  const weightsString = `
- **Fitness Certificate:** ${weights.fitnessCertificate}/10
- **Job Card Status:** ${weights.jobCard}/10
- **Maintenance Factors (Brakes, HVAC, etc.):** ${weights.maintenanceFactors}/10
- **Branding Hours:** ${weights.branding}/10
- **Mileage Balancing:** ${weights.mileage}/10
- **Cleaning Availability:** ${weights.cleaning}/10
  `;

  return `
    You are an AI-powered decision support system for Kochi Metro's operations control center. 
    Your task is to analyze the status of ${trains.length} trainsets and generate an optimal nightly induction plan.

    Based on the following data, categorize each trainset into one of three groups: 'Revenue Service', 'Standby', or 'Inspection Bay Line (Maintenance)'.

    First, consider the following **priority weights** on a scale of 1 to 10, where 10 is the highest priority. These weights must heavily influence your decision-making process:
    ${weightsString}

    Next, apply these detailed **decision criteria**:
    ${rules}

    For each train, provide a brief 'reason' and a 'detailedExplanation'. The detailed explanation should be more thorough, referencing the specific data values that influenced the decision (e.g., "Expired fitness certificate", "Brake pad wear at 95%", "Next service due in 5 days") and connect them to the decision criteria you were given. Ensure every train is assigned to one of the three categories.

    **Data Schema Explanation:**
    - **id:** Unique numeric train identifier.
    - **fitnessCertificateStatus:** 'Valid', 'ExpiringSoon', or 'Expired'.
    - **jobCardStatus:** 'Open', 'Closed', or 'Pending'.
    - **brandingHoursLeft:** Remaining hours to fulfill branding contracts. Lower is better.
    - **totalKmTravelled:** Cumulative mileage. Used for balancing across the fleet.
    - **brakePadWearPercent:** Wear percentage. 0=new, 100=fully worn.
    - **hvacEfficiency:** Efficiency percentage. Higher is better.
    - **iblAvailability:** Whether the Inspection Bay Line is 'Available' or 'Occupied'.
    - **fitnessCertificateExpiryDate:** The exact date the fitness certificate expires.
    - **nextServiceDueDate:** The date the next major scheduled service is due.
    - **calculatedHealthScore:** A 0-100 score representing the train's overall condition. Higher is better. This is a key indicator.
    - **decision:** The pre-assessed decision from the source data ('Revenue Service', 'Standby', 'Maintenance'). This is for context; your final decision should be based on the rules.

    Here is the current trainset data in JSON format:
    ${trainDataString}

    Provide your output in the specified JSON format. Ensure the trainId in your response is the numeric ID as a string.
  `;
};

export const generateInductionPlan = async (trains: Trainset[], rules: string, weights: PriorityWeights): Promise<Recommendation> => {
    const prompt = buildPrompt(trains, rules, weights);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    try {
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        // Ensure all train IDs are strings for consistency
        const formatTrain = (train: any) => ({ ...train, trainId: String(train.trainId) });
        
        parsedJson.revenueService = parsedJson.revenueService.map(formatTrain);
        parsedJson.standby = parsedJson.standby.map(formatTrain);
        parsedJson.maintenance = parsedJson.maintenance.map(formatTrain);
        
        return parsedJson as Recommendation;
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text);
        throw new Error("Received an invalid JSON response from the AI model.");
    }
};