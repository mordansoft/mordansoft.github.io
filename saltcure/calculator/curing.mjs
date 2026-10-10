// Port of the SaltCure app core (lib/domain/curing/*.dart). Pure functions, no DOM.
// Every number traces to formulas_fsis.md (§3 limits, §4 formulas). Do not
// change a constant here without changing the app and the spec first — the two
// must agree, and curing.test.mjs holds the same vectors as the Dart tests.

export const CURE_TYPES = {
  cure1: { nitritePct: 6.25, nitratePct: 0 },
  cure2: { nitritePct: 6.25, nitratePct: 4 },
  peklosol: { nitritePct: 0.6, nitratePct: 0 },
  nps: { nitritePct: 0.5, nitratePct: 0 },
  custom: { nitritePct: 0.6, nitratePct: 0 },
};

export const MEATS = ['bacon', 'canadianBacon', 'jerky', 'biltong', 'pancetta', 'salami', 'custom'];

export const supportsWet = (meat) => ['bacon', 'canadianBacon', 'jerky', 'custom'].includes(meat);

// Protective floor, ppm (practice, nitrite-levels-spec §2).
export const NITRITE_PROTECTIVE_MIN_PPM = 100;

export function limitsOf(meat, method) {
  switch (meat) {
    case 'bacon':
      return method === 'wet'
        ? { recommendedPpm: 120, hardStopPpm: 120, nitrateStopPpm: null, allowsCure2: false }
        : { recommendedPpm: 156, hardStopPpm: 200, nitrateStopPpm: null, allowsCure2: false };
    case 'canadianBacon':
      return { recommendedPpm: 156, hardStopPpm: 200, nitrateStopPpm: null, allowsCure2: false };
    case 'jerky':
      return { recommendedPpm: 156, hardStopPpm: 156, nitrateStopPpm: null, allowsCure2: false };
    case 'biltong':
      return { recommendedPpm: 0, hardStopPpm: 156, nitrateStopPpm: null, allowsCure2: false };
    case 'pancetta':
      return { recommendedPpm: 156, hardStopPpm: 625, nitrateStopPpm: 2187, allowsCure2: true };
    case 'salami':
      return { recommendedPpm: 156, hardStopPpm: 156, nitrateStopPpm: 1718, allowsCure2: true };
    case 'custom':
      return { recommendedPpm: 156, hardStopPpm: 625, nitrateStopPpm: 2187, allowsCure2: true };
    default:
      throw new Error('unknown meat ' + meat);
  }
}

export const acceptableOverPpm = (limits) => Math.round((limits.recommendedPpm * 5) / 4);

// ── rounding (§4.5): nitrite only ever rounds DOWN ─────────────────────────
const EPS = 1e-6;
const floor01 = (v) => Math.floor(v * 10 + EPS) / 10;
const floorInt = (v) => Math.floor(v + EPS);
const WHOLE_GRAM_FROM = 10;

function cureFromPpm(w, ppm, f) {
  const exact = (w * ppm) / (f * 1e6);
  return exact >= WHOLE_GRAM_FROM ? Math.floor(exact) : floor01(exact);
}

export const cureGramsForPpm = ({ basisGrams, ppm, nitritePct }) =>
  cureFromPpm(basisGrams, ppm, nitritePct / 100);

function invalid(cureType, nitritePct) {
  return {
    saltGrams: 0, sugarGrams: 0, cureGrams: 0, nitritePpm: 0, cureType, nitritePct,
    status: 'invalidWeight', nitratePpm: 0, systemPpm: null, limitPpm: null,
    fixToLimitGrams: 0, saltCoveredByCure: false,
  };
}

function evaluate({ cureGrams, saltPct, sugarPct, cureType, nitritePct, limits, ppmBasisGrams, saltBaseGrams, systemPpm = null }) {
  const f = nitritePct / 100;
  const ppmExact = (cureGrams * f * 1e6) / ppmBasisGrams;
  const displayPpm = floorInt(ppmExact);

  let status;
  if (ppmExact > limits.hardStopPpm + EPS) status = 'overLimit';
  else if (ppmExact > limits.recommendedPpm + EPS) status = 'warn';
  else status = 'ok';

  const saltFromCure = cureGrams * (1 - f);
  const rawExtraSalt = Math.round(saltBaseGrams * (saltPct / 100) - saltFromCure);
  const saltCoveredByCure = rawExtraSalt <= 0;
  const saltGrams = saltCoveredByCure ? 0 : rawExtraSalt;
  const sugarGrams = Math.round(saltBaseGrams * (sugarPct / 100));

  const nitratePct = CURE_TYPES[cureType].nitratePct;
  const nitratePpm = nitratePct > 0 ? floorInt((cureGrams * (nitratePct / 100) * 1e6) / ppmBasisGrams) : 0;

  return {
    saltGrams, sugarGrams, cureGrams, nitritePpm: displayPpm, cureType, nitritePct, status,
    nitratePpm, systemPpm, limitPpm: limits.hardStopPpm,
    fixToLimitGrams: cureFromPpm(ppmBasisGrams, limits.hardStopPpm, f), saltCoveredByCure,
  };
}

