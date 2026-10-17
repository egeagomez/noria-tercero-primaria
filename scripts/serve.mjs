import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const host = '127.0.0.1';
const port = 4173;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

function inside(base, candidate) {
  const path = relative(base, candidate);
  return path === '' || (path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path));
}

function respond(request, response, status, message) {
  response.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(request.method === 'HEAD' ? undefined : message);
}

let realRoot;
try {
  realRoot = await realpath(root);
  if (!(await stat(realRoot)).isDirectory()) throw new Error('dist no es una carpeta.');
} catch (error) {
  console.error(`No se puede servir dist. Ejecuta primero npm run build. ${error.message}`);
  process.exit(1);
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    respond(request, response, 405, 'Método no permitido.');
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
    if (pathname.includes('\0')) throw new Error('Ruta no válida.');
  } catch {
    respond(request, response, 400, 'Ruta no válida.');
    return;
  }
  pathname = pathname.replace(/\\/g, '/');
  let target = resolve(root, pathname.replace(/^\/+/, ''));
  if (!inside(root, target)) {
    respond(request, response, 403, 'Acceso fuera del sitio no permitido.');
    return;
  }
  try {
    let info = await stat(target);
    if (info.isDirectory()) target = join(target, 'index.html');
    const actual = await realpath(target);
    if (!inside(realRoot, actual)) {
      respond(request, response, 403, 'Acceso fuera del sitio no permitido.');
      return;
    }
    info = await stat(actual);
    if (!info.isFile()) {
      respond(request, response, 404, 'Archivo no encontrado.');
      return;
    }
    response.writeHead(200, {
      'Content-Type': mime[extname(actual).toLowerCase()] || 'application/octet-stream',
      'Content-Length': info.size,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    const stream = createReadStream(actual);
    stream.on('error', error => response.destroy(error));
    stream.pipe(response);
  } catch (error) {
    const missing = error.code === 'ENOENT' || error.code === 'ENOTDIR';
    respond(request, response, missing ? 404 : 500, missing ? 'Archivo no encontrado.' : 'No se ha podido leer el archivo.');
  }
});

server.on('error', error => {
  console.error(`No se puede iniciar el servidor local: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, host, () => console.log(`La Noria está disponible en http://${host}:${port}`));
