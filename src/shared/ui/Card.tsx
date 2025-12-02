import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  footer,
}) => {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-800">
          {footer}
        </div>
      )}
    </div>
  );
};
