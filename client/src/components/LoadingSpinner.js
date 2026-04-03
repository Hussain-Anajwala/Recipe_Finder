import React from 'react';

function LoadingSpinner({ size = 'medium', message }) {
  const sizeMap = {
    small: 'w-6 h-6',
    medium: 'w-14 h-14',
    large: 'w-20 h-20'
  };

  const spinnerDims = sizeMap[size] || sizeMap.medium;

  const displayMessage = message || 'Curating your experience...';

  return (
    <div className="flex flex-col justify-center items-center gap-6 p-8 bg-surface w-full min-h-[60vh] relative overflow-hidden">
      {/* Grain texture background */}
      <div className="absolute inset-0 grain-overlay pointer-events-none"></div>

      {/* Spinner ring */}
      <div className={`relative ${spinnerDims}`}>
        {/* Track ring */}
        <div className="absolute inset-0 rounded-full border-2 border-outline-variant/20"></div>
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-primary/60 animate-pulse"
            style={{ fontSize: '40%' }}
          >
            restaurant_menu
          </span>
        </div>
      </div>

      {/* Savour wordmark */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-headline text-2xl text-primary tracking-tighter">Savour</span>
        <span className="font-technical text-[10px] tracking-[0.2em] text-on-surface-variant uppercase animate-pulse">
          {displayMessage}
        </span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
