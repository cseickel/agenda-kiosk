// Rendering: turns agenda data into DOM.

import { MAX_DAYS } from './config.js';
import { DAYS } from './constants.js';
import {
  formatDate, formatTime, getCountdown, getDaysAway, isSameDay,
} from './datetime.js';
import { el } from './dom.js';
import { renderTextArray } from './text-array.js';
import { getEmptyDayMessage } from './empty-messages.js';
import { groupAgendaByDay } from './agenda.js';

// Populate the left-hand messages sidebar (cleared each render).
function renderMessages(data) {
  const container = document.getElementById('messages-container');
  container.innerHTML = '';
  if (!data.messages || data.messages.length === 0) return;

  container.appendChild(
    el('span', { className: 'message-header', text: 'Messages' }));
  for (const msg of data.messages) {
    container.appendChild(
      el('div', { className: 'message-item' }, [renderTextArray(msg.text)]));
  }
  // Spacer fills remaining vertical space.
  container.appendChild(el('div', { style: { flexGrow: '1' } }));
}

// Today's date header + live clock.
function renderTodayBlock(now) {
  const header = el('div', { className: 'day-header' }, [
    el('span', { className: 'date-block', text: 'Today is ' }),
    el('span', { className: 'today-name', text: `${DAYS[now.getDay()]} ` }),
    el('span', { className: 'date-block', text: formatDate(now) }),
  ]);
  const time = el('span', { className: 'time-block', text: formatTime(now) });
  return el('div', {
    className: 'today-container',
    style: { borderTop: 'none', marginTop: '0' },
  }, [header, time]);
}

// Today's agenda: future (and all-day) items, with countdown + time.
function renderTodayAgenda(group, now) {
  const agenda = el('div', { className: 'agenda' });
  const futureItems = group.items.filter(
    item => item.dateObj.getTime() > now.getTime() || item.allDay);

  if (futureItems.length === 0) {
    agenda.appendChild(el('div', {
      className: 'agenda-item',
      text: getEmptyDayMessage(group.date).today,
    }));
    return agenda;
  }

  for (const item of futureItems) {
    const itemDiv = el('div', { className: 'agenda-item' });
    if (item.allDay) {
      itemDiv.appendChild(renderTextArray(item.text));
    } else {
      const countdown = getCountdown(item.dateObj, now);
      if (countdown) {
        itemDiv.appendChild(el('span', {
          className: 'agenda-item-countdown',
          text: `${countdown} from now → `,
        }));
      }
      itemDiv.appendChild(renderTextArray(item.text));
      itemDiv.appendChild(el('span', {
        className: 'agenda-item-time',
        text: ` at ${formatTime(item.dateObj)}`,
      }));
    }
    agenda.appendChild(itemDiv);
  }
  return agenda;
}

// A future day's agenda: item text only.
function renderFutureAgenda(group) {
  const agenda = el('div', { className: 'agenda' });
  if (group.items.length === 0) {
    agenda.appendChild(el('div', {
      className: 'agenda-item',
      text: getEmptyDayMessage(group.date).future,
    }));
    return agenda;
  }
  for (const item of group.items) {
    agenda.appendChild(
      el('div', { className: 'agenda-item' }, [renderTextArray(item.text)]));
  }
  return agenda;
}

// One day block: header (days-away + day name) plus its agenda. Later days
// shrink and fade slightly and indent inward.
function renderDayBlock(group, index, now) {
  const scale = 1.0 - (index * 0.02);
  const opacity = Math.pow(0.9, index);

  const rawDaysAway = getDaysAway(group.date, now);
  const daysAway =
    rawDaysAway === 'Today' ? "What's Happening Today" : rawDaysAway;

  const header = el('div', { className: 'day-header' }, [
    el('span', { className: 'days-away', text: daysAway }),
    el('span', { className: 'day-name', text: DAYS[group.date.getDay()] }),
  ]);

  const agenda = isSameDay(group.date, now)
    ? renderTodayAgenda(group, now)
    : renderFutureAgenda(group);

  return el('div', {
    className: 'day-block',
    style: {
      fontSize: `${scale}em`,
      opacity,
      marginLeft: `${index * 3}%`,
      marginRight: `${index * 3}%`,
    },
  }, [header, agenda]);
}

// Top-level render. Swaps the agenda column in a single operation to avoid
// flicker.
export function render(data) {
  const container = document.getElementById('app');
  if (!data) {
    container.innerHTML = '<p style="font-size:24px;">Loading agenda...</p>';
    return;
  }

  renderMessages(data);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const agendaGroups = groupAgendaByDay(data.agenda || []);

  // Build MAX_DAYS consecutive days starting today, attaching matching items.
  const relevantGroups = [];
  for (let i = 0; i < MAX_DAYS; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(dayDate.getDate() + i);
    const existing = agendaGroups.find(g => isSameDay(g.date, dayDate));
    relevantGroups.push({
      date: dayDate,
      items: existing ? existing.items : [],
    });
  }

  const fragment = document.createDocumentFragment();
  fragment.appendChild(renderTodayBlock(now));
  relevantGroups.forEach((group, index) => {
    fragment.appendChild(renderDayBlock(group, index, now));
  });

  container.innerHTML = '';
  container.appendChild(fragment);
}
