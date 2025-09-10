# Kochi Metro AI Induction Planner

## 1. Overview

An integrated, algorithm-driven decision-support platform for Kochi Metro to optimize nightly trainset induction planning. The app uses AI to generate a ranked induction list based on multiple variables, providing explainable reasoning and conflict alerts. This tool moves beyond traditional spreadsheets to provide a dynamic, intelligent, and interactive way to manage the metro fleet.

## 2. Key Features

- **AI-Powered Induction Planning**: Leverages Google's Gemini model to analyze complex fleet data and generate an optimal induction plan, categorizing each trainset for revenue service, standby, or maintenance.  
- **Interactive Fleet Dashboard**: A real-time, card-based view of the entire train fleet, allowing for quick searches and filtering based on fitness status or open job cards.  
- **Customizable Decision Logic**: Operations managers can modify the AI's decision-making process by editing natural language rules and adjusting priority weights for different factors (e.g., maintenance needs vs. branding commitments).  
- **Data Import/Export**: Easily import fleet data using a CSV file. The application also provides functionality to download a data template or the full mock dataset.  
- **Explainable AI**: Every recommendation comes with a clear, concise reason and a detailed explanation, ensuring transparency and trust in the AI's decisions.  
- **Performance Reporting**: A dedicated reports page provides a monthly summary of fleet performance, maintenance activities, and AI plan accuracy.  
- **Role-Based Access Control**: Simulates a login system for different teams, such as 'Operations' and 'Inspectors', tailoring the user experience.  
- **Responsive & Modern UI**: Built with Tailwind CSS for a clean, responsive, and intuitive user experience across different devices.  

## 3. Technology Stack

- **Frontend**: React, TypeScript  
- **AI/ML**: Google Gemini API (`@google/genai`)  
- **Styling**: Tailwind CSS  
- **Build Tool**: Vite  

## 4. Project Structure

The project is organized into a modular structure to promote maintainability and scalability.

├── public/  
├── src/  
│   ├── components/        → Reusable React components (e.g., TrainCard, Header)  
│   ├── config/            → Default application configurations (e.g., AI rules)  
│   ├── data/              → Mock data generation logic  
│   ├── services/          → API clients and services (e.g., geminiService.ts)  
│   ├── types/             → TypeScript type definitions  
│   ├── utils/             → Utility functions (e.g., CSV parsing/conversion)  
│   ├── App.tsx            → Main application component with routing logic  
│   └── index.tsx          → Application entry point  
├── index.html             → Main HTML file  
├── package.json           → Project dependencies and scripts  
└── README.md              → This file  

## 5. Getting Started

This application is designed to run in a web-based development environment where the API key is securely managed.

### Prerequisites

- An active **Google Gemini API Key**  

### Configuration

The application is hardcoded to read the Gemini API Key from the environment variable `process.env.API_KEY`. This is configured in `vite.config.ts`.

**Important**: The application code **must not** be modified to handle the API key in any other way. Do not add UI elements for key input or hardcode the key directly. The execution environment is responsible for providing this variable.

## 6. How to Use the Application

1. **Authentication**: Start by selecting a team ('Operations' or 'Inspectors') and logging in.  
2. **Explore the Landing Page**: The landing page provides an overview of the Kochi Metro, project details, and a FAQ section.  
3. **Launch the Planner**: Click "Launch Induction Planner" to enter the main application.  
4. **Fleet Dashboard**: The default view is the 'Fleet Dashboard'. Here you can see the status of all trainsets. Use the search and filter controls to find specific trains.  
5. **Configure Data**:  
   - Navigate to the **Configuration** tab.  
   - Click **Regenerate Mock Data** to populate the app with a sample fleet of 50 trains.  
   - Alternatively, **Download Template** to get the correct CSV format, fill it out, and then **Upload CSV** with your own data.  
6. **Customize AI Logic (Optional)**:  
   - On the **Configuration** tab, click **Edit Rules & Priorities**.  
   - In the modal, you can adjust the sliders to change the importance of each factor.  
   - You can also edit the text-based rules that the AI will follow.  
7. **Generate a Plan**:  
   - Once you have data loaded, click the **Generate Induction Plan** button on the **Configuration** tab.  
   - The AI will analyze the data based on the configured rules and priorities.  
8. **Review the Plan**:  
   - The application will automatically switch to the **AI Induction Plan** tab.  
   - Here you'll see a summary of the plan and lists of trains categorized into 'Revenue Service', 'Standby', and 'Maintenance'.  
   - Hover over a train in the list to see a detailed explanation for its placement.  
   - Click on a train to highlight its corresponding card on the 'Fleet Dashboard' tab for more details.  
9. **View Reports**:  
   - Navigate to the **Reports** tab to see a sample monthly performance report.  

