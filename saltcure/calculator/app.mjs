// UI for the web curing calculator. All maths and limits live in curing.mjs
// (a port of the app core); safety texts come from arb.mjs (the app's own strings).
import {
  CURE_TYPES, limitsOf, supportsWet, calcDryCure, calcBrine, evaluateCureGrams,
  nitriteAdvice, adviceNeedsPopup, saltBand, sugarBand, NITRITE_PROTECTIVE_MIN_PPM,
  G_PER_OZ, G_PER_LB,
} from './curing.mjs';
import { ARB } from './arb.mjs';

const LANG = document.documentElement.lang === 'uk' ? 'uk' : 'en';
const A = ARB[LANG];

const T = {
  en: {
    meat: 'What are you curing?', method: 'Method', dry: 'Dry cure', wet: 'Wet brine',
    salt: 'Which curing salt do you have?', saltPick: 'Choose…',
    saltHint: 'Check the nitrite % on your pack. European curing salt (Pökelsalz, peklosól) is usually 0.4–0.6% — about ten times weaker than Cure #1. Picking the wrong one throws the dose off tenfold.',
    cure1: 'Cure #1 / Prague Powder #1 (6.25% nitrite)', cure2: 'Cure #2 / Prague Powder #2 (6.25% nitrite + 4% nitrate)',
    peklosol: 'Peklosól / Pökelsalz (0.6% nitrite)', nps: 'NPS (0.5% nitrite)', custom: 'Other — enter the % from the pack',
    cure2Blocked: 'Not available for this product — nitrate is not used in bacon, jerky or biltong.',
    pct: 'Nitrite % on the pack', pctRange: 'Enter the nitrite % from the pack, between 0.1 and 7.', weight: 'Weight of the meat', water: 'Water for the brine', waterHint: 'Same unit as the weight above, by weight. Default 1:1 with the meat.',
    mode: 'What do you want?', modeDose: 'Work out the dose', modeCheck: 'Check a dose I already have',
    ppm: 'Nitrite, ppm', ppmHint: (r, h) => `recommended ${r} ppm · hard stop ${h} ppm`,
    typed: 'Curing salt I plan to use, g', sugar: 'Sugar, % of weight', saltPct: 'Salt, % of weight',
    results: 'Your numbers', cureMix: 'Curing salt (the nitrite mix)', extraSalt: 'Table salt to add', sugarOut: 'Sugar',
    ppmOut: 'Nitrite', brineOut: 'in the brine', systemOut: 'across meat + water after it evens out', nitrate: 'Nitrate',
    nothing: 'Pick the curing salt and enter a weight to see the numbers.',
    invalid: 'Enter a weight above zero.',
    overBlock: 'Over the limit', overCheck: (p, l) => `${p} ppm is over the ${l} ppm limit for this dish.`, fix: 'Set to the limit', limitOf: (g) => `Maximum for this dish: ${g} g of this salt.`,
    weighTip: 'Weigh the curing salt on a 0.1 g scale — never by spoon. Cure in the fridge, at 4 °C or below.',
    saltBandLbl: 'Salt', sugarBandLbl: 'Sugar',
    jerky: 'For jerky the main risk is bacteria, not nitrite. FSIS guidance is to heat the meat to 160 °F (71 °C), poultry to 165 °F (74 °C), in a humid environment before drying, then dry at about 130–140 °F (54–60 °C). After drying, heat it at 275 °F (135 °C) for 10 minutes; dry until a piece bends and cracks without snapping.',
    biltong: 'Biltong is traditionally cured with vinegar and salt, without nitrite — the default here is 0 ppm.',
    disclaimer: 'Calculated from the published USDA/FSIS limits (9 CFR 424.21 and 424.22). Those rules were written for commercial plants, not home kitchens — we use them as the best public numeric reference. The result is not an approval and not a guarantee; responsibility for the finished product stays with you.',
    ctaTitle: 'Keep your batches in the app', ctaText: 'SaltCure tracks every batch from day one, with reminders and weight loss against the target. Offline, no account.',
    faq: 'Questions about nitrite and safety', g: 'g', oz: 'oz', lb: 'lb',
  },
  uk: {
    meat: 'Що ти солиш?', method: 'Метод', dry: 'Сухий посол', wet: 'Мокрий посол (розсіл)',
    salt: 'Яка в тебе нітритна сіль?', saltPick: 'Обери…',
    saltHint: 'Перевір відсоток нітриту на пачці. Європейська нітритна сіль (Pökelsalz, peklosól) зазвичай містить 0,4–0,6% — приблизно вдесятеро менше, ніж Cure #1. Не той тип — доза відрізняється в десять разів.',
    cure1: 'Cure #1 / Prague Powder #1 (6,25% нітриту)', cure2: 'Cure #2 / Prague Powder #2 (6,25% нітриту + 4% нітрату)',
    peklosol: 'Peklosól / Pökelsalz (0,6% нітриту)', nps: 'NPS (0,5% нітриту)', custom: 'Інша — введи % з пачки',
    cure2Blocked: 'Для цього продукту недоступно — нітрат не застосовують у беконі, джерки та білтонгу.',
    pct: 'Відсоток нітриту на пачці', pctRange: 'Введи відсоток нітриту з пачки — від 0,1 до 7.', weight: 'Вага мʼяса'.replace('ʼ', "'"), water: 'Вода для розсолу', waterHint: 'В тих самих одиницях, що й вага, за вагою. За замовчуванням 1:1 до мʼяса.'.replace('ʼ', "'"),
    mode: 'Що потрібно?', modeDose: 'Порахувати дозу', modeCheck: 'Перевірити свою дозу',
    ppm: 'Нітрит, ppm', ppmHint: (r, h) => `рекомендовано ${r} ppm · жорсткий стоп ${h} ppm`,
    typed: 'Нітритної солі планую взяти, г', sugar: 'Цукор, % від ваги', saltPct: 'Сіль, % від ваги',
    results: 'Твої числа', cureMix: 'Нітритна сіль (суміш з нітритом)', extraSalt: 'Кухонної солі додати', sugarOut: 'Цукор',
    ppmOut: 'Нітрит', brineOut: 'у розсолі', systemOut: 'у системі мʼясо + вода після вирівнювання'.replace('ʼ', "'"), nitrate: 'Нітрат',
    nothing: "Обери нітритну сіль і введи вагу — з'являться числа.",
    invalid: 'Введи вагу більше нуля.',
    overBlock: 'Понад ліміт', overCheck: (p, l) => `${p} ppm перевищує ліміт ${l} ppm для цієї страви.`, fix: 'Поставити ліміт', limitOf: (g) => `Максимум для цієї страви: ${g} г цієї солі.`,
    weighTip: 'Нітритну сіль зважуй на вагах із точністю 0,1 г — не ложкою. Посол — у холодильнику, при 4 °C або нижче.',
    saltBandLbl: 'Сіль', sugarBandLbl: 'Цукор',
    jerky: 'Для джерки головний ризик — бактерії, а не нітрит. Рекомендація FSIS: перед сушінням прогріти мʼясо до 160 °F (71 °C), птицю до 165 °F (74 °C) у вологому середовищі, а потім сушити приблизно при 130–140 °F (54–60 °C). Після сушіння прогріти при 135 °C (275 °F) 10 хв; сушити, доки шматок не гнеться з тріщинами, але не ламається.'.replace('ʼ', "'"),
    biltong: 'Білтонг традиційно солять з оцтом і сіллю, без нітриту — тому за замовчуванням тут 0 ppm.',
    disclaimer: 'Розраховано за опублікованими нормами USDA/FSIS (9 CFR 424.21 і 424.22). Ці норми написані для промислових підприємств, а не для домашньої кухні — ми беремо їх як найкраще публічне числове джерело. Результат — не схвалення і не гарантія; відповідальність за готовий продукт лишається на тобі.',
    ctaTitle: 'Веди партії в застосунку', ctaText: 'SaltCure веде кожну партію від першого дня: нагадування та втрата ваги до цільової. Офлайн, без акаунта.',
    faq: 'Питання про нітрит і безпеку', g: 'г', oz: 'унц.', lb: 'фунт',
  },
}[LANG];

