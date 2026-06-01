// Renders the app's { content, style } text-part arrays into a <span>.

import { applyStyles } from './dom.js';

export function renderTextArray(textArray) {
  const span = document.createElement('span');
  if (!textArray || !Array.isArray(textArray)) return span;

  for (const item of textArray) {
    const part = document.createElement('span');
    part.textContent = item.content || '';
    applyStyles(part, item.style);
    span.appendChild(part);
  }
  return span;
}
