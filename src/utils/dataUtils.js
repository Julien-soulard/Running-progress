import _ from 'lodash';
import Papa from 'papaparse';

const loadRawData = async () => {
  try {
    // Utiliser un chemin relatif au repo GitHub
    const BASE_URL = import.meta.env.PROD ? '/Running-progress' : '';
    const response = await fetch(`${BASE_URL}/running_data.csv`);
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        delimiter: '\t',
        dynamicTyping: false,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error('Erreurs lors de la lecture du CSV:', results.errors);
          }
          resolve(results.data);
        },
        error: (error) => {
          console.error('Erreur lors du parsing du CSV:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier:', error);
    throw error;
  }
};

export const parseTime = (timeStr) => {
  try {
    const [hours, minutes, seconds] = timeStr.trim().split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
  } catch (error) {
    console.error('Erreur parsing temps:', timeStr, error);
    return 0;
  }
};

export const parsePace = (paceStr) => {
  try {
    if (!paceStr) return 0;
    const cleanPace = paceStr.trim();
    if (cleanPace.length < 5) return 0;
    
    const timeStr = cleanPace.slice(-5);
    const [minutes, seconds] = timeStr.split(':').map(Number);
    
    if (isNaN(minutes) || isNaN(seconds)) return 0;
    return minutes + seconds / 60;
  } catch (error) {
    console.error('Erreur parsing allure:', paceStr, error);
    return 0;
  }
};

export const formatPace = (pace) => {
  if (!pace) return "0:00";
  
  const totalSeconds = Math.round(pace * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const parseRow = (row) => {
  try {
    const cleanedRow = {};
    Object.keys(row).forEach(key => {
      cleanedRow[key.trim()] = row[key];
    });

    const date = cleanedRow['Date'];
    const distance = cleanedRow['Distance (km)'];
    const time = cleanedRow['Temps'];
    const pace = cleanedRow['Allure (min/km)'];

    if (!date || !distance || !time || !pace) {
      return null;
    }

    const [day, month, year] = date.trim().split('/');
    const parsedDistance = parseFloat(distance.replace(',', '.'));
    const timeInMinutes = parseTime(time);
    const paceInMinutes = parsePace(pace);

    return {
      date: new Date(year, month - 1, day),
      distance: parsedDistance,
      timeInMinutes,
      paceInMinutes
    };
  } catch (error) {
    console.error('Erreur parsing ligne:', row, error);
    return null;
  }
};

const aggregateData = (data, groupBy) => {
  switch (groupBy) {
    case 'week': {
      return _(data)
        .groupBy(d => {
          const week = getWeekNumber(d.date);
          const year = d.date.getFullYear();
          return `${year}-W${week.toString().padStart(2, '0')}`;
        })
        .map((runs, key) => {
          const totalDistance = _.sumBy(runs, 'distance');
          const totalTime = _.sumBy(runs, 'timeInMinutes');
          return {
            date: _.minBy(runs, 'date').date,
            distance: totalDistance,
            timeInMinutes: totalTime,
            paceInMinutes: totalTime / totalDistance
          };
        })
        .value();
    }
    case 'month': {
      return _(data)
        .groupBy(d => {
          const year = d.date.getFullYear();
          const month = d.date.getMonth() + 1;
          return `${year}-${month.toString().padStart(2, '0')}`;
        })
        .map((runs, key) => {
          const totalDistance = _.sumBy(runs, 'distance');
          const totalTime = _.sumBy(runs, 'timeInMinutes');
          return {
            date: _.minBy(runs, 'date').date,
            distance: totalDistance,
            timeInMinutes: totalTime,
            paceInMinutes: totalTime / totalDistance
          };
        })
        .value();
    }
    default:
      return data;
  }
};

export const processData = async (groupBy = 'day') => {
  try {
    const rawData = await loadRawData();
    
    if (!rawData || rawData.length === 0) {
      return [];
    }

    const dailyData = rawData
      .map(parseRow)
      .filter(Boolean)
      .sort((a, b) => a.date - b.date);
    
    return aggregateData(dailyData, groupBy);
  } catch (error) {
    console.error('Erreur dans processData:', error);
    return [];
  }
};

export const calculateInsights = async () => {
  try {
    const rawData = await loadRawData();
    if (!rawData || rawData.length === 0) {
      return {
        totalRuns: 0,
        totalDistance: 0,
        bestPace: 0,
        longestRun: 0
      };
    }
    
    const data = rawData
      .map(parseRow)
      .filter(Boolean);
    
    const totalRuns = data.length;
    const totalDistance = _.sumBy(data, 'distance');
    const bestPace = _.minBy(data, 'paceInMinutes');
    const longestRun = _.maxBy(data, 'distance');

    return {
      totalRuns,
      totalDistance,
      bestPace: bestPace ? bestPace.paceInMinutes : 0,
      longestRun: longestRun ? longestRun.distance : 0
    };
  } catch (error) {
    console.error('Erreur dans calculateInsights:', error);
    return {
      totalRuns: 0,
      totalDistance: 0,
      bestPace: 0,
      longestRun: 0
    };
  }
};