export function calcDryCure({ meatWeightGrams, saltPct, sugarPct, cureType, limits, targetPpm, nitritePct }) {
  const pct = nitritePct ?? CURE_TYPES[cureType].nitritePct;
  if (!(meatWeightGrams > 0)) return invalid(cureType, pct);
  const cureGrams = cureFromPpm(meatWeightGrams, targetPpm, pct / 100);
  return evaluate({ cureGrams, saltPct, sugarPct, cureType, nitritePct: pct, limits, ppmBasisGrams: meatWeightGrams, saltBaseGrams: meatWeightGrams });
}

// Wet brine (§4.2): nitrite dosed on the WATER, verdict on the brine, salt on meat + water.
export function calcBrine({ meatWeightGrams, waterGrams, saltPct, sugarPct, cureType, limits, targetPpm, nitritePct }) {
  const pct = nitritePct ?? CURE_TYPES[cureType].nitritePct;
  if (!(meatWeightGrams > 0) || !(waterGrams > 0)) return invalid(cureType, pct);
  const f = pct / 100;
  const cureGrams = cureFromPpm(waterGrams, targetPpm, f);
  const totalMass = meatWeightGrams + waterGrams;
  const systemPpm = floorInt((cureGrams * f * 1e6) / totalMass);
  return evaluate({ cureGrams, saltPct, sugarPct, cureType, nitritePct: pct, limits, ppmBasisGrams: waterGrams, saltBaseGrams: totalMass, systemPpm });
}

// A dose the user typed in grams — this is where the hard-stop block fires.
export function evaluateCureGrams({ meatWeightGrams, cureGrams, saltPct, sugarPct, cureType, limits, nitritePct, waterGrams = null }) {
  const pct = nitritePct ?? CURE_TYPES[cureType].nitritePct;
  if (!(meatWeightGrams > 0)) return invalid(cureType, pct);
  const wet = waterGrams !== null;
  if (wet && !(waterGrams > 0)) return invalid(cureType, pct);
  const f = pct / 100;
  const totalMass = meatWeightGrams + (waterGrams ?? 0);
  return evaluate({
    cureGrams, saltPct, sugarPct, cureType, nitritePct: pct, limits,
    ppmBasisGrams: wet ? waterGrams : meatWeightGrams,
    saltBaseGrams: wet ? totalMass : meatWeightGrams,
    systemPpm: wet ? floorInt((cureGrams * f * 1e6) / totalMass) : null,
  });
}

// ── advice bands ───────────────────────────────────────────────────────────

export function riskOf(meat) {
  if (meat === 'biltong') return 'notNeeded';
  if (meat === 'bacon' || meat === 'canadianBacon') return 'cooked';
  if (meat === 'jerky') return 'dried';
  return 'curedRaw'; // pancetta, salami, custom
}

export function nitriteAdvice({ ppm, limits, meat }) {
  const risk = riskOf(meat);
  if (ppm <= 0) {
    const band = risk === 'notNeeded' ? 'noneOk' : risk === 'curedRaw' ? 'noneUnsafe' : 'noneBare';
    return { band, risk };
  }
  const rec = limits.recommendedPpm > 0 ? limits.recommendedPpm : limits.hardStopPpm;
  const accept = limits.recommendedPpm > 0 ? acceptableOverPpm(limits) : limits.hardStopPpm;
  let band;
  if (ppm > limits.hardStopPpm) band = 'over';
  else if (ppm > accept) band = 'high';
  else if (ppm > rec) band = 'above';
  else if (ppm < NITRITE_PROTECTIVE_MIN_PPM) band = 'low';
  else band = 'ok';
  return { band, risk };
}

export const adviceNeedsPopup = ({ band, risk }) =>
  band === 'over' || band === 'high' || band === 'noneUnsafe' ||
  (band === 'low' && (risk === 'dried' || risk === 'curedRaw'));

export function saltBand(pct) {
  if (pct < 1.5) return 'under';
  if (pct < 2.0) return 'low';
  if (pct <= 3.5) return 'normal';
  if (pct <= 4.5) return 'high';
  return 'over';
}

export function sugarBand(pct) {
  if (pct <= 0) return 'none';
  if (pct < 0.3) return 'low';
  if (pct <= 2.5) return 'normal';
  if (pct < 4.5) return 'high';
  return 'max';
}

// ── units (§4.5): inside, always grams; exact factors ──────────────────────
export const G_PER_OZ = 28.349523125;
export const G_PER_LB = 453.59237;
