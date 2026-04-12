/*
Profile Stats Component
Displays user fitness statistics and KPI cards
Shows starting weight, current weight, goal, and progress metrics
*/

import React from 'react';

// Replaced faulty third-party countup with stable native animation to prevent ESM object crash
const CountUp = ({ end, decimals = 0, duration = 2, suffix = "" }) => {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    let startTimestamp = null;
    let animationFrame;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      // Use ease-out cubic for a premium smooth slowdown
      const progress = Math.min(
        (timestamp - startTimestamp) / (duration * 1000),
        1,
      );
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setValue(easeOut * end);
      if (progress < 1) animationFrame = window.requestAnimationFrame(step);
    };
    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return (
    <span>
      {Number(value.toFixed(decimals)).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

const ProfileStats = ({ profile, profileUi }) => {
  const renderWeight = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      Number.isNaN(Number(value))
    )
      return "--";
    return (
      <>
        <span className="metricNumberNew">
          <CountUp end={parseFloat(value)} decimals={1} duration={2} />
        </span>
        <span className="metricUnitNew">kg</span>
      </>
    );
  };

  return (
    <section className="kpiGridNewLayout">
      <article className="kpiNewCard">
        <span>{profileUi.kpi.starting}</span>
        <h4>{renderWeight(profile.startingWeight)}</h4>
      </article>
      <article className="kpiNewCard">
        <span>{profileUi.kpi.current}</span>
        <h4>{renderWeight(profile.weight)}</h4>
      </article>
      <article className="kpiNewCard">
        <span>{profileUi.kpi.goal}</span>
        <h4>{renderWeight(profile.goal)}</h4>
      </article>
      <article className="kpiNewCard">
        <span>{profileUi.kpi.bmi}</span>
        <h4>{profile.bmi || "--"}</h4>
      </article>
    </section>
  );
};

export default ProfileStats;
