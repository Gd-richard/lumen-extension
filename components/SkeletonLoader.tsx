import React from 'react';

const SkeletonCard = ({ delay }: { delay: string }) => (
  <div className={`bg-white rounded-xl p-4 border border-gray-100 shadow-sm animate-pulse ${delay}`}>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded-full bg-slate-200"></div>
      <div className="h-4 w-24 bg-slate-200 rounded"></div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full bg-slate-100 rounded"></div>
      <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
      <div className="h-3 w-4/6 bg-slate-100 rounded"></div>
    </div>
  </div>
);

const SkeletonLoader: React.FC = () => {
  return (
    <div className="px-6 pb-6 space-y-4">
      <div className="px-1 py-2">
         <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
      </div>
      <SkeletonCard delay="animation-delay-100" />
      <SkeletonCard delay="animation-delay-200" />
      <SkeletonCard delay="animation-delay-300" />
    </div>
  );
};

export default SkeletonLoader;