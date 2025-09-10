import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type { Trainset, Recommendation, PriorityWeights, User } from "./types";
import { FitnessStatus, JobCardStatus } from "./types";
import { generateAllMockData } from "./data/mockData";
import { parseTrainsetCSV } from "./utils/csvParser";
import { generateInductionPlan } from "./services/geminiService";
import { defaultRules } from "./config/defaultRules";
import Header from "./components/Header";
import TrainDashboard from "./components/TrainDashboard";
import ControlPanel from "./components/ControlPanel";
import RulesModal from "./components/RulesModal";
import Notification from "./components/Notification";
import InteractiveResultsPanel from "./components/InteractiveResultsPanel";
import {
  ClipboardListIcon,
  CogIcon,
  ViewGridIcon,
  SearchIcon,
  UploadIcon,
  DocumentDownloadIcon,
  ChartPieIcon,
} from "./components/icons/Icons";
import AuthPage from "./components/AuthPage";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import DashboardControls from "./components/DashboardControls";

// --- Reports Page Component ---
const ReportCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-metro-border">
    <h3 className="text-xl font-bold text-metro-text-heading mb-4 border-b pb-2 border-gray-200">
      {title}
    </h3>
    {children}
  </div>
);

const MetricItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-center py-2">
    <p className="text-metro-text-body">{label}</p>
    <p className="font-bold text-lg text-metro-text-heading">{value}</p>
  </div>
);

const ReportsPage: React.FC = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const monthYear = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-metro-text-heading">
          Monthly Operations & Performance Report
        </h2>
        <p className="text-lg text-metro-text-body mt-2">{monthYear}</p>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md border">
        <p className="text-sm text-gray-500">
          Generated on:{" "}
          <span className="font-semibold">
            {formattedDate} at {formattedTime}
          </span>
        </p>
        <button
          disabled
          title="Feature coming soon"
          className="bg-metro-blue text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300 opacity-50 cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </button>
      </div>

      <ReportCard title="Executive Summary">
        <p className="text-metro-text-body leading-relaxed">
          This month, the Kochi Metro system demonstrated strong operational
          performance and reliability. Fleet availability remained high,
          exceeding targets, while energy consumption was optimized effectively.
          The AI Induction Planner played a crucial role in proactively
          identifying maintenance needs, resulting in a 15% reduction in
          unscheduled service interruptions compared to the previous month. Key
          initiatives included the successful completion of the annual brake
          system audit and the rollout of new branding on five trainsets,
          meeting all contractual deadlines.
        </p>
      </ReportCard>

      <div className="grid md:grid-cols-2 gap-8">
        <ReportCard title="Fleet Performance Metrics">
          <div className="space-y-2 divide-y divide-gray-100">
            <MetricItem label="Total Kilometers Travelled" value="452,180 km" />
            <MetricItem label="Average Fleet Availability" value="96.3%" />
            <MetricItem label="On-Time Performance (OTP)" value="99.8%" />
            <MetricItem label="Energy Consumption Index" value="1.02 kWh/km" />
            <MetricItem label="Passenger Journeys" value="2.1 Million" />
          </div>
        </ReportCard>

        <ReportCard title="Maintenance Overview">
          <div className="space-y-2 divide-y divide-gray-100">
            <MetricItem label="Scheduled Services Completed" value="12" />
            <MetricItem label="Unscheduled Repairs (Critical)" value="2" />
            <MetricItem label="Brake Pad Replacements" value="8 sets" />
            <MetricItem label="HVAC System Checks" value="25" />
            <MetricItem
              label="Health Score Improvement"
              value="+4.5 pts (avg)"
            />
          </div>
        </ReportCard>
      </div>

      <ReportCard title="AI Induction Plan Analysis">
        <p className="text-metro-text-body mb-4">
          The AI planner consistently produced optimal induction lists,
          requiring minimal human intervention. Analysis shows a strong
          correlation between AI recommendations and improved fleet health
          scores.
        </p>
        <div className="space-y-2 divide-y divide-gray-100">
          <MetricItem label="AI Plans Generated" value="31" />
          <MetricItem label="Average Plan Accuracy" value="99.2%" />
          <MetricItem label="Manual Overrides" value="3" />
          <MetricItem label="Avg. Generation Time" value="8.2 seconds" />
        </div>
        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-metro-blue rounded-r-md">
          <p className="text-sm text-metro-blue-dark">
            <span className="font-bold">Key Insight:</span> The AI successfully
            prioritized three trains with 'ExpiringSoon' fitness certificates,
            ensuring they were scheduled for inspection well before their expiry
            dates and preventing any potential service disruptions.
          </p>
        </div>
      </ReportCard>
    </div>
  );
};

