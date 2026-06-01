// Fallback messages shown when a day has no agenda items.

const EMPTY_MESSAGES = [
  { future: 'Free day', today: 'This is a free day, enjoy!' },
  { future: 'Goof off day', today: 'Today, you get to goof off!' },
  { future: 'Day off', today: 'Take the day off!' },
  { future: 'No plans', today: 'No plans today, do what you want!' },
  { future: 'Nothing to do', today: 'Nothing to do today, relax!' },
];

// Indexed by day-of-month (1-31), so the same date always shows the same
// message. Repeat the base list until every day of the month is covered.
const messagesByDay = [];
while (messagesByDay.length < 31) {
  messagesByDay.push(...EMPTY_MESSAGES);
}

export function getEmptyDayMessage(date) {
  return messagesByDay[date.getDate()];
}
