// Builds /aok/ in every language from tools/aok.template.html + i18n/aok/<lang>.mjs.
//   node tools/gen-aok.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const BASE = 'https://mordansoft.com';
const LANGS = [
  ['en', '', 'en_US', 'English', '🇬🇧'], ['uk', 'uk', 'uk_UA', 'Українська', '🇺🇦'], ['ru', 'ru', 'ru_RU', 'Русский', '🇷🇺'],
  ['pl', 'pl', 'pl_PL', 'Polski', '🇵🇱'], ['cs', 'cs', 'cs_CZ', 'Čeština', '🇨🇿'], ['sk', 'sk', 'sk_SK', 'Slovenčina', '🇸🇰'],
  ['be', 'be', 'be_BY', 'Беларуская', '🇧🇾'], ['bg', 'bg', 'bg_BG', 'Български', '🇧🇬'], ['hr', 'hr', 'hr_HR', 'Hrvatski', '🇭🇷'],
  ['sr', 'sr', 'sr_RS', 'Српски', '🇷🇸'], ['sl', 'sl', 'sl_SI', 'Slovenščina', '🇸🇮'], ['es', 'es', 'es_ES', 'Español', '🇪🇸'],
  ['it', 'it', 'it_IT', 'Italiano', '🇮🇹'], ['kk', 'kk', 'kk_KZ', 'Қазақша', '🇰🇿'], ['fr', 'fr', 'fr_FR', 'Français', '🇫🇷'],
  ['pt-BR', 'pt-br', 'pt_BR', 'Português (Brasil)', '🇧🇷'], ['tr', 'tr', 'tr_TR', 'Türkçe', '🇹🇷'], ['de', 'de', 'de_DE', 'Deutsch', '🇩🇪'],
  ['id', 'id', 'id_ID', 'Bahasa Indonesia', '🇮🇩'],
].map(([code, dir, og, name, flag]) => ({ code, dir, og, name, flag }));

const pathOf = (L) => `/${L.dir ? L.dir + '/' : ''}aok/`;
const urlOf = (L) => BASE + pathOf(L);
const tpl = readFileSync(`${ROOT}tools/aok.template.html`, 'utf8');
const EN = (await import('../i18n/aok/en.mjs')).default;
const live = LANGS.filter((L) => L.code === 'en' || existsSync(`${ROOT}i18n/aok/${L.code}.mjs`));

const alternates = [...live.map((L) => `  <link rel="alternate" hreflang="${L.code}" href="${urlOf(L)}">`),
  `  <link rel="alternate" hreflang="x-default" href="${urlOf(LANGS[0])}">`].join('\n');
const menu = (cur) => {
  const curL = live.find((L) => L.code === cur) || live[0];
  const items = live.map((L) =>
    `<li><a href="${pathOf(L)}" lang="${L.code}"${L.code === cur ? ' aria-current="page"' : ''}><span class="lang-switch__flag" aria-hidden="true">${L.flag}</span><span>${L.name}</span></a></li>`).join('');
  return `<details class="lang-switch"><summary aria-label="Language"><span class="lang-switch__flag" aria-hidden="true">${curL.flag}</span><span>${curL.name}</span></summary><ul class="lang-switch__menu">${items}</ul></details>`;
};
// Inject the details-based dropdown CSS once, replacing the simple <a>/<select> rule that still
// lives in the inlined <style>.
const DROPDOWN_CSS = `.lang-switch { position: relative; margin-left: var(--space-4); display: inline-block; }
    .lang-switch > summary { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary); background: var(--surface-elevated); border: 1px solid var(--border); border-radius: var(--radius-sm, 6px); padding: 4px 10px; cursor: pointer; list-style: none; display: inline-flex; align-items: center; gap: 6px; user-select: none; }
    .lang-switch > summary::-webkit-details-marker { display: none; }
    .lang-switch > summary::marker { content: ''; }
    .lang-switch > summary:hover { color: var(--text-primary); border-color: var(--border-strong); }
    .lang-switch[open] > summary { border-color: var(--accent); color: var(--text-primary); }
    .lang-switch__menu { position: absolute; right: 0; top: calc(100% + 4px); margin: 0; padding: 4px; list-style: none; background: var(--surface-elevated); border: 1px solid var(--border); border-radius: var(--radius-sm, 6px); box-shadow: var(--shadow-lg); min-width: 220px; max-height: 360px; overflow-y: auto; z-index: 100; }
    .lang-switch__menu li { margin: 0; }
    .lang-switch__menu a { display: flex; align-items: center; gap: 10px; padding: 6px 10px; font-family: var(--font-sans); font-size: var(--text-sm); color: var(--text-primary); text-decoration: none; border-radius: var(--radius-xs); }
    .lang-switch__menu a:hover { background: var(--plane-2); text-decoration: none; }
    .lang-switch__menu a[aria-current="page"] { color: var(--accent-text); font-weight: 500; }
    .lang-switch__flag { font-size: 15px; line-height: 1; flex: none; }`;

function head(h, L) {
  const must = (re, to) => { if (!re.test(h)) throw new Error(`aok/${L.code}: template drifted: ${re}`); h = h.replace(re, to); };
  must(/<html lang="[^"]*">/, `<html lang="${L.code}">`);
  must(/(\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">)+/, `\n${alternates}`);
  must(/<select class="lang-switch"[\s\S]*?<\/select>|<details class="lang-switch"[\s\S]*?<\/details>/, menu(L.code));
  // Replace the old single-line lang-switch CSS with the details-based block (idempotent).
  h = h.replace(/\.lang-switch \{ font-family: var\(--font-mono\)[^\}]+\}\s*\.lang-switch:hover \{[^\}]+\}/, DROPDOWN_CSS);
  return h;
}

const built = [];
for (const L of live) {
  const T = L.code === 'en' ? EN : (await import(`../i18n/aok/${L.code}.mjs`)).default;
  if (T.length !== EN.length) throw new Error(`aok/${L.code}: ${T.length} strings, en has ${EN.length}`);
  let h = tpl.replace(/\{\{(\d+)\}\}/g, (_, n) => T[+n]);
  h = head(h, L);
  h = h.replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${urlOf(L)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${urlOf(L)}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(">)/, `$1${L.og}$2`);
  const outDir = `${ROOT}${L.dir ? L.dir + '/' : ''}aok`;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/index.html`, h);
  built.push(L.code);
}

// sitemap: replace old /aok/ entries with per-locale entries + alternates
let sm = readFileSync(`${ROOT}sitemap.xml`, 'utf8');
sm = sm.replace(/  <url>\s*<loc>https:\/\/mordansoft\.com\/(?:[a-z-]+\/)?aok\/<\/loc>[\s\S]*?<\/url>\n/g, '');
const alt = live.map((L) => `    <xhtml:link rel="alternate" hreflang="${L.code}" href="${urlOf(L)}"/>`).join('\n');
const block = live.map((L) => `  <url>\n    <loc>${urlOf(L)}</loc>\n${alt}\n    <priority>${L.code === 'en' ? '0.9' : '0.8'}</priority>\n  </url>\n`).join('');
sm = sm.replace('</urlset>', block + '</urlset>');
writeFileSync(`${ROOT}sitemap.xml`, sm);
console.log(`aok page in ${built.length} languages: ${built.join(' ')}; sitemap updated`);
