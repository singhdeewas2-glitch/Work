/*
Weight Area Chart Component
Displays user weight progress over time using Recharts library
Handles responsive design and custom tooltips for weight tracking data
Used in Profile page to visualize fitness progress
*/

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  if (!p || p.weight == null) return null;
  return (
    <div className="chart-tooltip-card">
      <div className="chart-tooltip-label">{p.name}</div>
      <div className="chart-tooltip-value">{Number(p.weight).toFixed(1)} kg</div>
    </div>
  );
}

/**
 * Strict user-logged weights only: nulls in the series, straight segments between real points
 * (connectNulls bridges gaps without inventing Y values). Dots only on logged days.
 */
export default function WeightAreaChart({
  chartData,
  timeView,
  rawEntryCount,
  shouldRenderLine,
  chartInnerMinWidth,
}) {
  // Responsive dimensions based on time view
  const getChartHeight = () => {
    switch (timeView) {
      case 'week':
        return 280;
      case 'month':
        return 320;
      case 'year':
        return 260;
      default:
        return 280;
    }
  };

  // Responsive margins based on time view
  const getChartMargin = () => {
    switch (timeView) {
      case 'week':
        return { top: 12, right: 12, left: 4, bottom: 8 };
      case 'month':
        return { top: 12, right: 12, left: 4, bottom: 12 };
      case 'year':
        return { top: 12, right: 12, left: 4, bottom: 4 };
      default:
        return { top: 12, right: 12, left: 4, bottom: 4 };
    }
  };

  // Custom tick function for different time views
  const getXAxisTick = (value, index) => {
    if (timeView === 'week') {
      // Show all 7 days for week view
      return value;
    } else if (timeView === 'month') {
      // Show every 3rd day for month view to avoid crowding
      return index % 3 === 0 ? value : '';
    } else if (timeView === 'year') {
      // Show all months for year view
      return value;
    }
    return value;
  };

  // Custom X-axis configuration for better responsiveness
  const getXAxisConfig = () => {
    const baseConfig = {
      dataKey: 'name',
      stroke: '#5f6375',
      tick: getXAxisTick,
      interval: 0,
      minTickGap: 0,
      tickLine: false,
      axisLine: false,
      tickMargin: 8,
      padding: { left: 8, right: 8 },
    };

    if (timeView === 'week') {
      return {
        ...baseConfig,
        height: 36,
        tick: { fontSize: 11, fill: '#a1a1aa' },
      };
    } else if (timeView === 'month') {
      return {
        ...baseConfig,
        height: 40,
        tick: { fontSize: 10, fill: '#a1a1aa' },
      };
    } else if (timeView === 'year') {
      return {
        ...baseConfig,
        height: 32,
        tick: { fontSize: 11, fill: '#a1a1aa' },
      };
    }
    return baseConfig;
  };

  return (
    <div className="dashboardGraphWrapperFluid">
      <div
        className="dashboardGraphScrollInner"
        style={chartInnerMinWidth ? { minWidth: `${chartInnerMinWidth}px` } : undefined}
      >
        <div className="dashboardGraphBodyNew">
          <ResponsiveContainer width="100%" height={getChartHeight()}>
            <LineChart data={chartData} margin={getChartMargin()}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" strokeDasharray="4 6" vertical={false} />
              <XAxis {...getXAxisConfig()} />
              <YAxis
                stroke="#5f6375"
                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={[(dataMin) => Math.max(0, Math.floor(dataMin - 2)), (dataMax) => Math.ceil(dataMax + 2)]}
                width={40}
              />
              {rawEntryCount > 0 && <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.08)' }} content={<ChartTooltip />} />}
              <Line
                type="monotone"
                connectNulls
                dataKey="weight"
                stroke={shouldRenderLine ? '#ef4444' : 'transparent'}
                strokeWidth={2.5}
                dot={(props) =>
                  props?.payload?.weight == null ? null : (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={6}
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="#0b0b0f"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.65))' }}
                    />
                  )
                }
                activeDot={(props) =>
                  props?.payload?.weight == null ? null : (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={8}
                      fill="#ef4444"
                      stroke="#fff"
                      strokeWidth={2}
                      style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.7))' }}
                    />
                  )
                }
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
