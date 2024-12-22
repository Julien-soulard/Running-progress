import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { processData, calculateInsights } from '../utils/dataUtils';
import PerformanceChart from './charts/PerformanceChart';
import StatsGrid from './stats/StatsGrid';
import { TrendingUp } from 'lucide-react';

const RunningStats = () => {
  const [groupBy, setGroupBy] = useState('day');
  const [showTrendLine, setShowTrendLine] = useState(false);
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [processedData, calculatedInsights] = await Promise.all([
        processData(groupBy),
        calculateInsights()
      ]);
      setData(processedData);
      setInsights(calculatedInsights);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError("Erreur lors du chargement des données. Vérifiez que le fichier CSV est présent dans le dossier 'data'.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [groupBy]);

  const lastTwoRuns = data.length >= 2 ? data.slice(-2) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Graphique principal */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="space-y-1 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-xl md:text-2xl font-bold">Vue d'ensemble</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 mr-4">
                  <Button
                    variant={showTrendLine ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowTrendLine(!showTrendLine)}
                    className="flex items-center gap-2"
                  >
                    <TrendingUp size={16} />
                    {showTrendLine ? 'Masquer' : 'Afficher'} la tendance
                  </Button>
                </div>
                <Button 
                  variant={groupBy === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGroupBy('day')}
                >
                  Par séance
                </Button>
                <Button 
                  variant={groupBy === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGroupBy('week')}
                >
                  Par semaine
                </Button>
                <Button 
                  variant={groupBy === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGroupBy('month')}
                >
                  Par mois
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PerformanceChart 
              data={data}
              groupBy={groupBy}
              showTrendLine={showTrendLine}
            />
          </CardContent>
        </Card>

        {/* Statistiques */}
        {insights && (
          <StatsGrid 
            insights={insights}
            lastTwoRuns={lastTwoRuns}
          />
        )}
      </div>
    </div>
  );
};

export default RunningStats;