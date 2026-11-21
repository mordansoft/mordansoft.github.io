// Builds /bodyladder/ in every language from tools/bodyladder.template.html + i18n/bodyladder/<lang>.mjs.
//   node tools/gen-bodyladder.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const BASE = 'https://mordansoft.com';
const LANGS = [
  ['en', '', 'en_US', 'English', '🇬🇧'], ['uk', 'uk', 'uk_UA', 'Українська', '🇺🇦'], ['ru', 'ru', 'ru_RU', 'Русский', '🇷🇺'],
  ['de', 'de', 'de_DE', 'Deutsch', '🇩🇪'], ['es', 'es', 'es_ES', 'Español', '🇪🇸'], ['fr', 'fr', 'fr_FR', 'Français', '🇫🇷'],
  ['it', 'it', 'it_IT', 'Italiano', '🇮🇹'], ['pt-BR', 'pt-br', 'pt_BR', 'Português (Brasil)', '🇧🇷'], ['pl', 'pl', 'pl_PL', 'Polski', '🇵🇱'],
  ['tr', 'tr', 'tr_TR', 'Türkçe', '🇹🇷'], ['ja', 'ja', 'ja_JP', '日本語', '🇯🇵'], ['ko', 'ko', 'ko_KR', '한국어', '🇰🇷'],
].map(([code, dir, og, name, flag]) => ({ code, dir, og, name, flag }));

const pathOf = (L) => `/${L.dir ? L.dir + '/' : ''}bodyladder/`;
const urlOf = (L) => BASE + pathOf(L);
const tpl = readFileSync(`${ROOT}tools/bodyladder.template.html`, 'utf8');
const EN = (await import('../i18n/bodyladder/en.mjs')).default;
const live = LANGS.filter((L) => L.code === 'en' || existsSync(`${ROOT}i18n/bodyladder/${L.code}.mjs`));

const alternates = [...live.map((L) => `  <link rel="alternate" hreflang="${L.code}" href="${urlOf(L)}">`),
  `  <link rel="alternate" hreflang="x-default" href="${urlOf(LANGS[0])}">`].join('\n');
const menu = (cur) => {
  const curL = live.find((L) => L.code === cur) || live[0];
  const items = live.map((L) =>
    `<li><a href="${pathOf(L)}" lang="${L.code}"${L.code === cur ? ' aria-current="page"' : ''}><span class="lang-switch__flag" aria-hidden="true">${L.flag}</span><span>${L.name}</span></a></li>`).join('');
  return `<details class="lang-switch"><summary aria-label="Language"><span class="lang-switch__flag" aria-hidden="true">${curL.flag}</span><span>${curL.name}</span></summary><ul class="lang-switch__menu">${items}</ul></details>`;
};

function head(h, L) {
  const must = (re, to) => { if (!re.test(h)) throw new Error(`bodyladder/${L.code}: template drifted: ${re}`); h = h.replace(re, to); };
  must(/<html lang="[^"]*">/, `<html lang="${L.code}">`);
  must(/(\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">)+/, `\n${alternates}`);
  must(/<select class="lang-switch"[\s\S]*?<\/select>|<details class="lang-switch"[\s\S]*?<\/details>/, menu(L.code));
  return h;
}

const built = [];
for (const L of live) {
  const T = L.code === 'en' ? EN : (await import(`../i18n/bodyladder/${L.code}.mjs`)).default;
  if (T.length !== EN.length) throw new Error(`bodyladder/${L.code}: ${T.length} strings, en has ${EN.length}`);
  let h = tpl.replace(/\{\{(\d+)\}\}/g, (_, n) => T[+n]);
  h = head(h, L);
  h = h.replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${urlOf(L)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${urlOf(L)}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(">)/, `$1${L.og}$2`);
  if (L.dir) h = h.replace(/(href|src)="\.\.\//g, '$1="../../'); // pages one folder deeper
  const outDir = `${ROOT}${L.dir ? L.dir + '/' : ''}bodyladder`;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/index.html`, h);
  built.push(L.code);
}

let sm = readFileSync(`${ROOT}sitemap.xml`, 'utf8');
sm = sm.replace(/  <url>\s*<loc>https:\/\/mordansoft\.com\/(?:[a-z-]+\/)?bodyladder\/<\/loc>[\s\S]*?<\/url>\n/g, '');
const alt = live.map((L) => `    <xhtml:link rel="alternate" hreflang="${L.code}" href="${urlOf(L)}"/>`).join('\n');
const block = live.map((L) => `  <url>\n    <loc>${urlOf(L)}</loc>\n${alt}\n    <priority>${L.code === 'en' ? '0.9' : '0.8'}</priority>\n  </url>\n`).join('');
sm = sm.replace('</urlset>', block + '</urlset>');
writeFileSync(`${ROOT}sitemap.xml`, sm);
console.log(`bodyladder page in ${built.length} languages: ${built.join(' ')}; sitemap updated`);
