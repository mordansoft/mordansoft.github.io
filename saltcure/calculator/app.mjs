// UI of the web curing calculator — laid out like the app's calculator screen:
// cards with a big number, a log-scale weight slider, and zoned level sliders for
// nitrite / salt / sugar. All maths and limits live in curing.mjs (a port of the
// app core); the safety texts come from arb.mjs (the app's own strings).
import {
  limitsOf, supportsWet, calcDryCure, calcBrine, nitriteAdvice, adviceNeedsPopup,
  saltBand, sugarBand, NITRITE_PROTECTIVE_MIN_PPM, G_PER_OZ, G_PER_LB,
} from './curing.mjs';
import { ARB } from './arb.mjs';

const LANG = document.documentElement.lang === 'uk' ? 'uk' : 'en';
const A = ARB[LANG];
const ML_PER_FLOZ = 29.5735295625;

const T = {
  en: {
    dish: 'Dish', dry: 'Dry cure', wet: 'Wet brine', dryOnly: 'dry cure only',
    meatWeight: 'Meat weight', water: 'Water', waterOf: (p) => `Water · ${p}%`,
    nitrite: 'Nitrite', salt: 'Salt', sugar: 'Sugar', pick: 'Choose the curing salt…',
    cure1: 'Cure #1', cure2: 'Cure #2', peklosol: 'Peklosól', nps: 'NPS', custom: 'Custom',
    saltHint: 'Check the nitrite % on your pack. European curing salt (Pökelsalz, peklosól) is usually 0.4–0.6% — about ten times weaker than Cure #1. Picking the wrong one throws the dose off tenfold.',
    cure2Blocked: 'not available here', pct: 'Nitrite % on the pack', pctRange: 'Enter the nitrite % from the pack, between 0.1 and 7.',
    recMark: (r) => `rec. ${r} ppm`, normSalt: 'norm 2.0–3.5%', normSugar: 'usual 0.3–2.5%',
    fromCure: (g) => `${g} g of it already comes from the curing salt`,
    results: 'Your numbers', cCuring: 'Curing salt', cSalt: 'Salt', cSugar: 'Sugar', cNitrite: 'Nitrite', cNitrate: 'Nitrate', cWater: 'Water',
    needSalt: 'Choose the curing salt to see the numbers.', invalid: 'Enter a weight above zero.',
    over: 'Over limit', overCheck: (p, l) => `${p} ppm is over the ${l} ppm limit for this dish. Let go of the slider to bring it back to the limit.`,
    system: 'across meat + water once it evens out',
    weighTip: 'Weigh the curing salt on a 0.1 g scale — never by spoon. Cure in the fridge, at 4 °C or below.',
    jerky: 'For jerky the main risk is bacteria, not nitrite. FSIS guidance is to heat the meat to 160 °F (71 °C), poultry to 165 °F (74 °C), in a humid environment before drying, then dry at about 130–140 °F (54–60 °C). After drying, heat it at 275 °F (135 °C) for 10 minutes; dry until a piece bends and cracks without snapping.',
    biltong: 'Biltong is traditionally cured with vinegar and salt, without nitrite — the default here is 0 ppm.',
    ctaTitle: 'Keep your batches in the app', ctaText: 'SaltCure tracks every batch from day one, with reminders and weight loss against the target. Offline, no account.',
    disclaimer: 'Calculated from the published USDA/FSIS limits (9 CFR 424.21 and 424.22). Those rules were written for commercial plants, not home kitchens — we use them as the best public numeric reference. The result is not an approval and not a guarantee; responsibility for the finished product stays with you.',
    faq: 'Questions about nitrite and safety', g: 'g', ml: 'ml', oz: 'oz', lb: 'lb', floz: 'fl oz',
  },
  uk: {
    dish: 'Страва', dry: 'Сухий посол', wet: 'Мокрий посол', dryOnly: 'лише сухий посол',
    meatWeight: "Вага м'яса", water: 'Вода', waterOf: (p) => `Вода · ${p}%`,
    nitrite: 'Нітрит', salt: 'Сіль', sugar: 'Цукор', pick: 'Обери нітритну сіль…',
    cure1: 'Cure #1', cure2: 'Cure #2', peklosol: 'Peklosól', nps: 'NPS', custom: 'Своя',
    saltHint: 'Перевір відсоток нітриту на пачці. Європейська нітритна сіль (Pökelsalz, peklosól) зазвичай містить 0,4–0,6% — приблизно вдесятеро менше, ніж Cure #1. Не той тип — доза відрізняється в десять разів.',
    cure2Blocked: 'тут недоступна', pct: 'Відсоток нітриту на пачці', pctRange: 'Введи відсоток нітриту з пачки — від 0,1 до 7.',
    recMark: (r) => `рек. ${r} ppm`, normSalt: 'норма 2,0–3,5%', normSugar: 'звично 0,3–2,5%',
    fromCure: (g) => `${g} г з них уже дає нітритна сіль`,
    results: 'Твої числа', cCuring: 'Нітритна сіль', cSalt: 'Сіль', cSugar: 'Цукор', cNitrite: 'Нітрит', cNitrate: 'Нітрат', cWater: 'Вода',
    needSalt: "Обери нітритну сіль — з'являться числа.", invalid: 'Введи вагу більше нуля.',
    over: 'Понад ліміт', overCheck: (p, l) => `${p} ppm перевищує ліміт ${l} ppm для цієї страви. Відпусти повзунок — доза повернеться до ліміту.`,
    system: 'у системі після вирівнювання',
    weighTip: 'Нітритну сіль зважуй на вагах із точністю 0,1 г — не ложкою. Посол — у холодильнику, при 4 °C або нижче.',
    jerky: "Для джерки головний ризик — бактерії, а не нітрит. Рекомендація FSIS: перед сушінням прогріти м'ясо до 160 °F (71 °C), птицю до 165 °F (74 °C) у вологому середовищі, а потім сушити приблизно при 130–140 °F (54–60 °C). Після сушіння прогріти при 135 °C (275 °F) 10 хв; сушити, доки шматок не гнеться з тріщинами, але не ламається.",
    biltong: 'Білтонг традиційно солять з оцтом і сіллю, без нітриту — тому за замовчуванням тут 0 ppm.',
    ctaTitle: 'Веди партії в застосунку', ctaText: 'SaltCure веде кожну партію від першого дня: нагадування та втрата ваги до цільової. Офлайн, без акаунта.',
    disclaimer: 'Розраховано за опублікованими нормами USDA/FSIS (9 CFR 424.21 і 424.22). Ці норми написані для промислових підприємств, а не для домашньої кухні — ми беремо їх як найкраще публічне числове джерело. Результат — не схвалення і не гарантія; відповідальність за готовий продукт лишається на тобі.',
    faq: 'Питання про нітрит і безпеку', g: 'г', ml: 'мл', oz: 'унц.', lb: 'фунт', floz: 'рід. унц.',
  },
}[LANG];

