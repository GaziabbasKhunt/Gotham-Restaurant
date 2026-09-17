import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorComponentProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorComponent: React.FC<ErrorComponentProps> = ({
  title = 'Something Went Wrong',
  message = 'Failed to load content. Please try again.',
  onRetry
}) => {
  return (
    <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto my-8 text-center border border-red-500/20">
      <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-100 mb-2 font-serif">{title}</h3>
      <p className="text-gray-400 text-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-black font-semibold hover:bg-gold-400 transition duration-200 gold-glow text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
};
