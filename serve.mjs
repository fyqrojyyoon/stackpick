import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';

const PORT = 4000;
const ROOT = join(import.meta.dirname, 'dist');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
};

createServer((req, res) => {
  let path = join(ROOT, decodeURIComponent(req.url));
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path)) { res.writeHead(404); res.end('Not Found'); return; }
  const ext = extname(path);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  res.end(readFileSync(path));
}).listen(PORT, '127.0.0.1', () => {
  console.log(`StackPick running at http://127.0.0.1:${PORT}`);
});
