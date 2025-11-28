import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center gap-4 p-5 border-b border-gray-100/50 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-200"></div>
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
          L
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-lg font-bold text-slate-900 leading-none mb-1">Lumen AI</h1>
        <p className="text-xs text-slate-500 font-medium">Privacy policies, finally clear</p>
      </div>
    </header>
  );
};

export default Header;