const $ = (id) => document.getElementById(id);
const nf = new Intl.NumberFormat(LANG === 'uk' ? 'uk-UA' : 'en-US', { maximumFractionDigits: 1 });
const fmt = (n) => nf.format(n);
const fmtG = (g) => (g >= 10 ? nf.format(Math.round(g)) : nf.format(Math.round(g * 10) / 10));
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => (k in v ? v[k] : `{${k}}`));
const num = (el) => parseFloat(String(el.value).replace(',', '.'));
const UNIT_G = { g: 1, oz: G_PER_OZ, lb: G_PER_LB };
const MEAT_KEYS = { bacon: 'meatBacon', canadianBacon: 'meatCanadianBacon', jerky: 'meatJerky', biltong: 'meatBiltong', pancetta: 'meatPancetta', salami: 'meatSalami', custom: 'meatCustom' };

const s = { waterEdited: false, ppmEdited: false, typedG: 0 };

// ── static labels ───────────────────────────────────────────────────────────
function init() {
  const set = (id, txt) => { const e = $(id); if (e) e.textContent = txt; };
  set('l-meat', T.meat); set('l-method', T.method); set('l-salt', T.salt); set('salt-hint', T.saltHint);
  set('l-pct', T.pct); set('l-weight', T.weight); set('l-water', T.water); set('water-hint', T.waterHint);
  set('l-mode', T.mode); set('l-ppm', T.ppm); set('l-typed', T.typed); set('l-sugar', T.sugar); set('l-saltpct', T.saltPct);
  set('t-results', T.results); set('disclaimer', T.disclaimer);
  set('cta-title', T.ctaTitle); set('cta-text', T.ctaText); set('faq-link', T.faq);
  $('meat').innerHTML = Object.keys(MEAT_KEYS).map((k) => `<option value="${k}">${A[MEAT_KEYS[k]]}</option>`).join('');
  $('method').innerHTML = `<option value="dry">${T.dry}</option><option value="wet">${T.wet}</option>`;
  $('mode').innerHTML = `<option value="dose">${T.modeDose}</option><option value="check">${T.modeCheck}</option>`;
  $('unit').innerHTML = ['g', 'oz', 'lb'].map((u) => `<option value="${u}">${T[u]}</option>`).join('');
  fillSalts();
  $('ppm').value = limitsOf('bacon', 'dry').recommendedPpm;
}

