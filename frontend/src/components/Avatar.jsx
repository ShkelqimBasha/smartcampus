import React from 'react';

const roleBgColors = {
  ADMIN: 'bg-purple-600 text-white',
  PROFESSOR: 'bg-blue-600 text-white',
  STUDENT: 'bg-emerald-600 text-white'
};

const Avatar = ({ user, size = 'md', className = '' }) => {
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-xl font-bold'
  };

  const bg = roleBgColors[user?.role] || 'bg-slate-700 text-white';

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold shadow-sm select-none ${sizeClasses[size] || sizeClasses.md} ${bg} ${className}`}
      title={`${firstName} ${lastName} (${user?.role || ''})`}
    >
      {initials}
    </div>
  );
};

export default Avatar;

