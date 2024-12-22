import React from 'react';
import { Card, CardContent } from "../ui/card";

const StatCard = ({ title, value, unit, icon, trend }) => (
  <Card className="bg-white shadow hover:shadow-lg transition-shadow duration-300">
    <CardContent className="pt-4 md:pt-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 rounded-lg bg-opacity-20" style={{ backgroundColor: 'currentColor' }}>
              {icon}
            </div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-1">
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
            <span className="text-sm font-medium text-gray-600">{unit}</span>
          </div>
          {trend && (
            <div className="flex items-center mt-1">
              {trend}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;