function fillSalts() {
  const meat = $('meat').value;
  const lim = limitsOf(meat, $('method').value);
  const cur = $('cure').value;
  const opts = ['cure1', 'cure2', 'peklosol', 'nps', 'custom'].map((k) => {
    const off = k === 'cure2' && !lim.allowsCure2;
    return `<option value="${k}" ${off ? 'disabled' : ''}>${T[k]}${off ? ' — ' + T.cure2Blocked : ''}</option>`;
  });
  $('cure').innerHTML = `<option value="">${T.saltPick}</option>` + opts.join('');
  $('cure').value = cur === 'cure2' && !lim.allowsCure2 ? 'cure1' : cur;
}

// ── state → results ─────────────────────────────────────────────────────────
function compute() {
  const meat = $('meat').value;
  const supportsW = supportsWet(meat);
  $('method-row').hidden = !supportsW;
  if (!supportsW) $('method').value = 'dry';
  const method = $('method').value;
  const wet = method === 'wet';
  const lim = limitsOf(meat, method);

  // ppm control follows the preset
  const ppmEl = $('ppm'), ppmRange = $('ppm-range');
  ppmRange.max = lim.hardStopPpm; ppmEl.max = lim.hardStopPpm;
  if (!s.ppmEdited) { ppmEl.value = lim.recommendedPpm; }
  ppmRange.value = Math.min(num(ppmEl) || 0, lim.hardStopPpm);
  $('ppm-hint').textContent = T.ppmHint(lim.recommendedPpm, lim.hardStopPpm);

  const cureType = $('cure').value;
  $('pct-row').hidden = cureType !== 'custom';
  $('water-row').hidden = !wet;
  const check = $('mode').value === 'check';
  $('ppm-row').hidden = check;
  $('typed-row').hidden = !check;

  $('jerky-note').hidden = meat !== 'jerky';
  $('jerky-note').textContent = T.jerky;
  $('biltong-note').hidden = meat !== 'biltong';
  $('biltong-note').textContent = T.biltong;

  const out = $('out');
  const unitG = UNIT_G[$('unit').value];
  const w = num($('weight')) * unitG;
  if (!cureType) { out.innerHTML = `<p class="calc-empty">${T.nothing}</p>`; return; }
  if (!(w > 0) || !Number.isFinite(w)) { out.innerHTML = `<p class="calc-empty">${T.invalid}</p>`; return; }

  if (wet && !s.waterEdited) $('water').value = fmtInput(num($('weight')));
  const waterG = wet ? num($('water')) * unitG : null;
  if (wet && !(waterG > 0 && Number.isFinite(waterG))) { out.innerHTML = `<p class="calc-empty">${T.invalid}</p>`; return; }

  if (cureType === 'cure2' && !lim.allowsCure2) { out.innerHTML = `<p class="calc-empty">${T.cure2Blocked}</p>`; return; }
  const nitritePct = cureType === 'custom' ? num($('pct')) : undefined;
  if (cureType === 'custom' && !(nitritePct >= 0.1 && nitritePct <= 7)) { out.innerHTML = `<p class="calc-empty">${T.pctRange}</p>`; return; }

  const saltPct = Math.max(0, num($('saltpct')) || 0), sugarPct = Math.max(0, num($('sugar')) || 0);
  const base = { meatWeightGrams: w, saltPct, sugarPct, cureType, limits: lim, nitritePct };

  let r, clampedFrom = null;
  if (check) {
    const typed = Math.max(0, num($('typed')) || 0);
    r = evaluateCureGrams({ ...base, cureGrams: typed, waterGrams: waterG });
  } else {
    let target = Math.max(0, Math.floor(num(ppmEl) || 0));
    if (target > lim.hardStopPpm) { clampedFrom = target; target = lim.hardStopPpm; ppmEl.value = target; ppmRange.value = target; }
    r = wet ? calcBrine({ ...base, waterGrams: waterG, targetPpm: target }) : calcDryCure({ ...base, targetPpm: target });
  }
  render(r, { meat, wet, lim, clampedFrom, check });
}

