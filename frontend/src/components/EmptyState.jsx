import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'Nuk ka të dhëna',
  description = 'Aktualisht nuk ka të dhëna të regjistruara në këtë seksion.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow transition-colors"
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;