const MEAT_KEYS = { bacon: 'meatBacon', canadianBacon: 'meatCanadianBacon', jerky: 'meatJerky', biltong: 'meatBiltong', pancetta: 'meatPancetta', salami: 'meatSalami', custom: 'meatCustom' };
const CURES = ['cure1', 'cure2', 'peklosol', 'nps', 'custom'];
const NIT_PCT = { cure1: 6.25, cure2: 6.25, peklosol: 0.6, nps: 0.5 };
const UNIT_G = { g: 1, oz: G_PER_OZ, lb: G_PER_LB };
const W_MIN = 100, W_MAX = 8000; // the app's meat / water slider range

const $ = (id) => document.getElementById(id);
const nfp = (d) => new Intl.NumberFormat(LANG === 'uk' ? 'uk-UA' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: d });
const fmtG = (g) => (g >= 10 ? nfp(0).format(Math.round(g)) : nfp(Math.abs(g - Math.round(g)) < 1e-9 ? 0 : 1).format(Math.round(g * 10) / 10));
const fill = (str, v) => str.replace(/\{(\w+)\}/g, (_, k) => (k in v ? v[k] : `{${k}}`));
const parse = (v) => parseFloat(String(v).replace(',', '.'));

// ── the app's log-scale weight slider (weight_scale.dart) ──────────────────
const snapG = (g) => {
  const step = g < 1000 ? 10 : g < 3000 ? 25 : 50;
  return Math.min(W_MAX, Math.max(W_MIN, Math.round(g / step) * step));
};
const toGrams = (t) => snapG(W_MIN * Math.pow(W_MAX / W_MIN, Math.min(1, Math.max(0, t / 1000))));
const toTravel = (g) => Math.round((Math.log(Math.min(W_MAX, Math.max(W_MIN, g)) / W_MIN) / Math.log(W_MAX / W_MIN)) * 1000);

