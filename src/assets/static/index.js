import mermaid from 'mermaid';

mermaid.initialize({
  maxEdges: Number.MAX_SAFE_INTEGER,
  maxTextSize: Number.MAX_SAFE_INTEGER,
  startOnLoad: true,
  theme: matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'default'
});
