import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`}></div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="pt-4 border-t border-slate-100 flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-6">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
};

export default Skeleton;

