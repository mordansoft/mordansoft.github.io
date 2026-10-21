// Builds /saltcure/ in every language from tools/saltcure.template.html + i18n/saltcure/<lang>.mjs.
//   node tools/gen-saltcure.mjs
// i18n/saltcure/en.mjs is the master: a list of strings in template order ({{n}} = string n).
// The Ukrainian page (uk/saltcure/) is written by hand and only gets the language menu and links.
// Also rewrites the /saltcure/ entries of sitemap.xml with every language as an alternate.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const BASE = 'https://mordansoft.com';
const MEAT = 'https://meat.mordansoft.com';
// Same languages, folders and names as the meat.mordansoft.com calculators.
const LANGS = [
  ['en', '', 'en_US', 'English', '🇬🇧'], ['uk', 'uk', 'uk_UA', 'Українська', '🇺🇦'], ['ru', 'ru', 'ru_RU', 'Русский', '🇷🇺'],
  ['pl', 'pl', 'pl_PL', 'Polski', '🇵🇱'], ['cs', 'cs', 'cs_CZ', 'Čeština', '🇨🇿'], ['sk', 'sk', 'sk_SK', 'Slovenčina', '🇸🇰'],
  ['be', 'be', 'be_BY', 'Беларуская', '🇧🇾'], ['bg', 'bg', 'bg_BG', 'Български', '🇧🇬'], ['hr', 'hr', 'hr_HR', 'Hrvatski', '🇭🇷'],
  ['sr', 'sr', 'sr_RS', 'Српски', '🇷🇸'], ['sl', 'sl', 'sl_SI', 'Slovenščina', '🇸🇮'], ['es', 'es', 'es_ES', 'Español', '🇪🇸'],
  ['it', 'it', 'it_IT', 'Italiano', '🇮🇹'], ['kk', 'kk', 'kk_KZ', 'Қазақша', '🇰🇿'], ['fr', 'fr', 'fr_FR', 'Français', '🇫🇷'],
  ['pt-BR', 'pt-br', 'pt_BR', 'Português (Brasil)', '🇧🇷'], ['tr', 'tr', 'tr_TR', 'Türkçe', '🇹🇷'], ['de', 'de', 'de_DE', 'Deutsch', '🇩🇪'],
  ['id', 'id', 'id_ID', 'Bahasa Indonesia', '🇮🇩'],
].map(([code, dir, og, name, flag]) => ({ code, dir, og, name, flag }));
const LEARN = ['en', 'uk']; // knowledge base languages on meat.mordansoft.com

const pathOf = (L) => `/${L.dir ? L.dir + '/' : ''}saltcure/`;
const urlOf = (L) => BASE + pathOf(L);
const tpl = readFileSync(`${ROOT}tools/saltcure.template.html`, 'utf8');
const EN = (await import('../i18n/saltcure/en.mjs')).default;
const live = LANGS.filter((L) => L.code === 'uk' || existsSync(`${ROOT}i18n/saltcure/${L.code}.mjs`));

const alternates = [...live.map((L) => `  <link rel="alternate" hreflang="${L.code}" href="${urlOf(L)}">`),
  `  <link rel="alternate" hreflang="x-default" href="${urlOf(LANGS[0])}">`].join('\n');
const menu = (cur) => {
  const curL = live.find((L) => L.code === cur) || live[0];
  const items = live.map((L) =>
    `<li><a href="${pathOf(L)}" lang="${L.code}"${L.code === cur ? ' aria-current="page"' : ''}><span class="lang-switch__flag" aria-hidden="true">${L.flag}</span><span>${L.name}</span></a></li>`).join('');
  return `<details class="lang-switch"><summary aria-label="Language"><span class="lang-switch__flag" aria-hidden="true">${curL.flag}</span><span>${curL.name}</span></summary><ul class="lang-switch__menu">${items}</ul></details>`;
};
const meatPath = (L, slug) => (slug === 'learn' && !LEARN.includes(L.code) ? `${MEAT}/learn/` : `${MEAT}/${L.dir ? L.dir + '/' : ''}${slug}/`);
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');

function head(h, L) {
  const must = (re, to) => { if (!re.test(h)) throw new Error(`${L.code}: page drifted: ${re}`); h = h.replace(re, to); };
  must(/<html lang="[^"]*">/, `<html lang="${L.code}">`);
  must(/(\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">)+/, `\n${alternates}`);
  must(/<a class="lang-switch"[^>]*>[^<]*<\/a>|<select class="lang-switch"[\s\S]*?<\/select>|<details class="lang-switch"[\s\S]*?<\/details>/, menu(L.code));
  return h;
}

const built = [];
for (const L of live) {
  if (L.code === 'uk') {
    // Hand-written page: language menu, alternates, and its brine links now that those pages exist in Ukrainian.
    const p = `${ROOT}uk/saltcure/index.html`;
    let h = head(readFileSync(p, 'utf8'), L)
      .replace(`${MEAT}/brine-calculator/"><h3 class="tool-card__title">Brine calculator (EN)</h3>`, `${MEAT}/uk/brine-calculator/"><h3 class="tool-card__title">Калькулятор розсолу</h3>`)
      .replace(`${MEAT}/dry-brine-calculator/"><h3 class="tool-card__title">Dry brine calculator (EN)</h3>`, `${MEAT}/uk/dry-brine-calculator/"><h3 class="tool-card__title">Калькулятор сухого розсолу</h3>`);
    writeFileSync(p, h);
    built.push(L.code);
    continue;
  }
  const T = (await import(`../i18n/saltcure/${L.code}.mjs`)).default;
  if (T.length !== EN.length) throw new Error(`saltcure/${L.code}: ${T.length} strings, en has ${EN.length}`);
  let h = tpl.replace(/\{\{(\d+)\}\}/g, (_, n) => T[+n]);
  h = head(h, L);
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
console.log(`saltcure page in ${built.length} languages: ${built.join(' ')}; sitemap updated`);
