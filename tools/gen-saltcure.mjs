// Builds /saltcure/ in every language from tools/saltcure.template.html + i18n/saltcure/<lang>.mjs.
//   node tools/gen-saltcure.mjs
// i18n/saltcure/en.mjs is the master: a list of strings in template order ({{n}} = string n).
// Also rewrites the /saltcure/ entries of sitemap.xml with every language as an alternate.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const BASE = 'https://mordansoft.com';
const MEAT = 'https://meat.mordansoft.com';
// The twelve MordanSoft languages (decision 14.11.2026, standardised 19.11.2026).
const LANGS = [
  ['en', '', 'en_US', 'English', '🇬🇧'], ['uk', 'uk', 'uk_UA', 'Українська', '🇺🇦'], ['ru', 'ru', 'ru_RU', 'Русский', '🇷🇺'],
  ['de', 'de', 'de_DE', 'Deutsch', '🇩🇪'], ['es', 'es', 'es_ES', 'Español', '🇪🇸'], ['fr', 'fr', 'fr_FR', 'Français', '🇫🇷'],
  ['it', 'it', 'it_IT', 'Italiano', '🇮🇹'], ['pt-BR', 'pt-br', 'pt_BR', 'Português (Brasil)', '🇧🇷'], ['pl', 'pl', 'pl_PL', 'Polski', '🇵🇱'],
  ['tr', 'tr', 'tr_TR', 'Türkçe', '🇹🇷'], ['ja', 'ja', 'ja_JP', '日本語', '🇯🇵'], ['ko', 'ko', 'ko_KR', '한국어', '🇰🇷'],
].map(([code, dir, og, name, flag]) => ({ code, dir, og, name, flag }));
// meat.mordansoft.com has calculators in these; ja and ko link to the English ones.
const CALC = ['en', 'uk', 'ru', 'de', 'es', 'fr', 'it', 'pt-BR', 'pl', 'tr'];
const LEARN = ['en', 'uk']; // knowledge base languages on meat.mordansoft.com

const pathOf = (L) => `/${L.dir ? L.dir + '/' : ''}saltcure/`;
const urlOf = (L) => BASE + pathOf(L);
const tpl = readFileSync(`${ROOT}tools/saltcure.template.html`, 'utf8');
const EN = (await import('../i18n/saltcure/en.mjs')).default;
const live = LANGS.filter((L) => existsSync(`${ROOT}i18n/saltcure/${L.code}.mjs`));

const alternates = [...live.map((L) => `  <link rel="alternate" hreflang="${L.code}" href="${urlOf(L)}">`),
  `  <link rel="alternate" hreflang="x-default" href="${urlOf(LANGS[0])}">`].join('\n');
const menu = (cur) => {
  const curL = live.find((L) => L.code === cur) || live[0];
  const items = live.map((L) =>
    `<li><a href="${pathOf(L)}" lang="${L.code}"${L.code === cur ? ' aria-current="page"' : ''}><span class="lang-switch__flag" aria-hidden="true">${L.flag}</span><span>${L.name}</span></a></li>`).join('');
  return `<details class="lang-switch"><summary aria-label="Language"><span class="lang-switch__flag" aria-hidden="true">${curL.flag}</span><span>${curL.name}</span></summary><ul class="lang-switch__menu">${items}</ul></details>`;
};
const meatPath = (L, slug) => (!CALC.includes(L.code) || (slug === 'learn' && !LEARN.includes(L.code)) ? `${MEAT}/${slug}/` : `${MEAT}/${L.dir ? L.dir + '/' : ''}${slug}/`);
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');

function head(h, L) {
  const must = (re, to) => { if (!re.test(h)) throw new Error(`${L.code}: page drifted: ${re}`); h = h.replace(re, to); };
  must(/<html lang="[^"]*">/, `<html lang="${L.code}">`);
  must(/(\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">)+/, `\n${alternates}`);
  must(/<a class="lang-switch"[^>]*>[^<]*<\/a>|<select class="lang-switch"[\s\S]*?<\/select>|<details class="lang-switch"[\s\S]*?<\/details>/, menu(L.code));
  return h;
}

const built = [];
const skipped = [];
for (const L of live) {
  const T = (await import(`../i18n/saltcure/${L.code}.mjs`)).default;
  if (T.length !== EN.length) { skipped.push(`${L.code} (${T.length}/${EN.length})`); continue; } // old page stays until the language is retranslated
  let h = tpl.replace(/\{\{(\d+)\}\}/g, (_, n) => T[+n]);
  h = head(h, L);
  // App screens exist per build language: swap the English ones where the locale file exists.
  h = h.replace(/\/assets\/img\/saltcure\/screens\/([a-z]+)_en\.webp/g, (m, shot) =>
    existsSync(`${ROOT}assets/img/saltcure/screens/${shot}_${L.code}.webp`) ? `/assets/img/saltcure/screens/${shot}_${L.code}.webp` : m);
  h = h.replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${urlOf(L)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${urlOf(L)}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(">)/, `$1${L.og}$2`)
    .replace(new RegExp(`${MEAT}/(curing-salt-calculator|brine-calculator|dry-brine-calculator|learn)/`, 'g'), (_, slug) => meatPath(L, slug));
  if (L.dir) h = h.replace(/(href|src)="\.\.\//g, '$1="../../');
  // FAQ markup for search, rebuilt from the translated questions.
  const qa = [...h.matchAll(/<summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p>/g)]
    .map(([, q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } }));
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: L.code, mainEntity: qa }).replace(/</g, '\\u003c')}</script>`);
  // «Ко всем продуктам» ведёт на главную того же языка.
  if (L.dir) h = h.replace(/href="\/#products"/g, `href="/${L.dir}/#products"`);
  const dir = `${ROOT}${L.dir ? L.dir + '/' : ''}saltcure`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, h);
  built.push(L.code);
}

// sitemap: replace every /saltcure/ entry with one per language, all languages as alternates
let sm = readFileSync(`${ROOT}sitemap.xml`, 'utf8');
sm = sm.replace(/  <url>\s*<loc>https:\/\/mordansoft\.com\/(?:[a-z-]+\/)?saltcure\/<\/loc>[\s\S]*?<\/url>\n/g, '');
const alt = live.map((L) => `    <xhtml:link rel="alternate" hreflang="${L.code}" href="${urlOf(L)}"/>`).join('\n');
sm = sm.replace('</urlset>', live.map((L) => `  <url>\n    <loc>${urlOf(L)}</loc>\n${alt}\n  </url>\n`).join('') + '</urlset>');
writeFileSync(`${ROOT}sitemap.xml`, sm);
if (skipped.length) console.log(`skipped (old page kept): ${skipped.join(', ')}`);
console.log(`saltcure page in ${built.length} languages: ${built.join(' ')}; sitemap updated`);
