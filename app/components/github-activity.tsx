"use client";

import { useEffect, useState } from "react";
import snapshot from "../data/contributions.json";

type Day = { date: string; count: number; level: number };

export default function GitHubActivity() {
  const [days, setDays] = useState<Day[]>(snapshot.contributions);
  useEffect(() => {
    const controller = new AbortController();
    fetch("https://github-contributions-api.jogruber.de/v4/thedittya471?y=last", { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Activity unavailable"); return response.json(); })
      .then(data => {
        if (Array.isArray(data.contributions) && data.contributions.length && data.contributions.every((day: Day) => /^\d{4}-\d{2}-\d{2}$/.test(day.date) && Number.isInteger(day.count) && day.count >= 0 && Number.isInteger(day.level) && day.level >= 0 && day.level <= 4)) {
          setDays(data.contributions);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const cells: (Day | null)[] = [...Array(offset).fill(null), ...days];
  const weeks = Math.ceil(cells.length / 7);
  const months = days.flatMap((day, index) => {
    if (index && day.date.slice(5, 7) === days[index - 1].date.slice(5, 7)) return [];
    const col = Math.floor((index + offset) / 7);
    if (col > weeks - 3) return [];
    return [{ col, label: new Date(`${day.date}T00:00:00Z`).toLocaleString("en", { month: "short", timeZone: "UTC" }), date: day.date }];
  });
  return (
    <div className="activity-body">
      <div className="heatmap-scroll" tabIndex={0} role="region" aria-label="GitHub contribution calendar, scroll horizontally to view all dates">
        <div className="heatmap" style={{ "--weeks": weeks } as React.CSSProperties}>
          <div className="heatmap-months">{months.map(month => <span key={month.date} style={{ gridColumn: month.col + 1 }}>{month.label}</span>)}</div>
          <div className="heatmap-grid">{cells.map((day, index) => <span key={day?.date ?? index} className={day ? `heat-cell level-${day.level}` : "heat-cell empty-cell"} title={day ? `${day.count} contributions on ${day.date}` : undefined} aria-label={day ? `${day.date}: ${day.count} contributions` : undefined} />)}</div>
        </div>
      </div>
      <div className="activity-footer"><a href="https://github.com/thedittya471" target="_blank" rel="noreferrer">{days.reduce((sum, day) => sum + day.count, 0).toLocaleString("en")} contributions in the last year</a><div className="heatmap-legend" aria-label="Contribution intensity from less to more"><span>Less</span>{[0, 1, 2, 3, 4].map(level => <i key={level} className={`heat-cell level-${level}`} />)}<span>More</span></div></div>
      <p className="activity-date">Through {days[days.length - 1].date}</p>
    </div>
  );
}
