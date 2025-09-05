import React from 'react';

const StatsCard = ({ title, value, icon, iconColor = "text-blue-600", iconBg = "bg-blue-100" }) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${iconColor}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
          <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
