// Data fetching and caching.

import { DEPLOYMENT_ID } from './config.js';

let cachedData = null;

export function getCachedData() {
  return cachedData;
}

function getJsonUrl() {
  const params = new URLSearchParams(window.location.search);
  const data = params.get('data');
  if (data) {
    // Local development: JSON file specified in URL as ?data=file.json
    return data;
  }
  const sheetsData =
    `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec?format=json`;
  const draft = params.get('draft') ? '&draft=true' : '';
  return sheetsData + draft;
}

// Fetch the latest agenda JSON. On failure, log and return the last good
// data (or null if we never succeeded).
export async function fetchData() {
  const url = getJsonUrl();
  if (!url) {
    console.error('No data URL provided. Use ?data=path/to/file.json');
    return null;
  }
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    cachedData = await response.json();
    return cachedData;
  } catch (err) {
    console.error('Failed to fetch data:', err);
    return cachedData;
  }
}
