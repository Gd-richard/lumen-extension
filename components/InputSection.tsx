import React from 'react';

interface InputSectionProps {
  url: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onClear: () => void;
  onAutoDetect: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({ 
  url, 
  onUrlChange, 
  onAnalyze,
  isAnalyzing,
  onClear,
  onAutoDetect
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && url && !isAnalyzing) {
      onAnalyze();
    }
  };

  return (
    <div className="p-6 bg-white relative z-10">
      <label htmlFor="policy-url" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
        Privacy Policy URL
      </label>
      
      <div className="relative mb-4 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        
        <input
          id="policy-url"
          type="url"
          value={url}
          onChange={onUrlChange}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com/privacy"
          disabled={isAnalyzing}
          className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-slate-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 ease-out shadow-sm hover:border-gray-300"
        />

        {url && !isAnalyzing && (
          <button 
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <button
        onClick={onAnalyze}
        disabled={!url || isAnalyzing}
        className={`w-full py-3.5 rounded-xl font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-200 transform
          ${!url || isAnalyzing 
            ? 'bg-slate-300 shadow-none cursor-not-allowed opacity-70' 
            : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]'
          }`}
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </span>
        ) : (
          'Analyze Policy'
        )}
      </button>
      
      {!isAnalyzing && !url && (
        <button 
          onClick={onAutoDetect}
          className="w-full text-center text-xs text-slate-400 mt-4 animate-fade-in hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 group cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Detect current tab automatically
        </button>
      )}
    </div>
  );
};

export default InputSection;