// ── state ───────────────────────────────────────────────────────────────────
const s = { meat: 'bacon', wet: false, unit: 'g', meatG: 1000, waterMl: 1000, cure: '', customPct: 0.6, ppm: 156, ppmTouched: false, salt: 2.5, sugar: 1.0, reducedFrom: null };

const meatLabel = (m) => A[MEAT_KEYS[m]];
const fluid = () => s.unit !== 'g';
const vUnit = () => (fluid() ? 'floz' : 'ml');
const toDisplayW = (g) => (s.unit === 'g' ? String(Math.round(g)) : (g / UNIT_G[s.unit]).toFixed(s.unit === 'oz' ? 1 : 2));
const toDisplayV = (ml) => (fluid() ? (ml / ML_PER_FLOZ).toFixed(1) : String(Math.round(ml)));
const fromDisplayW = (v) => parse(v) * UNIT_G[s.unit];
const fromDisplayV = (v) => (fluid() ? parse(v) * ML_PER_FLOZ : parse(v));
const nitPct = () => (s.cure === 'custom' ? s.customPct : NIT_PCT[s.cure]);
const limits = () => limitsOf(s.meat, s.wet ? 'wet' : 'dry');
const baseGrams = () => (s.wet ? s.meatG + s.waterMl : s.meatG);

// ── small markup helpers ────────────────────────────────────────────────────
function zonedSlider(id, min, max, step, value, zones, extra = '') {
  const z = zones.map(([w, c]) => `<i style="flex:${Math.max(0, w)} 0 0;background:var(--z-${c})"></i>`).join('');
  return `<div class="zs"><div class="zs__track"><div class="zs__zones">${z}</div></div><input class="zs__input" id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" ${extra}></div>`;
}
const status = (color, label, mark) =>
  `<div class="calc-status"><span class="calc-status__l"><i class="dot" style="background:var(--z-${color})"></i><b style="color:var(--z-${color})">${label.toUpperCase()}</b></span><span class="calc-status__r">${mark}</span></div>`;
const bigNumber = (id, value, unitHtml, cls = '') =>
  `<div class="big ${cls}"><input id="${id}" class="big__in" type="text" inputmode="decimal" value="${value}" aria-label="${id}"><span class="big__u">${unitHtml}</span></div>`;
const alertBox = (tone, title, body) => `<div class="calc-alert calc-alert--${tone}" role="alert"><strong>${title}</strong><p>${body}</p></div>`;
const unitSelect = () => `<select class="unit-select" id="unit" aria-label="unit">${['g', 'oz', 'lb'].map((u) => `<option value="${u}" ${u === s.unit ? 'selected' : ''}>${T[u]}</option>`).join('')}</select>`;

const SALT_BREAKS = [0, 1.5 / 6, 2 / 6, 3.5 / 6, 4.5 / 6, 1];
const SALT_COLORS = ['danger', 'warning', 'success', 'warning', 'danger'];
const SUGAR_BREAKS = [0, 0.3 / 5, 2.5 / 5, 1];
const SUGAR_COLORS = ['warning', 'success', 'warning'];
const zonesOf = (b, c) => c.map((col, i) => [b[i + 1] - b[i], col]);

function bandInfo(band) {
  return {
    ok: ['success', A.calcNitriteBandOk], above: ['warning', A.calcNitriteBandAbove], high: ['danger', A.calcNitriteBandHigh],
    over: ['danger', T.over], low: ['warning', A.calcNitriteBandLow], noneOk: ['muted', A.calcNitriteBandNone],
    noneBare: ['warning', A.calcNitriteBandNone], noneUnsafe: ['danger', A.calcNitriteBandNoneUnsafe],
  }[band];
}
const saltInfo = (b) => ({ under: ['danger', A.calcSaltBandUnder], low: ['warning', A.calcSaltBandLow], normal: ['success', A.calcSaltBandNormal], high: ['warning', A.calcSaltBandHigh], over: ['danger', A.calcSaltBandOver] }[b]);
const sugarInfo = (b) => ({ none: ['muted', A.calcSugarBandNone], low: ['warning', A.calcSugarBandLow], normal: ['success', A.calcSugarBandNormal], high: ['warning', A.calcSugarBandHigh], max: ['warning', A.calcSugarBandHigh] }[b]);

