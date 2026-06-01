// Agenda data shaping.

import { hasTime } from './datetime.js';

// Group agenda items by calendar day, dropping past days and items whose
// `showAfter` date has not yet arrived. Returns groups sorted by date, each
// with its items sorted by time.
export function groupAgendaByDay(agenda) {
  const groups = new Map();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const item of agenda) {
    const date = new Date(item.date);
    if (date < today) {
      continue;
    }

    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (!groups.has(dayKey)) {
      groups.set(dayKey, { date, items: [] });
    }
    if (item.showAfter) {
      const showAfter = new Date(item.showAfter);
      if (showAfter > today) {
        continue;
      }
    }
    groups.get(dayKey).items.push({
      ...item,
      dateObj: date,
      allDay: !hasTime(date),
    });
  }

  // Sort groups by date, then items within each group by time.
  const sorted = Array.from(groups.values()).sort((a, b) => a.date - b.date);
  for (const group of sorted) {
    group.items.sort((a, b) => a.dateObj - b.dateObj);
  }
  return sorted;
}
