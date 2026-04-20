import React from 'react';

const LoadingSpinner = ({ message = 'Loading…' }) => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
    <div
      className="w-10 h-10 border-2 border-outline-variant border-t-primary rounded-full animate-spin"
      role="status"
      aria-label={message}
    />
    <p className="font-technical text-xs tracking-widest uppercase text-on-surface-variant">{message}</p>
  </div>
);

export default LoadingSpinner;
