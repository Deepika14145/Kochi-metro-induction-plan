import React, { useState } from 'react';

const faqData = [
  {
    question: "What is the primary purpose of this AI Induction Planner?",
    answer: "This platform is a decision-support tool designed to help the Kochi Metro operations team create an optimal, data-driven nightly induction plan. It uses AI to analyze multiple variables (like maintenance needs, branding commitments, and mileage) to recommend which trainsets should be in revenue service, on standby, or sent for maintenance.",
  },
  {
    question: "What kind of data does the planner require?",
    answer: "The planner requires a CSV file containing the latest status of all trainsets. You can download the required data template from the Configuration tab. The key data points include fitness certificate validity, job card status, mileage, branding hours, and cleaning status for each train.",
  },
  {
    question: "How does the AI make its decisions?",
    answer: "The AI (powered by Google's Gemini model) follows a set of customizable rules and priority weights that you can define. By default, it prioritizes train fitness and maximizing fleet availability for revenue service. It analyzes all train data against these rules to generate a conflict-free plan with clear reasoning for each recommendation.",
  },
  {
    question: "Can I change the AI's decision-making logic?",
    answer: "Yes. The 'Edit Rules & Priorities' button in the Configuration tab allows you to directly edit the natural language rules the AI follows and adjust the weight (importance) of factors like fitness, branding, mileage, and cleaning. This allows you to align the AI's logic with changing operational goals.",
  },
  {
    question: "Is this tool meant for the Operations team or Inspectors?",
    answer: "Both. The Operations team is the primary user, responsible for generating and executing the daily induction plan. The Inspectors team can use the platform in a read-only or analytical capacity to review fleet status, understand maintenance priorities, and ensure compliance with safety and service standards.",
  },
  {
    question: "What happens if I upload a CSV with incorrect data?",
    answer: "The application has a built-in CSV parser that validates the file structure and data formats. If it detects missing columns, incorrect status values, or other errors, it will display a descriptive error message to help you correct the file before processing.",
  },
];

const FaqItem: React.FC<{
  item: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
}> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-metro-text-heading"
        aria-expanded={isOpen}
      >
        <span>{item.question}</span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
            <p className="pt-2 pr-4 text-metro-text-body leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-metro-light-bg">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-metro-text-heading mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-metro-text-body">Find answers to common questions about the AI planner.</p>
        </div>
        <div>
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
