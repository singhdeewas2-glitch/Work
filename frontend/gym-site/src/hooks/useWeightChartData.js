import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchWeightSeries } from '../services/weightService';
import { normalizeChartRows, toStrictChartRows } from '../services/chartService';
import { handleApiError } from '../config/apiConfig';

/**
 * Groups ~30 day month array into exactly 4 segments.
 * Resolves the last valid weight of that segment for the plot.
 */
const groupMonthIntoWeeks = (normalizedData) => {
  const weeks = [
    { name: 'Week 1', weights: [] },
    { name: 'Week 2', weights: [] },
    { name: 'Week 3', weights: [] },
    { name: 'Week 4', weights: [] }
  ];
  
  normalizedData.forEach((d, i) => {
    const w = d.weight;
    if (w != null && !isNaN(Number(w))) {
      const day = i + 1;
      if (day <= 7) weeks[0].weights.push(Number(w));
      else if (day <= 14) weeks[1].weights.push(Number(w));
      else if (day <= 21) weeks[2].weights.push(Number(w));
      else weeks[3].weights.push(Number(w));
    }
  });

  return weeks.map(w => {
    // Return last logged weight for the week segment, or null if empty
    const val = w.weights.length > 0 ? w.weights[w.weights.length - 1] : null;
    return { name: w.name, weight: val };
  });
};

export function useWeightChartData(getValidToken, timeView) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getValidToken();
      if (!token) {
        setLoading(false);
        return;
      }
      
      const data = await fetchWeightSeries(token, timeView);
      
      if (!Array.isArray(data)) {
        setChartData([]);
      } else {
        // Backend passes ordered data. Clean it first to standard chart objects
        const normalized = normalizeChartRows(timeView, data);
        const strictData = toStrictChartRows(normalized);
        
        let finalData = strictData;

        // Custom timeView parsers
        if (timeView === 'month') {
          finalData = groupMonthIntoWeeks(strictData);
        }

        setChartData(finalData);
        setError(null);
      }
    } catch (err) {
      const errorResult = handleApiError(err);
      console.error('Weight chart data fetch error:', errorResult.error);
      
      setChartData([]);
      setError(errorResult.error || 'Failed to load weight data');
    } finally {
      setLoading(false);
    }
  }, [getValidToken, timeView]);

  const validationResults = useMemo(() => {
    const validCount = chartData.filter(d => d.weight != null && !isNaN(Number(d.weight))).length;
    return {
      hasData: chartData.length > 0,
      hasRealData: validCount > 0,
      isEmpty: validCount === 0,
      entryCount: validCount
    };
  }, [chartData]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { 
    chartData, 
    refetchChart: refetch, 
    loading,
    error,
    ...validationResults
  };
}