type NotificationState = {
  message: string;
  type: "success" | "error";
} | null;

// --- Landing Page Icons ---
const CpuChipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M12 4.5v-1.5m0 18v-1.5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 6.375a1.5 1.5 0 00-1.5 1.5v8.25c0 .828.672 1.5 1.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-8.25a1.5 1.5 0 00-1.5-1.5H5.25z"
    />
  </svg>
);

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);

// Define PlannerTab here so it can be used by LandingPage, PlannerPage, and App components.
type PlannerTab = "dashboard" | "plan" | "configuration" | "reports";

// --- Landing Page Component ---
const LandingPage: React.FC<{
  onLaunchPlanner: (tab: PlannerTab) => void;
  user: User;
  onLogout: () => void;
}> = ({ onLaunchPlanner, user, onLogout }) => {
  const stations = [
    "Aluva",
    "Pulinchanodu",
    "Companypady",
    "Ambattukavu",
    "Muttom",
    "Kalamassery",
    "Cochin University",
    "Pathadipalam",
    "Edapally",
    "Changampuzha Park",
    "Palarivattom",
    "J. L. N. Stadium",
    "Kaloor",
    "Town Hall",
    "M. G. Road",
    "Maharaja's College",
    "Ernakulam South",
    "Kadavanthra",
    "Elamkulam",
    "Vyttila",
    "Thykoodam",
    "Pettah",
    "Vadakkekotta",
    "S. N. Junction",
    "Thrippunithura",
  ];

  const plannerButtons: {
    title: string;
    tab: PlannerTab | null;
    enabled: boolean;
  }[] = [
    { title: "Fleet Status", tab: "dashboard", enabled: true },
    { title: "AI Planning", tab: "plan", enabled: true },
    { title: "System Config", tab: "configuration", enabled: true },
    { title: "Reports", tab: "reports", enabled: true },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const StatCounter: React.FC<{
    finalValue: number;
    label: string;
    suffix?: string;
  }> = ({ finalValue, label, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      let start = 0;
      const end = finalValue;
      if (start === end) return;

      const duration = 2000;
      const incrementTime = duration / end;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const timer = setInterval(() => {
              start += 1;
              setCount(start);
              if (start === end) clearInterval(timer);
            }, incrementTime);
            observer.disconnect();
          }
        },
        { threshold: 0.7 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, [finalValue]);

    return (
      <div ref={ref} className="text-center">
        <p className="text-4xl md:text-5xl font-extrabold text-metro-blue">
          {count}
          {suffix}
        </p>
        <p className="text-sm md:text-base font-semibold text-metro-text-body mt-2">
          {label}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white text-metro-text-body font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-20 shadow-sm border-b border-metro-border">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a href="#" className="flex items-center space-x-3">
            <svg
              className="w-8 h-8 text-metro-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <div>
              <h1 className="text-xl font-bold text-metro-text-heading">
                Kochi Metro
              </h1>
              <h2 className="text-sm font-semibold text-metro-blue -mt-1">
                AI Induction Planner
              </h2>
            </div>
          </a>
          <div className="hidden md:flex items-center space-x-8 font-semibold">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "about")}
              className="hover:text-metro-blue transition-colors"
            >
              About
            </a>
            <a
              href="#map"
              onClick={(e) => handleNavClick(e, "map")}
              className="hover:text-metro-blue transition-colors"
            >
              Metro Map
            </a>
            <a
              href="#technology"
              onClick={(e) => handleNavClick(e, "technology")}
              className="hover:text-metro-blue transition-colors"
            >
              Technology
            </a>
            <a
              href="#stations"
              onClick={(e) => handleNavClick(e, "stations")}
              className="hover:text-metro-blue transition-colors"
            >
              Stations
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-metro-text-heading">
                {user.name}
              </p>
              <p className="text-xs text-metro-text-body">{user.role} Team</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-gray-200 text-metro-text-body font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 text-sm"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative text-white min-h-[80vh] flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1568530656475-573a62a63216?q=80&w=2940&auto=format&fit=crop')`,
        }}
      >
      <div className="absolute inset-0 bg-[rgb(0_161_222/0.6)]"></div>
        <div className="relative z-10 text-center p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            India's 8th Inter-modal Metro System
          </h1>
          <p className="text-lg md:text-xl mb-8 font-light max-w-2xl mx-auto drop-shadow-md">
            Harnessing AI to drive operational excellence and intelligent
            trainset induction for the nation's most integrated public transport
            network.
          </p>
          <button
            onClick={() => onLaunchPlanner("dashboard")}
            className="bg-metro-orange text-white font-bold py-3 px-8 rounded-lg hover:bg-metro-orange-dark transition duration-300 text-lg shadow-xl"
          >
            Launch Induction Planner
          </button>
        </div>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 px-4 max-w-5xl mx-auto">
          {plannerButtons.map((button) => (
            <button
              key={button.title}
              onClick={() => button.tab && onLaunchPlanner(button.tab)}
              disabled={!button.enabled}
              title={
                !button.enabled ? "Coming soon" : `Navigate to ${button.title}`
              }
              className={`bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center border border-white/20 transition-colors duration-300 ${
                button.enabled
                  ? "hover:bg-white/20 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <p className="font-semibold text-white">{button.title}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter finalValue={25} label="Stations in Operation" />
          <StatCounter
            finalValue={27}
            label="Operational Route (km)"
            suffix=".4"
          />
          <StatCounter finalValue={50} label="Total Fleet Size" />
          <StatCounter
            finalValue={99}
            label="AI Plan Accuracy (%)"
            suffix="%"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto py-24 px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-metro-text-heading mb-6">
              Pioneering Urban Mobility in Kerala
            </h2>
            <p className="text-lg text-metro-text-body leading-relaxed mb-4">
              Kochi Metro is a state-of-the-art rapid transit system serving the
              city of Kochi. As the first metro in India to be fully integrated
              with other modes of transport like buses and ferries, it offers a
              seamless and efficient travel experience for commuters.
            </p>
            <p className="text-lg text-metro-text-body leading-relaxed mb-4">
              Beyond its technological prowess, Kochi Metro is celebrated for
              its commitment to social inclusion and sustainability. It has set
              a national benchmark by employing women from the Kudumbashree
              mission and members of the transgender community in its
              operations.
            </p>
            <p className="text-lg text-metro-text-body leading-relaxed">
              Each station is uniquely designed with themes reflecting Kerala's
              rich heritage, from its Western Ghats biodiversity to its maritime
              history. The system also champions green energy, with extensive
              use of solar power to reduce its carbon footprint.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="image.png"
              alt="Kochi Metro train at a station"
              className="rounded-lg shadow-2xl object-cover w-full h-auto max-w-2xl"
            />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="py-24 px-6 bg-metro-light-bg">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-metro-text-heading mb-4">
            Interactive Metro Network Map
          </h2>
          <p className="text-lg text-metro-text-body max-w-3xl mx-auto mb-10">
            Explore the live Kochi Metro network, view stations, and plan your
            journey with this interactive map.
          </p>
          <div className="bg-white rounded-lg shadow-xl border border-metro-border max-w-6xl mx-auto overflow-hidden">
            <iframe
              src="http://www.google.com/maps/d/embed?mid=1SMbNoMbyTkuTVLRpza9UjeO7XSY&ehbc=2E312F"
              className="w-full h-[65vh] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kochi Metro Interactive Network Map"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="container mx-auto py-24 px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-metro-text-heading mb-4">
            Technology Behind the Plan
          </h2>
          <p className="text-lg text-metro-text-body">
            A streamlined, three-stage process transforms complex data into
            actionable intelligence.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 hidden md:block"></div>
          <div className="absolute top-1/2 left-0 w-full flex justify-around hidden md:flex">
            <ArrowRightIcon
              className="w-8 h-8 text-metro-blue bg-white px-1"
              style={{ marginLeft: "25%" }}
            />
            <ArrowRightIcon
              className="w-8 h-8 text-metro-blue bg-white px-1"
              style={{ marginRight: "25%" }}
            />
          </div>
          <div className="relative flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg border border-metro-border">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-metro-blue/10 text-metro-blue">
              <UploadIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-metro-text-heading mb-2">
              1. Data Ingestion
            </h3>
            <p className="text-metro-text-body text-sm">
              Real-time fleet status, maintenance logs, and operational
              constraints are ingested via CSV.
            </p>
          </div>
          <div className="relative flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg border border-metro-border">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-metro-blue/10 text-metro-blue">
              <CpuChipIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-metro-text-heading mb-2">
              2. AI Analysis
            </h3>
            <p className="text-metro-text-body text-sm">
              Google's Gemini model analyzes the data against customizable rules
              and priority weights.
            </p>
          </div>
          <div className="relative flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg border border-metro-border">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-metro-blue/10 text-metro-blue">
              <DocumentDownloadIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-metro-text-heading mb-2">
              3. Optimized Plan
            </h3>
            <p className="text-metro-text-body text-sm">
              An optimal, conflict-free induction plan is generated with
              detailed, explainable reasoning.
            </p>
          </div>
        </div>
      </section>

      {/* Station List Section */}
      <section id="stations" className="py-24 px-6 bg-metro-light-bg">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-metro-text-heading mb-4">
              Operational Stations
            </h2>
            <p className="text-lg text-metro-text-body">
              The Blue Line currently serves 25 stations from Aluva to
              Thrippunithura.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl border border-metro-border overflow-hidden">
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {stations.map((station, index) => (
                <li
                  key={station}
                  className="p-4 border-b border-r border-gray-100 flex items-center space-x-3"
                >
                  <span className="flex items-center justify-center w-7 h-7 font-bold text-sm bg-metro-blue text-white rounded-full flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-metro-text-heading">
                    {station}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Faq />

      {/* CTA Section */}
      <section id="cta" className="bg-metro-blue text-white">
        <div className="container mx-auto py-20 px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Revolutionize Your Operations?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Move beyond spreadsheets and manual planning. Embrace the future of
            metro operations management.
          </p>
          <button
            onClick={() => onLaunchPlanner("dashboard")}
            className="bg-white text-metro-blue font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 text-lg"
          >
            Launch the Planner Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// --- Planner Page Component ---
const PlannerPage: React.FC<{
  onNavigateHome: () => void;
  user: User;
  onLogout: () => void;
  initialTab?: PlannerTab;
}> = ({ onNavigateHome, user, onLogout, initialTab = "dashboard" }) => {
  const [trains, setTrains] = useState<Trainset[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedTrainId, setHighlightedTrainId] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<PlannerTab>(initialTab);

  // State for dashboard filters
  const [searchQuery, setSearchQuery] = useState("");
  const [fitnessFilter, setFitnessFilter] = useState<"All" | FitnessStatus>(
    "All"
  );
  const [jobCardFilter, setJobCardFilter] = useState<"All" | JobCardStatus>(
    "All"
  );

  const [rules, setRules] = useState<string>(defaultRules);
  const [weights, setWeights] = useState<PriorityWeights>({
    fitnessCertificate: 10,
    jobCard: 9,
    maintenanceFactors: 7,
    branding: 3,
    mileage: 5,
    cleaning: 4,
  });

  const TABS: {
    id: PlannerTab;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }[] = [
    { id: "dashboard", label: "Fleet Dashboard", icon: ViewGridIcon },
    { id: "plan", label: "AI Induction Plan", icon: ClipboardListIcon },
    { id: "configuration", label: "Configuration", icon: CogIcon },
    { id: "reports", label: "Reports", icon: ChartPieIcon },
  ];

  useEffect(() => {
    setTrains(generateAllMockData());
  }, []);

  const handleGeneratePlan = useCallback(async () => {
    if (trains.length === 0) {
      setApiError(
        "No train data available. Please upload a CSV or generate mock data."
      );
      setActiveTab("plan");
      return;
    }
    setIsLoading(true);
    setApiError(null);
    setRecommendation(null);
    setHighlightedTrainId(null);
    setActiveTab("plan"); // Switch to plan view when generation starts
    try {
      const result = await generateInductionPlan(trains, rules, weights);
      setRecommendation(result);
    } catch (err) {
      console.error(err);
      setApiError(
        "Failed to generate induction plan. Please check your API key and network connection, then try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [trains, rules, weights]);

  const handleRegenerateData = useCallback(() => {
    const newTrains = generateAllMockData();
    setTrains(newTrains);
    setRecommendation(null);
    setApiError(null);
    setNotification({
      message: `Generated ${newTrains.length} new mock trainsets.`,
      type: "success",
    });
    setHighlightedTrainId(null);
    setActiveTab("dashboard");
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const newTrains = parseTrainsetCSV(text);
        setTrains(newTrains);
        setRecommendation(null);
        setApiError(null);
        setHighlightedTrainId(null);
        setNotification({
          message: `Successfully loaded ${newTrains.length} trainsets from ${file.name}.`,
          type: "success",
        });
        setActiveTab("dashboard");
      } catch (err) {
        console.error(err);
        setNotification({ message: (err as Error).message, type: "error" });
      }
    };
    reader.onerror = () => {
      setNotification({ message: "Failed to read the file.", type: "error" });
    };
    reader.readAsText(file);
  }, []);

  const handleSaveRules = (newRules: string, newWeights: PriorityWeights) => {
    setRules(newRules);
    setWeights(newWeights);
    setNotification({
      message: "AI decision rules and priorities have been updated.",
      type: "success",
    });
  };

  const handleTrainSelect = useCallback(
    (trainId: number | null) => {
      setHighlightedTrainId((currentId) => {
        const newId = currentId === trainId ? null : trainId;
        if (newId !== null && activeTab !== "dashboard") {
          setActiveTab("dashboard");
        }
        return newId;
      });
    },
    [activeTab]
  );

  const filteredTrains = useMemo(() => {
    return trains.filter((train) => {
      const searchMatch = train.id.toString().includes(searchQuery.trim());
      const fitnessMatch =
        fitnessFilter === "All" ||
        train.fitnessCertificateStatus === fitnessFilter;
      const jobCardMatch =
        jobCardFilter === "All" || train.jobCardStatus === jobCardFilter;

      return searchMatch && fitnessMatch && jobCardMatch;
    });
  }, [trains, searchQuery, fitnessFilter, jobCardFilter]);

  return (
    <div className="min-h-screen bg-metro-light-bg font-sans flex flex-col">
      <Header onNavigateHome={onNavigateHome} user={user} onLogout={onLogout} />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <main className="p-4 lg:p-6 flex-grow container mx-auto">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-2 sm:space-x-6" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${
                    activeTab === tab.id
                      ? "border-metro-blue text-metro-blue"
                      : "border-transparent text-metro-text-body hover:text-gray-700 hover:border-gray-300"
                  }
                  group inline-flex items-center py-4 px-1 sm:px-2 border-b-2 font-semibold text-sm transition-colors duration-200
                `}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <DashboardControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                fitnessFilter={fitnessFilter}
                setFitnessFilter={setFitnessFilter}
                jobCardFilter={jobCardFilter}
                setJobCardFilter={setJobCardFilter}
              />
              <TrainDashboard
                trains={filteredTrains}
                highlightedTrainId={highlightedTrainId}
              />
            </div>
          )}
          {activeTab === "plan" && (
            <InteractiveResultsPanel
              recommendation={recommendation}
              isLoading={isLoading}
              error={apiError}
              onTrainSelect={handleTrainSelect}
              highlightedTrainId={highlightedTrainId}
            />
          )}
          {activeTab === "configuration" && (
            <div className="max-w-md mx-auto">
              <ControlPanel
                onGenerate={handleGeneratePlan}
                onRegenerateData={handleRegenerateData}
                onEditRules={() => setIsModalOpen(true)}
                onUpload={handleFileUpload}
                isLoading={isLoading}
              />
            </div>
          )}
          {activeTab === "reports" && <ReportsPage />}
        </div>
      </main>
      <RulesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRules}
        initialRules={rules}
        initialWeights={weights}
      />
    </div>
  );
};

// --- Main App Component (Router) ---
type Page = "auth" | "landing" | "planner";

const App: React.FC = () => {
  const [page, setPage] = useState<Page>("auth");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initialPlannerTab, setInitialPlannerTab] =
    useState<PlannerTab>("dashboard");

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setPage("landing");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("auth");
  };

  const handleLaunchPlanner = (tab: PlannerTab) => {
    setInitialPlannerTab(tab);
    setPage("planner");
  };

  if (!currentUser || page === "auth") {
    return <AuthPage onLogin={handleLogin} />;
  }

  if (page === "landing") {
    return (
      <LandingPage
        onLaunchPlanner={handleLaunchPlanner}
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "planner") {
    return (
      <PlannerPage
        onNavigateHome={() => setPage("landing")}
        user={currentUser}
        onLogout={handleLogout}
        initialTab={initialPlannerTab}
      />
    );
  }

  // Fallback just in case
  return <AuthPage onLogin={handleLogin} />;
};

export default App;
