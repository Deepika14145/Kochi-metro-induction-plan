export const defaultRules = `1. **Maintenance is Highest Priority (Safety First):**
   - A train **MUST** be sent to Maintenance if its 'fitnessCertificateStatus' is 'Expired' or 'jobCardStatus' is 'Open'. This is non-negotiable.
   - A train **MUST** be sent to Maintenance if its 'nextServiceDueDate' is within the next 7 days to prepare for scheduled servicing.
   - A train should be **strongly considered** for Maintenance if its 'calculatedHealthScore' is below 30 OR 'brakePadWearPercent' is over 95%, especially if 'iblAvailability' is 'Available'.

2. **Standby Criteria (Buffer & Near-Future Maintenance):**
   - A train is a good candidate for Standby if its 'fitnessCertificateStatus' is 'ExpiringSoon' (meaning the expiry date is within 30 days).
   - Also, place trains on Standby if their 'nextServiceDueDate' is within the next 8-21 days. This stages them for upcoming maintenance.
   - Trains with a 'calculatedHealthScore' between 30 and 65 are good candidates for Standby. They are usable but should be cycled out soon.
   - Use Standby to buffer the fleet. If Maintenance and critical Standby assignments are low, place the lowest-priority service-ready trains here.

3. **Revenue Service Criteria (Maximize Operational Readiness):**
   - A train must have a 'Valid' fitness certificate and a 'Closed' or 'Pending' job card.
   - **Prioritize trains with the highest 'calculatedHealthScore'**. A high score indicates overall fitness and minimal upcoming issues.
   - After health score, prioritize trains with low 'brandingHoursLeft' to ensure advertising commitments are met.
   - Use 'totalKmTravelled' and 'monthlyKmAverage' to balance mileage across the fleet. Prefer trains with lower mileage for service to even out wear and tear over time.
   - All other factors being equal, prefer trains with dates ('fitnessCertificateExpiryDate', 'nextServiceDueDate') that are furthest in the future.

4. **Fleet Distribution Goal:**
   - The primary goal is to maximize fleet availability while ensuring safety and addressing upcoming maintenance proactively.
   - Strive to assign approximately **75%** of the fleet to **Revenue Service**. These should be the most fit trains with high health scores.
   - Assign approximately **15%** of the fleet to **Standby**. This category is for trains that are nearly ready or are being staged for future maintenance.
   - Assign approximately **10%** of the fleet to **Maintenance**. This is reserved for trains with critical issues or immediate upcoming service requirements.`;
