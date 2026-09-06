import { createReadStream, readFileSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";

const host = "127.0.0.1";
const port = 4322;
const root = resolve(".vercel/output/static");
const outputConfig = JSON.parse(readFileSync(resolve(".vercel/output/config.json"), "utf8"));
const filesystemBoundary = outputConfig.routes.findIndex((route) => route.handle === "filesystem");
const redirectRoutes = filesystemBoundary < 0 ? outputConfig.routes : outputConfig.routes.slice(0, filesystemBoundary);
const redirects = redirectRoutes.flatMap((route) =>
  route.status >= 300 && route.status < 400 && route.headers?.Location
    ? [{ location: route.headers.Location, pattern: new RegExp(route.src), status: route.status }]
    : [],
);
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

function redirectLocation(pathname, search, redirect) {
  const location = pathname.replace(redirect.pattern, redirect.location);
  if (!search || location.includes("?")) return location;
  const hashIndex = location.indexOf("#");
  return hashIndex < 0
    ? `${location}${search}`
    : `${location.slice(0, hashIndex)}${search}${location.slice(hashIndex)}`;
}

async function resolveFile(pathname) {
  const candidate = resolve(root, `.${pathname}`);
  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) return;

  try {
    const file = await stat(candidate);
    if (file.isDirectory()) {
      const indexFile = join(candidate, "index.html");
      try {
        if ((await stat(indexFile)).isFile()) return indexFile;
      } catch {
        return;
      }
    }
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
    const url = new URL(request.url ?? "/", `http://${host}`);
    const redirect = redirects.find(({ pattern }) => pattern.test(url.pathname));
    if (redirect) {
      response.writeHead(redirect.status, { Location: redirectLocation(url.pathname, url.search, redirect) }).end();
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      response.writeHead(400).end("Bad request");
      return;
    }
    const file = await resolveFile(pathname);
    if (!file) {
      response.writeHead(404).end("Not found");
      return;
    }

    if (request.method === "HEAD") {
      response.writeHead(200, {
        "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream",
      });
      response.end();
      return;
    }

    const stream = createReadStream(file);
    stream.on("error", (error) => {
      console.error(error);
      if (response.headersSent) response.destroy();
      else
        response
          .writeHead(error.code === "ENOENT" ? 404 : 500)
          .end(error.code === "ENOENT" ? "Not found" : "Internal server error");
    });
    stream.on("open", () => {
      response.writeHead(200, {
        "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream",
      });
      stream.pipe(response);
    });
  } catch (error) {
    console.error(error);
    response.writeHead(500).end("Internal server error");
  }
});

server.listen(port, host, () => {
  console.log(`E2E server listening at http://${host}:${port}`);
});
