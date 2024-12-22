import React from 'react';
import { Footprints, Calendar, Trophy, Target } from 'lucide-react';
import StatCard from './StatCard';
import TrendIndicator from './TrendIndicator';
import { formatPace } from '../../utils/dataUtils';

const StatsGrid = ({ insights, lastTwoRuns }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard 
        title="Distance Totale" 
        value={insights.totalDistance.toFixed(1)} 
        unit="km"
        icon={<Footprints className="text-blue-500" size={24} />}
        trend={lastTwoRuns.length === 2 && (
          <TrendIndicator 
            value={lastTwoRuns[1].distance} 
            previousValue={lastTwoRuns[0].distance}
          />
        )}
      />
      <StatCard 
        title="Courses" 
        value={insights.totalRuns} 
        unit="sorties"
        icon={<Calendar className="text-emerald-500" size={24} />}
      />
      <StatCard 
        title="Record Distance" 
        value={insights.longestRun.toFixed(1)} 
        unit="km"
        icon={<Trophy className="text-amber-500" size={24} />}
      />
      <StatCard 
        title="Record Vitesse" 
        value={formatPace(insights.bestPace)} 
        unit="/km"
        icon={<Target className="text-red-500" size={24} />}
        trend={lastTwoRuns.length === 2 && (
          <TrendIndicator 
            value={lastTwoRuns[1].paceInMinutes} 
            previousValue={lastTwoRuns[0].paceInMinutes}
            reverse={true}
          />
        )}
      />
    </div>
  );
};

export default StatsGrid;