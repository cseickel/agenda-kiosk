// Pure date/time formatting and comparison helpers.

import { MONTHS } from './constants.js';

export function formatDate(date) {
  const month = MONTHS[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();
  return `${month} ${d}, ${y}`;
}

export function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minStr = minutes.toString().padStart(2, '0');
  return `${hours}:${minStr} ${ampm}`;
}

// Human countdown until an event, or null if it has already started.
export function getCountdown(eventDate, now) {
  const diffMs = eventDate - now;
  if (diffMs <= 0) return null;

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.round(diffMins / 60);
  if (diffMins < 60 && diffHours <= 1) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  }
  return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
}

// Calendar-day distance: "Today", "Tomorrow", or "N days from now".
export function getDaysAway(eventDate, today) {
  const eventDay = new Date(
    eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  const todayDay = new Date(
    today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((eventDay - todayDay) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `${diffDays} days from now`;
}

export function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

// True if the date carries a meaningful time (not midnight / all-day).
export function hasTime(date) {
  return date.getHours() !== 0 || date.getMinutes() !== 0;
}
