// Small DOM construction helpers.

export function applyStyles(element, styleObj) {
  if (!styleObj) return;
  for (const [key, value] of Object.entries(styleObj)) {
    element.style[key] = value;
  }
}

// Concise element builder.
//   el('div', { className: 'x', text: 'hi', style: { color: 'red' } }, [child])
// children may be nodes, strings, or null (skipped). A single child need not
// be wrapped in an array.
export function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.className) node.className = opts.className;
  if (opts.text != null) node.textContent = opts.text;
  applyStyles(node, opts.style);
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(
      typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}