// accent-filled portion of the plain sliders (weight / water), like the app's track
const paint = () => document.querySelectorAll('.sl').forEach((e) => e.style.setProperty('--p', `${(100 * e.value) / e.max}%`));

// ── skeleton, built once ────────────────────────────────────────────────────
function build() {
  $('calc-app').innerHTML = `
    <div class="seg" id="seg-method"><button type="button" data-m="dry">${T.dry}</button><button type="button" data-m="wet">${T.wet}</button></div>
    <div class="cc"><div class="cc__h"><span class="eyebrow">// ${T.dish}</span><span class="mono mut" id="dish-count"></span></div><select class="ms-input" id="meat"></select></div>
    <div class="cc" id="card-weight"></div>
    <div class="cc cc--strong" id="card-nitrite"></div>
    <div class="cc" id="card-salt"></div>
    <div class="cc" id="card-sugar"></div>`;
  $('meat').addEventListener('change', (e) => { s.meat = e.target.value; s.ppmTouched = false; s.reducedFrom = null; refit(); render(); });
  document.querySelectorAll('#seg-method button').forEach((b) => b.addEventListener('click', () => {
    s.wet = b.dataset.m === 'wet';
    if (s.wet && !supportsWet(s.meat)) s.meat = 'bacon';
    s.ppmTouched = false; s.reducedFrom = null; refit(); render();
  }));
}

// the ppm sits on the preset's recommendation until the user moves it
function refit() {
  const lim = limits();
  if (!s.ppmTouched) s.ppm = lim.recommendedPpm;
  s.ppm = Math.min(s.ppm, lim.hardStopPpm + 10);
  if (s.cure === 'cure2' && !lim.allowsCure2) s.cure = 'cure1';
}

function compute(lim) {
  if (!s.cure) return null;
  const pct = nitPct();
  if (s.cure === 'custom' && !(pct >= 0.1 && pct <= 7)) return { bad: 'pct' };
  if (!(s.meatG > 0 && Number.isFinite(s.meatG)) || (s.wet && !(s.waterMl > 0 && Number.isFinite(s.waterMl)))) return { bad: 'weight' };
  const target = Math.min(Math.max(0, Math.floor(s.ppm)), lim.hardStopPpm + 10);
  const common = { meatWeightGrams: s.meatG, saltPct: s.salt, sugarPct: s.sugar, cureType: s.cure, limits: lim, nitritePct: s.cure === 'custom' ? pct : undefined };
  // dragging into the red zone is allowed, but no dose is shown or computed past the stop
  const over = target > lim.hardStopPpm;
  const t = Math.min(target, lim.hardStopPpm);
  const r = s.wet ? calcBrine({ ...common, waterGrams: s.waterMl, targetPpm: t }) : calcDryCure({ ...common, targetPpm: t });
  return { r, over, target };
}

// ── full render (on discrete changes) ───────────────────────────────────────
function render() {
  const lim = limits();
  document.querySelectorAll('#seg-method button').forEach((b) => b.classList.toggle('on', (b.dataset.m === 'wet') === s.wet));
  $('dish-count').textContent = String(Object.keys(MEAT_KEYS).filter((m) => !s.wet || supportsWet(m)).length);
  $('meat').innerHTML = Object.keys(MEAT_KEYS).map((m) => {
    const off = s.wet && !supportsWet(m);
    return `<option value="${m}" ${off ? 'disabled' : ''} ${m === s.meat ? 'selected' : ''}>${meatLabel(m)}${off ? ' — ' + T.dryOnly : ''}</option>`;
  }).join('');
  renderWeight();
  const c = compute(lim);
  renderNitrite(lim, c);
  renderSalt(c);
  renderSugar(c);
  renderResults(lim, c);
  paint();
}

function renderWeight() {
  const el = $('card-weight');
  const slider = (id, v) => `<input class="sl" id="${id}" type="range" min="0" max="1000" step="1" value="${toTravel(v)}">`;
  if (!s.wet) {
    el.innerHTML = `<div class="cc__h"><span class="eyebrow">// ${T.meatWeight}</span>${unitSelect()}</div>${bigNumber('meatIn', toDisplayW(s.meatG), T[s.unit])}${slider('meatSl', s.meatG)}`;
  } else {
    const pct = s.meatG > 0 ? Math.round((s.waterMl / s.meatG) * 100) : 0;
    el.innerHTML = `<div class="cc__h"><span class="eyebrow">// ${T.meatWeight} · ${T.water}</span>${unitSelect()}</div>
      <div class="cols"><div><div class="eyebrow eyebrow--c">${T.meatWeight.toUpperCase()}</div>${bigNumber('meatIn', toDisplayW(s.meatG), T[s.unit], 'big--sm')}${slider('meatSl', s.meatG)}</div>
      <div><div class="eyebrow eyebrow--c" id="water-lbl">${T.waterOf(pct).toUpperCase()}</div>${bigNumber('waterIn', toDisplayV(s.waterMl), T[vUnit()], 'big--sm')}${slider('waterSl', s.waterMl)}</div></div>`;
  }
  $('unit').addEventListener('change', (e) => { s.unit = e.target.value; render(); });
  $('meatSl').addEventListener('input', (e) => { s.meatG = toGrams(+e.target.value); s.reducedFrom = null; softUpdate(); });
  $('meatIn').addEventListener('change', (e) => { const g = fromDisplayW(e.target.value); if (g > 0 && Number.isFinite(g)) s.meatG = g; s.reducedFrom = null; render(); });
  if (s.wet) {
    $('waterSl').addEventListener('input', (e) => { s.waterMl = toGrams(+e.target.value); s.reducedFrom = null; softUpdate(); });
    $('waterIn').addEventListener('change', (e) => { const v = fromDisplayV(e.target.value); if (v > 0 && Number.isFinite(v)) s.waterMl = v; s.reducedFrom = null; render(); });
  }
}

function nitriteHead(lim, c) {
  if (!(c && c.r)) return { head: `<div class="headline mut">${T.pick.replace('…', '')}</div>`, stat: '' };
  const ppm = c.over ? c.target : c.r.nitritePpm;
  const [col, lab] = bandInfo(nitriteAdvice({ ppm, limits: lim, meat: s.meat }).band);
  return {
    head: `<div class="headline"><b>${c.over ? '— ' + T.g : fmtG(c.r.cureGrams) + ' ' + T.g}</b><span> · ${ppm} ppm</span></div>`,
    stat: status(col, lab, T.recMark(lim.recommendedPpm)),
  };
}

function renderNitrite(lim, c) {
  const scaleMax = lim.hardStopPpm + 10;
  const stopF = lim.hardStopPpm / scaleMax, recF = Math.min(lim.recommendedPpm / scaleMax, stopF), minF = Math.min(NITRITE_PROTECTIVE_MIN_PPM / scaleMax, recF);
  const zones = [[minF, 'accent'], [recF - minF, 'success'], [stopF - recF, 'warning'], [1 - stopF, 'danger']];
  const options = `<option value="">${T.pick}</option>` + CURES.map((k) => {
    const off = k === 'cure2' && !lim.allowsCure2;
    const p = k === 'custom' ? s.customPct : NIT_PCT[k];
    return `<option value="${k}" ${off ? 'disabled' : ''} ${k === s.cure ? 'selected' : ''}>${T[k]} · ${String(p).replace('.', LANG === 'uk' ? ',' : '.')}%${off ? ' — ' + T.cure2Blocked : ''}</option>`;
  }).join('');
  const { head, stat } = nitriteHead(lim, c);
  $('card-nitrite').innerHTML = `<div class="cc__h"><span class="eyebrow">// ${T.nitrite}</span></div>
    <select class="ms-input" id="cure">${options}</select>
    ${s.cure === 'custom' ? `<div class="pct-row"><label for="pct">${T.pct}</label><input class="ms-input" id="pct" type="text" inputmode="decimal" value="${s.customPct}"></div>` : ''}
    <p class="calc-hint">${T.saltHint}</p>
    ${head}
    ${zonedSlider('ppm', 0, scaleMax, 1, Math.min(s.ppm, scaleMax), zones, s.cure ? '' : 'disabled')}
    ${stat}
    ${c && c.r && s.wet ? `<p class="calc-hint">${fill(A.calcBrineNitriteNote, { ppm: lim.hardStopPpm })}</p>` : ''}`;
  $('cure').addEventListener('change', (e) => { s.cure = e.target.value; s.reducedFrom = null; render(); });
  if ($('pct')) $('pct').addEventListener('change', (e) => { const v = parse(e.target.value); s.customPct = Number.isFinite(v) ? v : 0; render(); });
  $('ppm').addEventListener('input', (e) => { s.ppm = +e.target.value; s.ppmTouched = true; s.reducedFrom = null; softUpdate(); });
  // letting go in the red: like the app, bring the dose back to the limit and say so
  $('ppm').addEventListener('change', (e) => {
    if (+e.target.value > lim.hardStopPpm) { s.reducedFrom = Math.floor(+e.target.value); s.ppm = lim.hardStopPpm; }
    render();
  });
}

