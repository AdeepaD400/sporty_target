export const CALENDAR_START_HOUR = 6;
export const CALENDAR_END_HOUR = 22;
export const HOUR_HEIGHT_PX = 60;

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function parseDateString(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
}

export function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startMonth = MONTH_NAMES[weekStart.getMonth()];
  const endMonth = MONTH_NAMES[weekEnd.getMonth()];

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${startMonth} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
  }

  return `${startMonth} ${weekStart.getDate()} – ${endMonth} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;
}

export function formatDayHeader(date: Date): { dayName: string; dayNum: number; isToday: boolean } {
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  return {
    dayName: DAY_NAMES[date.getDay()],
    dayNum: date.getDate(),
    isToday,
  };
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

export function formatTime12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${pad2(m)} ${period}`;
}

export function getBlockStyle(startTime: string, endTime: string): { top: number; height: number } {
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);
  const calendarStartMin = CALENDAR_START_HOUR * 60;

  const top = ((startMin - calendarStartMin) / 60) * HOUR_HEIGHT_PX;
  const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT_PX, 24);

  return { top, height };
}

export function getHourLabels(): string[] {
  const labels: string[] = [];
  for (let h = CALENDAR_START_HOUR; h <= CALENDAR_END_HOUR; h++) {
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    labels.push(`${hour12} ${period}`);
  }
  return labels;
}

export function practicesOverlap(
  a: { date: string; startTime: string; endTime: string; id?: string },
  b: { date: string; startTime: string; endTime: string; id?: string }
): boolean {
  if (a.date !== b.date) return false;
  if (a.id && b.id && a.id === b.id) return false;

  const aStart = timeToMinutes(a.startTime);
  const aEnd = timeToMinutes(a.endTime);
  const bStart = timeToMinutes(b.startTime);
  const bEnd = timeToMinutes(b.endTime);

  return aStart < bEnd && bStart < aEnd;
}

export function isEndAfterStart(startTime: string, endTime: string): boolean {
  return timeToMinutes(endTime) > timeToMinutes(startTime);
}

export function snapTimeToHour(hour: number): string {
  return `${pad2(hour)}:00`;
}