const fmtInput = (n) => String(Math.round(n * 100) / 100);

function render(r, ctx) {
  const { meat, wet, lim, clampedFrom, check } = ctx;
  const out = $('out');
  if (r.status === 'invalidWeight') { out.innerHTML = `<p class="calc-empty">${T.invalid}</p>`; return; }

  const adv = nitriteAdvice({ ppm: r.nitritePpm, limits: lim, meat });
  if (r.status === 'overLimit') adv.band = 'over';
  const bandKey = { ok: 'calcNitriteBandOk', above: 'calcNitriteBandAbove', high: 'calcNitriteBandHigh', low: 'calcNitriteBandLow', noneOk: 'calcNitriteBandNone', noneBare: 'calcNitriteBandNone', noneUnsafe: 'calcNitriteBandNoneUnsafe', over: null }[adv.band];
  const bandText = bandKey ? A[bandKey] : T.overBlock;
  const tone = adv.band === 'ok' || adv.band === 'noneOk' ? 'ok' : adv.band === 'above' || adv.band === 'noneBare' ? 'warn' : 'bad';

  const alerts = [];
  const rec = lim.recommendedPpm > 0 ? lim.recommendedPpm : lim.hardStopPpm;
  if (clampedFrom !== null) alerts.push(alert('bad', A.calcNitriteWarnOverTitle, fill(A.calcNitriteWarnOverBody, { ppm: clampedFrom, limit: lim.hardStopPpm })));
  if (r.status === 'overLimit') {
    alerts.push(alert('bad', A.calcNitriteWarnOverTitle, T.overCheck(r.nitritePpm, lim.hardStopPpm) + ' ' + T.limitOf(fmtG(r.fixToLimitGrams)),
      `<button type="button" class="ms-btn ms-btn--primary ms-btn--sm" data-fix="${r.fixToLimitGrams}">${T.fix}</button>`));
  } else if (adviceNeedsPopup(adv)) {
    if (adv.band === 'high') alerts.push(alert('warn', A.calcNitriteWarnHighTitle, fill(A.calcNitriteWarnHighBody, { ppm: r.nitritePpm, limit: lim.hardStopPpm, rec })));
    if (adv.band === 'low') alerts.push(alert('bad', A.calcNitriteWarnLowTitle, fill(A.calcNitriteWarnLowBody, { ppm: r.nitritePpm, min: NITRITE_PROTECTIVE_MIN_PPM, rec })));
    if (adv.band === 'noneUnsafe') alerts.push(alert('bad', A.calcNitriteWarnNoneTitle, fill(A.calcNitriteWarnNoneBody, { rec }) + (meat === 'salami' ? ' ' + A.calcNitriteWarnNoneSalami : '')));
  }

  const rows = [];
  rows.push(row(T.cureMix, r.status === 'overLimit' ? '—' : `${fmtG(r.cureGrams)} ${T.g}`, true));
  const ppmLabel = wet ? `${T.ppmOut} ${T.brineOut}` : T.ppmOut;
  rows.push(row(ppmLabel, `<span class="calc-chip calc-chip--${tone}">${r.nitritePpm} ppm · ${bandText}</span>`));
  if (wet && r.systemPpm !== null) rows.push(row(`${T.ppmOut}, ${T.systemOut}`, `${r.systemPpm} ppm`));
  if (r.nitratePpm > 0) rows.push(row(T.nitrate, `${r.nitratePpm} ppm` + (lim.nitrateStopPpm ? ` <span class="calc-sub">/ ${lim.nitrateStopPpm}</span>` : '')));
  const saltLine = r.saltCoveredByCure
    ? `0 ${T.g}<div class="calc-sub">${fill(A.calcSaltCoveredByCure, { pct: fmt(saltCoverPct(r, ctx)) })}</div>`
    : `${fmtG(r.saltGrams)} ${T.g}`;
  rows.push(row(T.extraSalt, saltLine));
  rows.push(row(T.sugarOut, `${fmtG(r.sugarGrams)} ${T.g}`));

  const sb = saltBand(num($('saltpct')) || 0), gb = sugarBand(num($('sugar')) || 0);
  const saltTone = sb === 'normal' ? 'ok' : sb === 'low' || sb === 'high' ? 'warn' : 'bad';
  const sugarTone = gb === 'normal' ? 'ok' : 'warn';
  const bands = `<div class="calc-bands"><span class="calc-chip calc-chip--${saltTone}">${T.saltBandLbl}: ${A['calcSaltBand' + cap(sb)]}</span>` +
    `<span class="calc-chip calc-chip--${sugarTone}">${T.sugarBandLbl}: ${A['calcSugarBand' + (gb === 'max' ? 'High' : cap(gb))]}</span></div>`;

  out.innerHTML = alerts.join('') + `<dl class="calc-rows">${rows.join('')}</dl>` + bands +
    (wet ? `<p class="calc-note">${fill(A.calcBrineNitriteNote, { ppm: r.nitritePpm })}</p>` : '') +
    `<p class="calc-note">${T.weighTip}</p>`;

  out.querySelectorAll('[data-fix]').forEach((b) => b.addEventListener('click', () => {
    $('typed').value = b.dataset.fix; compute();
  }));
}

