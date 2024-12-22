import React from 'react';
import { formatPace } from '../../utils/dataUtils';

// Définir les mêmes couleurs que dans le graphique
const COLORS = {
  'Distance': '#3B82F6', // Bleu pour la distance (correspond au gradient)
  'Allure': '#DC2626',   // Rouge pour l'allure
  'Tendance': '#9333EA'  // Violet pour la tendance
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg p-4 transition-all duration-200 ease-in-out">
      <p className="font-medium text-gray-900 mb-2">
        {new Date(label).toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      {payload.map((entry, index) => (
        <div 
          key={index} 
          className="flex items-center space-x-2 text-sm" 
          style={{ color: COLORS[entry.name] || entry.color }}
        >
          <span 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: COLORS[entry.name] || entry.color }}
          />
          <span className="font-medium">{entry.name}: </span>
          <span>
            {entry.name === "Distance" ? 
              `${entry.value.toFixed(2)} km` : 
              formatPace(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomTooltip;