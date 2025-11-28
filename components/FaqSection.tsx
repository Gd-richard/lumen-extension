import React, { useState } from 'react';
import { FaqItem } from '../types';

interface FaqSectionProps {
  items: FaqItem[];
}

const AccordionItem: React.FC<{ item: FaqItem; isOpen: boolean; onClick: () => void }> = ({ 
  item, 
  isOpen, 
  onClick 
}) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-4 px-6 flex items-center justify-between text-left hover:bg-gray-50/80 transition-colors focus:outline-none group"
      >
        <div className="flex items-center gap-3">
          <span className="text-indigo-500 font-bold opacity-70 group-hover:opacity-100 transition-opacity">?</span>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">{item.question}</span>
        </div>
        <span className={`text-gray-400 text-xs transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}>
          ▼
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-5 pt-0 text-sm text-slate-600 leading-relaxed pl-10 border-l-2 border-transparent ml-6">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

const FaqSection: React.FC<FaqSectionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white border-t border-gray-100 relative z-20">
      <div className="bg-slate-50/50 px-6 py-3 border-b border-gray-100/50">
         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Common Questions</h4>
      </div>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default FaqSection;