const pctHeader = (label, grams, pct) =>
  `<div class="cc__h"><span class="eyebrow">// ${label}</span><span class="headline headline--sm"><b>${nfp(1).format(grams)} ${T.g}</b><span> · ${nfp(1).format(pct)}%</span></span></div>`;

// below this % the cure mix alone already carries the salt target (the app's _floorPct)
function saltFloor(c) {
  if (!(c && c.r)) return 0;
  const fromCure = c.r.cureGrams * (1 - c.r.nitritePct / 100);
  return Math.min(6, Math.max(0, (fromCure / baseGrams()) * 100));
}
const fromCureG = (c) => (c && c.r ? c.r.cureGrams * (1 - c.r.nitritePct / 100) : 0);

function renderSalt(c) {
  const grams = c && c.r ? c.r.saltGrams : (baseGrams() * s.salt) / 100;
  const [col, lab] = saltInfo(saltBand(s.salt));
  const fc = fromCureG(c);
  $('card-salt').innerHTML = `${pctHeader(T.salt, grams, s.salt)}
    ${zonedSlider('salt', 0, 6, 0.1, s.salt, zonesOf(SALT_BREAKS, SALT_COLORS))}
    ${status(col, lab, T.normSalt)}
    <p class="calc-hint mono" id="from-cure" ${fc > 0.05 ? '' : 'hidden'}>${T.fromCure(nfp(1).format(fc))}</p>`;
  $('salt').addEventListener('input', (e) => { let v = +e.target.value; const fl = saltFloor(compute(limits())); if (v < fl) v = fl; s.salt = Math.round(v * 100) / 100; softUpdate(); });
}

function renderSugar(c) {
  const grams = c && c.r ? c.r.sugarGrams : (baseGrams() * s.sugar) / 100;
  const [col, lab] = sugarInfo(sugarBand(s.sugar));
  $('card-sugar').innerHTML = `${pctHeader(T.sugar, grams, s.sugar)}
    ${zonedSlider('sugar', 0, 5, 0.1, s.sugar, zonesOf(SUGAR_BREAKS, SUGAR_COLORS))}
    ${status(col, lab, T.normSugar)}`;
  $('sugar').addEventListener('input', (e) => { s.sugar = Math.round(+e.target.value * 10) / 10; softUpdate(); });
}

