// Numbers and tags in i18n/saltcure/<lang>.mjs must match the English string at the same index.
//   node tools/check-numbers.mjs ru pl
const EN = (await import('../i18n/saltcure/en.mjs')).default;
const nums = (s) => (s.replace(/<[^>]+>/g, ' ').match(/\d+(?:[.,]\d+)?/g) || []).map((n) => n.replace(',', '.')).sort().join(' ');
const tags = (s) => (s.match(/<\/?[a-z]+/g) || []).join(' ');
let bad = 0;
for (const lang of process.argv.slice(2)) {
  const T = (await import(`../i18n/saltcure/${lang}.mjs`)).default;
  if (T.length !== EN.length) { console.log(`${lang}: ${T.length} strings, en ${EN.length}`); bad++; continue; }
  EN.forEach((e, i) => {
    if (nums(e) !== nums(T[i])) { console.log(`${lang} #${i}: nums en[${nums(e)}] ≠ [${nums(T[i])}]`); bad++; }
    if (tags(e) !== tags(T[i])) { console.log(`${lang} #${i}: tags en[${tags(e)}] ≠ [${tags(T[i])}]`); bad++; }
  });
}
console.log(bad ? `${bad} mismatches` : 'OK');
