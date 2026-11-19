// Redirect stubs for languages that were dropped (19.11.2026): /cs/aok/ -> /aok/ and so on.
//   node tools/gen-redirects.mjs
// Old links, bookmarks and search results keep working and point search engines at the English page.
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = new URL('..', import.meta.url).pathname;
const BASE = 'https://mordansoft.com';
const DEAD = ['cs', 'sk', 'be', 'bg', 'hr', 'sr', 'sl', 'kk', 'id'];
const PAGES = ['', 'aok/', 'sloviko/', 'services/app-data-review/', 'saltcure/'];
const stub = (target) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MordanSoft</title>
<link rel="canonical" href="${BASE}${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
<style>body{font:16px/1.5 system-ui,sans-serif;margin:3rem 1.25rem;color:#2a2622;background:#faf8f5}a{color:#c4531a}</style>
</head>
<body>
<p>This page is available in English: <a href="${target}">mordansoft.com${target}</a></p>
</body>
</html>
`;
let n = 0;
for (const l of DEAD) for (const p of PAGES) {
  const dir = `${ROOT}${l}/${p}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}index.html`, stub(`/${p}`));
  n++;
}
writeFileSync(`${ROOT}404.html`, `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page not found — MordanSoft</title>
<meta name="robots" content="noindex">
<style>body{font:16px/1.5 system-ui,sans-serif;margin:4rem 1.25rem;color:#2a2622;background:#faf8f5;max-width:34rem}h1{font-size:1.5rem}a{color:#c4531a}</style>
</head>
<body>
<h1>This page does not exist</h1>
<p>The link may be old. Start from the <a href="/">MordanSoft home page</a> or open one of our apps: <a href="/aok/">AoK</a>, <a href="/saltcure/">SaltCure</a>, <a href="/sloviko/">Sloviko</a>, <a href="/rowline/">Rowline</a>.</p>
</body>
</html>
`);
console.log(`${n} redirect stubs for ${DEAD.length} dropped languages + 404.html`);
