// Builds main page in every language from tools/main.template.html + i18n/main/<lang>.mjs.
//   node tools/gen-main.mjs
// i18n/main/en.mjs is the master. {{n}} in the template = string n in that array.
// Writes / (en) and /<locale>/index.html for the rest. Updates sitemap.xml with the main-page entries.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const BASE = 'https://mordansoft.com';
// Same languages as SaltCure.
const LANGS = [
  ['en', '', 'en_US', 'English', '🇬🇧'], ['uk', 'uk', 'uk_UA', 'Українська', '🇺🇦'], ['ru', 'ru', 'ru_RU', 'Русский', '🇷🇺'],
  ['pl', 'pl', 'pl_PL', 'Polski', '🇵🇱'], ['cs', 'cs', 'cs_CZ', 'Čeština', '🇨🇿'], ['sk', 'sk', 'sk_SK', 'Slovenčina', '🇸🇰'],
  ['be', 'be', 'be_BY', 'Беларуская', '🇧🇾'], ['bg', 'bg', 'bg_BG', 'Български', '🇧🇬'], ['hr', 'hr', 'hr_HR', 'Hrvatski', '🇭🇷'],
  ['sr', 'sr', 'sr_RS', 'Српски', '🇷🇸'], ['sl', 'sl', 'sl_SI', 'Slovenščina', '🇸🇮'], ['es', 'es', 'es_ES', 'Español', '🇪🇸'],
  ['it', 'it', 'it_IT', 'Italiano', '🇮🇹'], ['kk', 'kk', 'kk_KZ', 'Қазақша', '🇰🇿'], ['fr', 'fr', 'fr_FR', 'Français', '🇫🇷'],
  ['pt-BR', 'pt-br', 'pt_BR', 'Português (Brasil)', '🇧🇷'], ['tr', 'tr', 'tr_TR', 'Türkçe', '🇹🇷'], ['de', 'de', 'de_DE', 'Deutsch', '🇩🇪'],
  ['id', 'id', 'id_ID', 'Bahasa Indonesia', '🇮🇩'],
].map(([code, dir, og, name, flag]) => ({ code, dir, og, name, flag }));

const pathOf = (L) => `/${L.dir ? L.dir + '/' : ''}`;
const urlOf = (L) => BASE + pathOf(L);
const tpl = readFileSync(`${ROOT}tools/main.template.html`, 'utf8');
const EN = (await import('../i18n/main/en.mjs')).default;
const live = LANGS.filter((L) => L.code === 'en' || existsSync(`${ROOT}i18n/main/${L.code}.mjs`));

const alternates = [...live.map((L) => `  <link rel="alternate" hreflang="${L.code}" href="${urlOf(L)}">`),
  `  <link rel="alternate" hreflang="x-default" href="${urlOf(LANGS[0])}">`].join('\n');
const menu = (cur) => {
  const curL = live.find((L) => L.code === cur) || live[0];
  const items = live.map((L) =>
    `<li><a href="${pathOf(L)}" lang="${L.code}"${L.code === cur ? ' aria-current="page"' : ''}><span class="lang-switch__flag" aria-hidden="true">${L.flag}</span><span>${L.name}</span></a></li>`).join('');
  return `<details class="lang-switch"><summary aria-label="Language"><span class="lang-switch__flag" aria-hidden="true">${curL.flag}</span><span>${curL.name}</span></summary><ul class="lang-switch__menu">${items}</ul></details>`;
};

function head(h, L) {
  const must = (re, to) => { if (!re.test(h)) throw new Error(`${L.code}: template drifted: ${re}`); h = h.replace(re, to); };
  must(/<html lang="[^"]*">/, `<html lang="${L.code}">`);
  must(/(\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">)+/, `\n${alternates}`);
  must(/<select class="lang-switch"[\s\S]*?<\/select>|<details class="lang-switch"[\s\S]*?<\/details>/, menu(L.code));
  return h;
}

const built = [];
for (const L of live) {
  const T = L.code === 'en' ? EN : (await import(`../i18n/main/${L.code}.mjs`)).default;
  if (T.length !== EN.length) throw new Error(`main/${L.code}: ${T.length} strings, en has ${EN.length}`);
  let h = tpl.replace(/\{\{(\d+)\}\}/g, (_, n) => T[+n]);
  h = head(h, L);
  h = h.replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${urlOf(L)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${urlOf(L)}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(">)/, `$1${L.og}$2`);
  if (L.dir) {
    h = h.replace(/(href|src)="(assets|_ds)\//g, '$1="../$2/');
    // Keep the visitor in their language when they jump to another localised page.
    // Everything but /legal/* is localised; keep legal links on the English root.
    h = h.replace(/href="\/saltcure\/"/g, `href="/${L.dir}/saltcure/"`);
    h = h.replace(/href="\/aok\/"/g, `href="/${L.dir}/aok/"`);
    h = h.replace(/href="\/sloviko\/"/g, `href="/${L.dir}/sloviko/"`);
    h = h.replace(/href="\/services\/app-data-review\/"/g, `href="/${L.dir}/services/app-data-review/"`);
  }
  const outDir = L.dir ? `${ROOT}${L.dir}` : ROOT.replace(/\/$/, '');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/index.html`, h);
  built.push(L.code);
}

// sitemap: refresh root main-page entries (strip old homepages, add fresh with alternates)
let sm = readFileSync(`${ROOT}sitemap.xml`, 'utf8');
// remove existing homepage entries (root and <locale>/, no sub-path)
sm = sm.replace(/  <url>\s*<loc>https:\/\/mordansoft\.com\/(?:[a-z-]+\/)?<\/loc>[\s\S]*?<\/url>\n/g, '');
const alt = live.map((L) => `    <xhtml:link rel="alternate" hreflang="${L.code}" href="${urlOf(L)}"/>`).join('\n');
const block = live.map((L) => `  <url>\n    <loc>${urlOf(L)}</loc>\n${alt}\n    <priority>${L.code === 'en' ? '1.0' : '0.9'}</priority>\n  </url>\n`).join('');
sm = sm.replace('</urlset>', block + '</urlset>');
writeFileSync(`${ROOT}sitemap.xml`, sm);
console.log(`main page in ${built.length} languages: ${built.join(' ')}; sitemap updated`);
