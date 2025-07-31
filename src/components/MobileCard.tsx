import React from 'react';

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: 'sm' | 'md' | 'lg';
}

const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className = '',
  style = {},
  padding = 'md'
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'sm': return 'var(--spacing-sm)';
      case 'lg': return 'var(--spacing-lg)';
      default: return 'var(--spacing-md)';
    }
  };

  return (
    <div
      className={`card ${className}`}
      style={{
        padding: getPadding(),
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default MobileCard;
