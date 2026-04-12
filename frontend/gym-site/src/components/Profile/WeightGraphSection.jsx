/*
Weight Graph Section Component
Handles weight tracking chart display and controls
Provides time range selection and insight generation
*/

import React from 'react';
import WeightAreaChart from '../charts/WeightAreaChart';

const WeightGraphSection = ({ 
  chartData, 
  timeView, 
  setTimeView, 
  profile, 
  profileUi, 
  chartConfig 
}) => {
  const getInsightText = () => {
    if (!profile.startingWeight || !profile.weight) return null;
    
    const diff = parseFloat(profile.startingWeight) - parseFloat(profile.weight);

    if (diff > 5)
      return (
        <span>
          Incredible momentum. You've lost{" "}
          <strong className="highlightWhite">
            {diff.toFixed(1)} kg
          </strong>{" "}
          since starting!
        </span>
      );
    if (diff > 0)
      return (
        <span>
          Consistent progress. You lost{" "}
          <strong className="highlightWhite">
            {diff.toFixed(1)} kg
          </strong>{" "}
          - keep going!
        </span>
      );
    if (diff === 0)
      return (
        <span>
          Weight is stabilizing. Plateaus are a normal part of the process.
        </span>
      );
    return (
      <span>
        Your mass increased by{" "}
        <strong className="highlightWhite">
          {Math.abs(diff).toFixed(1)} kg
        </strong>
        . Adjust your routine to get back on track.
      </span>
    );
  };

  return (
    <section className="dashboardGraphSectionNew">
      <div className="dashboardGraphHeaderNew">
        <h2>{profileUi.chartTitle}</h2>
        <div className="dashboardGraphTimeButtonsNew">
          <button
            type="button"
            className={timeView === "week" ? "active" : ""}
            onClick={() => setTimeView("week")}
          >
            {profileUi.rangeWeek}
          </button>
          <button
            type="button"
            className={timeView === "month" ? "active" : ""}
            onClick={() => setTimeView("month")}
          >
            {profileUi.rangeMonth}
          </button>
          <button
            type="button"
            className={timeView === "year" ? "active" : ""}
            onClick={() => setTimeView("year")}
          >
            {profileUi.rangeYear}
          </button>
        </div>
      </div>

      <WeightAreaChart
        chartData={chartData}
        timeView={timeView}
        rawEntryCount={chartConfig.rawEntryCount}
        shouldRenderLine={chartConfig.shouldRenderLine}
        chartInnerMinWidth={chartConfig.chartInnerMinWidth}
        xAxisTick={chartConfig.xAxisTick}
        emptyMessage={profileUi.chartEmpty}
      />

      {/* Placed insight completely below the graph logic per UX parameters */}
      {getInsightText() && (
        <div className="dashboardGraphInsightSubCardNew">
          <p>{getInsightText()}</p>
        </div>
      )}
    </section>
  );
};

export default WeightGraphSection;
