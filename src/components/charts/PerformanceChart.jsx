import React, { useMemo } from 'react';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { formatPace } from '../../utils/dataUtils';
import CustomTooltip from './CustomTooltip';
import _ from 'lodash';

const calculateTrendLine = (data) => {
  const n = data.length;
  if (n < 2) return [];

  // Créer les points x (indices) et y (allure)
  const points = data.map((d, i) => ({
    x: i,
    y: d.paceInMinutes
  }));

  // Calculer les moyennes
  const meanX = _.meanBy(points, 'x');
  const meanY = _.meanBy(points, 'y');

  // Calculer la pente (m) de la ligne de tendance
  const numerator = _.sumBy(points, p => (p.x - meanX) * (p.y - meanY));
  const denominator = _.sumBy(points, p => Math.pow(p.x - meanX, 2));
  const m = numerator / denominator;

  // Calculer l'ordonnée à l'origine (b)
  const b = meanY - m * meanX;

  // Créer la ligne de tendance
  return data.map((d, i) => ({
    ...d,
    trendPace: m * i + b
  }));
};

const PerformanceChart = ({ data, groupBy, showTrendLine = false }) => {
  // Calculer les domaines pour l'allure avec marge de ±10 secondes
  const pacesDomain = useMemo(() => {
    const paces = data.map(d => d.paceInMinutes);
    const minPace = Math.min(...paces);
    const maxPace = Math.max(...paces);
    const margin = 10/60;
    return [
      Math.max(minPace - margin, 0),
      maxPace + margin
    ];
  }, [data]);

  // Calculer la ligne de tendance
  const dataWithTrend = useMemo(() => calculateTrendLine(data), [data]);

  return (
    <div className="h-[400px] md:h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={dataWithTrend} 
          margin={{ 
            top: 30, 
            right: 20, 
            left: 0, 
            bottom: 20 
          }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.9}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#E5E7EB" 
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => {
              const formatOptions = groupBy === 'month' 
                ? { month: 'short', year: '2-digit' }
                : { month: 'short', day: 'numeric' };
              return date.toLocaleDateString('fr-FR', formatOptions);
            }}
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
            minTickGap={20}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={(value) => `${value}km`}
            axisLine={false}
            tickLine={false}
            stroke="#6B7280"
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            domain={pacesDomain}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={(value) => `${formatPace(value)}`}
            axisLine={false}
            tickLine={false}
            stroke="#6B7280"
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(229, 231, 235, 0.1)' }}
          />
          <Legend 
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              fontSize: '14px',
              fontWeight: 500,
              paddingBottom: '24px'
            }}
          />
          <Bar 
            yAxisId="left" 
            dataKey="distance" 
            fill="url(#barGradient)"
            name="Distance" 
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="paceInMinutes" 
            stroke="#DC2626" 
            name="Allure"
            strokeWidth={2.5}
            dot={{ 
              fill: '#DC2626',
              r: 4,
              strokeWidth: 2,
              stroke: '#fff'
            }}
            activeDot={{ 
              r: 6,
              stroke: '#fff',
              strokeWidth: 2,
              fill: '#DC2626'
            }}
          />
          {showTrendLine && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="trendPace"
              stroke="#9333EA"
              strokeWidth={2}
              dot={false}
              name="Tendance"
              strokeDasharray="5 5"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;