const cache = new Map();

async function loadCodexIcons(iconNames) {
  const missing = iconNames.filter(name => !cache.has(name));
  if (missing.length) {
    const url = 'https://www.mediawiki.org/w/api.php?action=query&list=codexicons&format=json&origin=*' +
      '&names=' + encodeURIComponent(missing.join('|'));
    const res = await fetch(url);
    const data = await res.json();
    const map = data?.query?.codexicons || {};
    for (const key of Object.keys(map)) {
      const entry = map[key];
      const path = typeof entry === 'string' ? entry : (entry.ltr || entry.default || Object.values(entry.langCodeMap || {})[0] || '');
      if (path) {
        cache.set(key, path);
      }
    }
  }
  return iconNames.reduce((acc, name) => {
    if (cache.has(name)) {
      acc[name] = cache.get(name);
    }
    return acc;
  }, {});
}

export async function applyCodexIcons(root = document) {
  const nodes = Array.from(root.querySelectorAll('.cdx-icon[data-icon]'));
  if (!nodes.length) return;
  const names = Array.from(new Set(nodes.map(n => n.getAttribute('data-icon'))));
  try {
    const paths = await loadCodexIcons(names);
    nodes.forEach(node => {
      const name = node.getAttribute('data-icon');
      const path = paths[name];
      if (!path) return;
      node.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">' + path + '</svg>';
    });
  } catch (err) {
    console.warn('[icons] Failed to load Codex icons', err);
  }
}