// Share of salt the cure mix itself delivers, as % of the salt base (the app's "cure salt alone gives X%").
function saltCoverPct(r, ctx) {
  const unitG = UNIT_G[$('unit').value];
  const w = num($('weight')) * unitG;
  const base = ctx.wet ? w + num($('water')) * unitG : w;
  const pct = (r.cureGrams * (1 - r.nitritePct / 100) / base) * 100;
  return Math.round(pct * 10) / 10;
}

const cap = (x) => x[0].toUpperCase() + x.slice(1);
const row = (label, val, big) => `<div class="calc-row${big ? ' calc-row--big' : ''}"><dt>${label}</dt><dd>${val}</dd></div>`;
const alert = (tone, title, body, action = '') => `<div class="calc-alert calc-alert--${tone}" role="alert"><strong>${title}</strong><p>${body}</p>${action}</div>`;

// ── wiring ──────────────────────────────────────────────────────────────────
init();
$('meat').addEventListener('change', () => { s.ppmEdited = false; fillSalts(); compute(); });
$('method').addEventListener('change', () => { s.ppmEdited = false; fillSalts(); compute(); });
$('ppm').addEventListener('input', () => { s.ppmEdited = true; compute(); });
$('ppm-range').addEventListener('input', () => { s.ppmEdited = true; $('ppm').value = $('ppm-range').value; compute(); });
$('water').addEventListener('input', () => { s.waterEdited = true; compute(); });
$('unit').addEventListener('change', () => { s.waterEdited = false; compute(); });
['cure', 'pct', 'weight', 'saltpct', 'sugar', 'typed', 'mode'].forEach((id) => {
  $(id).addEventListener('input', compute); $(id).addEventListener('change', compute);
});
compute();
