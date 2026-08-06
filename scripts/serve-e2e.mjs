import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";

const host = "127.0.0.1";
const port = 4322;
const root = resolve(".vercel/output/static");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function resolveFile(pathname) {
  const candidate = resolve(root, `.${pathname}`);
  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) return;

  try {
    const file = await stat(candidate);
    if (file.isDirectory()) return join(candidate, "index.html");
    if (file.isFile()) return candidate;
  } catch {
    if (!extname(candidate)) {
      try {
        const htmlCandidate = `${candidate}.html`;
        if ((await stat(htmlCandidate)).isFile()) return htmlCandidate;
      } catch {
        return;
      }
    }
  }
}

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", `http://${host}`).pathname);
    const file = await resolveFile(pathname);
    if (!file) {
      response.writeHead(404).end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(file).pipe(response);
  } catch (error) {
    console.error(error);
    response.writeHead(500).end("Internal server error");
  }
});

server.listen(port, host, () => {
  console.log(`E2E server listening at http://${host}:${port}`);
});
