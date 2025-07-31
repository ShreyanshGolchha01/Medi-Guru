import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  minColumnWidth?: string;
  gap?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  minColumnWidth = '280px',
  gap = 'var(--spacing-md)',
  className = '',
  style = {}
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`,
        gap: gap,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
