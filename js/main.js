// Entry point: initial load, then periodic refresh of content and data.

import { JSON_REFETCH_MS, CONTENT_REFRESH_MS } from './config.js';
import { fetchData, getCachedData } from './data.js';
import { render } from './render.js';

async function init() {
  const data = await fetchData();
  render(data);

  // Full page reload at 4am daily to pick up new code.
  const nextPageReload = new Date();
  if (nextPageReload.getHours() >= 4) {
    nextPageReload.setDate(nextPageReload.getDate() + 1);
  }
  nextPageReload.setHours(4, 0, 0, 0);

  let lastDataLoad = new Date();

  // Re-render every minute from cached data; refetch JSON less often.
  setInterval(() => {
    if (Date.now() > nextPageReload.getTime()) {
      location.reload();
    } else {
      render(getCachedData());
    }
    if (Date.now() > lastDataLoad.getTime() + JSON_REFETCH_MS) {
      fetchData();
      lastDataLoad = new Date();
    }
  }, CONTENT_REFRESH_MS);
}

init();
