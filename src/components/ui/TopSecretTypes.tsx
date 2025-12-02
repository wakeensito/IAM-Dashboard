import React from 'react';

interface SecretTypeData {
  type: string;
  count: number;
}

interface TopSecretTypesProps {
  data: SecretTypeData[];
  topN?: number;
}

export function TopSecretTypes({ data, topN = 8 }: TopSecretTypesProps) {
  // Sort by count descending and take top N
  const sortedData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  // Empty state
  if (totalCount === 0 || sortedData.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 h-80 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Secret Types</h3>
        <p className="text-gray-500 text-center">No secret types to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Secret Types</h3>
        <p className="text-sm text-gray-600">Most frequent secret categories</p>
      </div>
      
      <div className="space-y-3">
        {sortedData.map((item, index) => (
          <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-900">
                {item.type.length > 30 ? `${item.type.substring(0, 30)}...` : item.type}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold text-blue-600 mr-2">{item.count}</span>
              <span className="text-xs text-gray-500">secrets</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}