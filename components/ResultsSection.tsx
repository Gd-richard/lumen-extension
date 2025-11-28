import React from 'react';
import { AnalysisResult } from '../types';

interface ResultsSectionProps {
  data: AnalysisResult;
}

interface CardProps {
  title: string;
  icon: string;
  content: string;
  accentColor: string;
  bgColor: string;
  delay: string;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  icon, 
  content,
  accentColor,
  bgColor,
  delay
}) => (
  <div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100/80 hover:shadow-md transition-all duration-300 animate-slide-up ${delay} relative overflow-hidden group`}>
    {/* Left accent border */}
    <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor}`}></div>
    
    <div className="flex items-start gap-3 mb-3">
      <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center text-lg flex-shrink-0`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mt-1.5">{title}</h3>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed pl-1">
      {content}
    </p>
  </div>
);

const ResultsSection: React.FC<ResultsSectionProps> = ({ data }) => {
  return (
    <div className="px-6 pb-6 space-y-4">
      <Card 
        title="Data Usage" 
        icon="📊" 
        content={data.dataUsage}
        accentColor="bg-blue-500"
        bgColor="bg-blue-50"
        delay=""
      />
      <Card 
        title="Permissions" 
        icon="🔑" 
        content={data.permissions}
        accentColor="bg-amber-500"
        bgColor="bg-amber-50"
        delay="animation-delay-100"
      />
      <Card 
        title="Risks" 
        icon="⚠️" 
        content={data.risks}
        accentColor="bg-red-500"
        bgColor="bg-red-50"
        delay="animation-delay-200"
      />
      <Card 
        title="Your Rights" 
        icon="✅" 
        content={data.rights}
        accentColor="bg-emerald-500"
        bgColor="bg-emerald-50"
        delay="animation-delay-300"
      />
    </div>
  );
};

export default ResultsSection;