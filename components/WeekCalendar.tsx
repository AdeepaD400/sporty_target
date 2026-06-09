"use client";

import { useMemo, useState } from "react";
import {
  CALENDAR_END_HOUR,
  CALENDAR_START_HOUR,
  formatDayHeader,
  formatTime12,
  formatWeekRange,
  getBlockStyle,
  getHourLabels,
  getWeekDays,
  HOUR_HEIGHT_PX,
  snapTimeToHour,
  startOfWeek,
  toDateString,
} from "@/lib/date-utils";
import type { PracticeSlot, Sport } from "@/lib/types";

type WeekCalendarProps = {
  sports: Sport[];
  practices: PracticeSlot[];
  onAddClick: (date: string, startTime: string) => void;
  onEditClick: (practice: PracticeSlot) => void;
};

export function WeekCalendar({ sports, practices, onAddClick, onEditClick }: WeekCalendarProps) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const hourLabels = useMemo(() => getHourLabels(), []);
  const totalHeight = (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * HOUR_HEIGHT_PX;

  const sportMap = useMemo(() => new Map(sports.map((s) => [s.id, s])), [sports]);

  const practicesByDate = useMemo(() => {
    const map = new Map<string, PracticeSlot[]>();
    for (const p of practices) {
      const list = map.get(p.date) ?? [];
      list.push(p);
      map.set(p.date, list);
    }
    return map;
  }, [practices]);

  const goToPrevWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const goToNextWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const goToToday = () => setWeekStart(startOfWeek(new Date()));

  const handleCellClick = (date: Date, hour: number) => {
    onAddClick(toDateString(date), snapTimeToHour(hour));
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {formatWeekRange(weekStart)}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToPrevWeek}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Previous week"
          >
            ←
          </button>
          <button
            type="button"
            onClick={goToToday}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-teal-600 transition hover:bg-teal-50 dark:border-zinc-700 dark:text-teal-400 dark:hover:bg-teal-900/20"
          >
            Today
          </button>
          <button
            type="button"
            onClick={goToNextWeek}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Next week"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Day headers */}
          <div className="grid grid-cols-[52px_repeat(7,1fr)] border-b border-zinc-100 dark:border-zinc-800">
            <div className="border-r border-zinc-100 dark:border-zinc-800" />
            {weekDays.map((day) => {
              const { dayName, dayNum, isToday } = formatDayHeader(day);
              return (
                <div
                  key={toDateString(day)}
                  className={`border-r border-zinc-100 px-2 py-2 text-center last:border-r-0 dark:border-zinc-800 ${
                    isToday ? "bg-teal-50/60 dark:bg-teal-900/20" : ""
                  }`}
                >
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{dayName}</div>
                  <div
                    className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                      isToday
                        ? "bg-teal-600 text-white"
                        : "text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {dayNum}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-[52px_repeat(7,1fr)]">
            {/* Hour labels column */}
            <div className="relative border-r border-zinc-100 dark:border-zinc-800" style={{ height: totalHeight }}>
              {hourLabels.map((label, i) => (
                <div
                  key={label}
                  className="absolute right-2 -translate-y-1/2 text-[10px] text-zinc-400"
                  style={{ top: i * HOUR_HEIGHT_PX }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day) => {
              const dateStr = toDateString(day);
              const dayPractices = practicesByDate.get(dateStr) ?? [];
              const { isToday } = formatDayHeader(day);

              return (
                <div
                  key={dateStr}
                  className={`relative border-r border-zinc-100 last:border-r-0 dark:border-zinc-800 ${
                    isToday ? "bg-teal-50/30 dark:bg-teal-900/10" : ""
                  }`}
                  style={{ height: totalHeight }}
                >
                  {/* Hour grid lines + click targets */}
                  {Array.from({ length: CALENDAR_END_HOUR - CALENDAR_START_HOUR }, (_, i) => {
                    const hour = CALENDAR_START_HOUR + i;
                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => handleCellClick(day, hour)}
                        className="calendar-hour-cell absolute left-0 right-0 border-t border-zinc-100 transition hover:bg-teal-50/50 dark:border-zinc-800/80 dark:hover:bg-teal-900/20"
                        style={{
                          top: i * HOUR_HEIGHT_PX,
                          height: HOUR_HEIGHT_PX,
                        }}
                        aria-label={`Add practice on ${dateStr} at ${snapTimeToHour(hour)}`}
                      />
                    );
                  })}

                  {/* Practice blocks */}
                  {dayPractices.map((practice) => {
                    const sport = sportMap.get(practice.sportId);
                    if (!sport) return null;

                    const { top, height } = getBlockStyle(practice.startTime, practice.endTime);

                    return (
                      <button
                        key={practice.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick(practice);
                        }}
                        className="practice-block absolute left-1 right-1 z-10 overflow-hidden rounded-lg border-l-[3px] bg-white/95 px-2 py-1 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-zinc-800/95"
                        style={{
                          top,
                          height,
                          borderLeftColor: sport.color,
                        }}
                      >
                        <div className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {sport.name}
                        </div>
                        <div className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                          {formatTime12(practice.startTime)} – {formatTime12(practice.endTime)}
                        </div>
                        {practice.location && height > 40 && (
                          <div className="truncate text-[10px] text-zinc-400">{practice.location}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
