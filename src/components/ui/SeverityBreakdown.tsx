import React from 'react';

interface SeverityData {
  name: "Critical" | "High" | "Medium" | "Low";
  value: number;
}

interface SeverityBreakdownProps {
  data: SeverityData[];
  subtitle?: string;
}

const SEVERITY_COLORS = {
  Critical: '#ef4444',
  High: '#f97316', 
  Medium: '#f59e0b',
  Low: '#10b981'
};

const SEVERITY_ORDER = ['Critical', 'High', 'Medium', 'Low'] as const;

export function SeverityBreakdown({ data, subtitle = "Open" }: SeverityBreakdownProps) {
  // Sort data by severity weight and ensure all severities are present
  const sortedData = SEVERITY_ORDER.map(severity => {
    const existing = data.find(item => item.name === severity);
    return existing || { name: severity, value: 0 };
  });

  const total = sortedData.reduce((sum, item) => sum + item.value, 0);

  // Calculate angles for donut chart
  let currentAngle = 0;
  const segments = sortedData.map(item => {
    const percentage = total > 0 ? item.value / total : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + (percentage * 360);
    currentAngle = endAngle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle
    };
  });

  // SVG dimensions
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const innerRadius = radius * 0.65; // ~65% inner radius for breathing room

  // Convert angles to SVG path
  const createArcPath = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
    const start = polarToCartesian(center, center, outerR, endAngle);
    const end = polarToCartesian(center, center, outerR, startAngle);
    const innerStart = polarToCartesian(center, center, innerR, endAngle);
    const innerEnd = polarToCartesian(center, center, innerR, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", outerR, outerR, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerR, innerR, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Empty state
  if (total === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 h-72 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Severity Breakdown</h3>
        <p className="text-gray-500 text-center">No open findings</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6 h-72">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Severity Breakdown</h3>
        <p className="text-sm text-gray-600">Distribution of open secrets by severity</p>
      </div>
      
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <g role="img" aria-label="Severity breakdown donut chart">
            {segments.map((segment, index) => (
              <path
                key={segment.name}
                d={createArcPath(segment.startAngle, segment.endAngle, innerRadius, radius)}
                fill={SEVERITY_COLORS[segment.name]}
                className="transition-all duration-300 ease-in-out hover:opacity-80"
                style={{
                  transformOrigin: `${center}px ${center}px`,
                  animation: `fadeInScale 0.6s ease-out ${index * 0.1}s both`
                }}
              />
            ))}
          </g>
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-600">{subtitle}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {sortedData.map(item => (
          <div key={item.name} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: SEVERITY_COLORS[item.name] }}
              aria-label={`${item.name}: ${item.value}`}
            />
            <span className="text-gray-700">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}