function renderResults(lim, c) {
  const out = $('out');
  if (!c) { out.innerHTML = `<p class="calc-empty">${T.needSalt}</p>`; return; }
  if (c.bad === 'pct') { out.innerHTML = `<p class="calc-empty">${T.pctRange}</p>`; return; }
  if (c.bad === 'weight') { out.innerHTML = `<p class="calc-empty">${T.invalid}</p>`; return; }
  const { r, over } = c;
  const alerts = [];
  const rec = lim.recommendedPpm > 0 ? lim.recommendedPpm : lim.hardStopPpm;
  if (s.reducedFrom !== null) alerts.push(alertBox('bad', A.calcNitriteWarnOverTitle, fill(A.calcNitriteWarnOverBody, { ppm: s.reducedFrom, limit: lim.hardStopPpm })));
  else if (over) alerts.push(alertBox('bad', A.calcNitriteWarnOverTitle, T.overCheck(c.target, lim.hardStopPpm)));
  else {
    const adv = nitriteAdvice({ ppm: r.nitritePpm, limits: lim, meat: s.meat });
    if (adviceNeedsPopup(adv)) {
      if (adv.band === 'high') alerts.push(alertBox('warn', A.calcNitriteWarnHighTitle, fill(A.calcNitriteWarnHighBody, { ppm: r.nitritePpm, limit: lim.hardStopPpm, rec })));
      if (adv.band === 'low') alerts.push(alertBox('bad', A.calcNitriteWarnLowTitle, fill(A.calcNitriteWarnLowBody, { ppm: r.nitritePpm, min: NITRITE_PROTECTIVE_MIN_PPM, rec })));
      if (adv.band === 'noneUnsafe') alerts.push(alertBox('bad', A.calcNitriteWarnNoneTitle, fill(A.calcNitriteWarnNoneBody, { rec }) + (s.meat === 'salami' ? ' ' + A.calcNitriteWarnNoneSalami : '')));
    }
  }
  const cells = [
    [T.cCuring, over ? '—' : fmtG(r.cureGrams), T.g],
    [T.cSalt, String(Math.round(r.saltGrams)), T.g],
    [T.cSugar, String(Math.round(r.sugarGrams)), T.g],
    [T.cNitrite, over ? String(c.target) : String(r.nitritePpm), 'ppm'],
  ];
  if (r.nitratePpm > 0 && !over) cells.push([T.cNitrate, String(r.nitratePpm), 'ppm']);
  if (s.wet) cells.push([T.cWater, String(Math.round(s.waterMl)), T.ml]);
  out.innerHTML = alerts.join('') +
    `<div class="cells">${cells.map(([l, v, u]) => `<div class="cell"><span class="eyebrow">${l.toUpperCase()}</span><b>${v}</b><span class="mut">${u}</span></div>`).join('')}</div>` +
    (s.wet && r.systemPpm !== null && !over ? `<p class="calc-hint mono">${T.cNitrite}: ${r.systemPpm} ppm · ${T.system}</p>` : '') +
    (s.meat === 'jerky' ? `<p class="calc-banner">${T.jerky}</p>` : '') +
    (s.meat === 'biltong' ? `<p class="calc-banner">${T.biltong}</p>` : '') +
    `<p class="calc-hint">${T.weighTip}</p>`;
}

// While a thumb is moving only text changes — the dragged node is never rebuilt.
function softUpdate() {
  const lim = limits();
  const c = compute(lim);
  const html = (sel, v) => { const e = document.querySelector(sel); if (e) e.innerHTML = v; };
  paint();
  const meatIn = $('meatIn'); if (meatIn && document.activeElement !== meatIn) meatIn.value = toDisplayW(s.meatG);
  const wIn = $('waterIn'); if (wIn && document.activeElement !== wIn) wIn.value = toDisplayV(s.waterMl);
  const wl = $('water-lbl'); if (wl) wl.textContent = T.waterOf(Math.round((s.waterMl / s.meatG) * 100)).toUpperCase();
  const { head, stat } = nitriteHead(lim, c);
  const nh = document.querySelector('#card-nitrite .headline'); if (nh) nh.outerHTML = head;
  const ns = document.querySelector('#card-nitrite .calc-status'); if (ns && stat) ns.outerHTML = stat;
  const base = baseGrams();
  const ok = c && c.r;
  html('#card-salt .headline', `<b>${nfp(1).format(ok ? c.r.saltGrams : (base * s.salt) / 100)} ${T.g}</b><span> · ${nfp(1).format(s.salt)}%</span>`);
  html('#card-sugar .headline', `<b>${nfp(1).format(ok ? c.r.sugarGrams : (base * s.sugar) / 100)} ${T.g}</b><span> · ${nfp(1).format(s.sugar)}%</span>`);
  const [sc, sl] = saltInfo(saltBand(s.salt));
  const sst = document.querySelector('#card-salt .calc-status'); if (sst) sst.outerHTML = status(sc, sl, T.normSalt);
  const [gc, gl] = sugarInfo(sugarBand(s.sugar));
  const gst = document.querySelector('#card-sugar .calc-status'); if (gst) gst.outerHTML = status(gc, gl, T.normSugar);
  const fc = fromCureG(c), fe = $('from-cure');
  if (fe) { fe.hidden = !(fc > 0.05); fe.textContent = T.fromCure(nfp(1).format(fc)); }
  renderResults(lim, c);
}

// ── static bits ─────────────────────────────────────────────────────────────
const setText = (id, txt) => { const e = $(id); if (e) e.textContent = txt; };
setText('t-results', T.results); setText('disclaimer', T.disclaimer);
setText('cta-title', T.ctaTitle); setText('cta-text', T.ctaText); setText('faq-link', T.faq);
build(); refit(); render();
