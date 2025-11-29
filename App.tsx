import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import FaqSection from './components/FaqSection';
import SkeletonLoader from './components/SkeletonLoader';
import { MOCK_ANALYSIS_RESULT, MOCK_FAQS } from './constants';
import { AppState } from './types';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleClear = () => {
    setUrl('');
    setAppState(AppState.IDLE);
  }

  const handleAutoDetect = () => {
    try {
      // Check if running in a Chrome Extension environment
      // @ts-ignore
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
        // @ts-ignore
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab && activeTab.url) {
            setUrl(activeTab.url);
          }
        });
      } else {
        // Fallback for development/preview environment
        console.log('Environment: Not a Chrome Extension. Using mock URL.');
        setUrl('https://www.google.com/policies/privacy');
      }
    } catch (error) {
      console.error('Error detecting URL:', error);
    }
  };

  // Attempt to auto-detect URL when the popup opens
  useEffect(() => {
    handleAutoDetect();
  }, []);

  const handleAnalyze = () => {
    if (!url) return;
    
    // Reset state if analyzing again
    setAppState(AppState.ANALYZING);
    
    // Simulate API processing time
    setTimeout(() => {
      setAppState(AppState.RESULTS);
    }, 2000); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-200 to-slate-300 font-sans">
      <div className="w-[400px] bg-white rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col h-[600px] relative border border-white/50">
        
        {/* Sticky Header */}
        <Header />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth bg-gray-50/30">
          <InputSection 
            url={url} 
            onUrlChange={handleUrlChange} 
            onAnalyze={handleAnalyze}
            isAnalyzing={appState === AppState.ANALYZING}
            onClear={handleClear}
            onAutoDetect={handleAutoDetect}
          />

          {appState === AppState.ANALYZING && (
             <SkeletonLoader />
          )}

          {appState === AppState.RESULTS && (
            <div className="animate-fade-in">
              <div className="px-6 py-2 flex items-center justify-between">
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Analysis Results
                </h2>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Updated Today
                </span>
              </div>
              <ResultsSection data={MOCK_ANALYSIS_RESULT} />
              <FaqSection items={MOCK_FAQS} />
              
              {/* Footer */}
              <div className="p-6 text-center">
                 <p className="text-[10px] text-slate-300">Lumen AI v1.0 • Privacy First</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default App;