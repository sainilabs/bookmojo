// Temporary: measure visible prose on the page. Removed after use.
import { renderToString } from 'react-dom/server';
import App from './src/App';

const html = renderToString(<App />);

// Strip tags, then strip runs of non-letters, to approximate what a visitor reads.
const text = html
  .replace(/<(script|style)[\s\S]*?<\/\1>/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const words = text.split(' ').filter((w) => /[a-zA-Z\u0900-\u097F]/.test(w));
console.log(`visible words on first render: ${words.length}`);
console.log(`characters: ${text.length}`);
