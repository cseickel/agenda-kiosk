// Deployment + timing configuration.

// Google Apps Script deployment that serves the agenda JSON.
export const DEPLOYMENT_ID =
  'AKfycbz6wmtsa31IYSTqvP42Uq_Rg0Q6rKdsnWsPyNhsfDAswMf9_niRDlsQIjo1XyIIEbqt3w';

// How often to refetch the source JSON.
export const JSON_REFETCH_MS = 5 * 60 * 1000;

// How often to re-render from cached data (updates clock + countdowns).
export const CONTENT_REFRESH_MS = 60 * 1000;

// Number of days to display, starting with today.
export const MAX_DAYS = 2;
