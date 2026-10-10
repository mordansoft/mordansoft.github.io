// Run: node --test saltcure/calculator/curing.test.mjs
// Same vectors as test/domain/curing/cure_calculator_test.dart in the app repo
// (formulas_fsis.md §7). A mismatch is a red test, not up for discussion.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcDryCure, calcBrine, evaluateCureGrams, limitsOf, nitriteAdvice, adviceNeedsPopup,
  saltBand, sugarBand, G_PER_LB,
} from './curing.mjs';

const baconDry = limitsOf('bacon', 'dry');
const baconWet = limitsOf('bacon', 'wet');
const jerky = limitsOf('jerky', 'dry');
const pancetta = limitsOf('pancetta', 'dry');
const within = (r) => r.status === 'ok' || r.status === 'warn';
const dry = (o) => calcDryCure({ saltPct: 2.5, sugarPct: 0, cureType: 'cure1', limits: baconDry, targetPpm: 156, ...o });

test('whole-gram steps once the dose is big enough', () => {
  const nps = dry({ meatWeightGrams: 920, sugarPct: 1, cureType: 'peklosol' });
  assert.equal(nps.cureGrams, 23);
  const c1 = dry({ meatWeightGrams: 640, sugarPct: 1 });
  assert.equal(c1.cureGrams, 1.5);
  assert.equal(c1.nitritePpm, 146);
});

test('#1 dry Cure #1 1000 g 156 → 2.4 g / 150 ppm', () => {
  const r = dry({ meatWeightGrams: 1000 });
  assert.equal(r.cureGrams, 2.4); assert.equal(r.nitritePpm, 150); assert.equal(r.status, 'ok');
});

test('#2 5 lb at the stop 200 → 7.2 g / 198 ppm', () => {
  const r = dry({ meatWeightGrams: 2268, targetPpm: 200 });
  assert.equal(r.cureGrams, 7.2); assert.equal(r.nitritePpm, 198); assert.ok(within(r));
});

test('#3 extra salt 23 g', () => {
  assert.equal(dry({ meatWeightGrams: 1000 }).saltGrams, 23);
});

test('#4 typed 5.0 g → 312 ppm BLOCK, fix 3.2 g', () => {
  const r = evaluateCureGrams({ meatWeightGrams: 1000, cureGrams: 5.0, saltPct: 2.5, sugarPct: 0, cureType: 'cure1', limits: baconDry });
  assert.equal(r.nitritePpm, 312); assert.equal(r.status, 'overLimit'); assert.equal(r.fixToLimitGrams, 3.2);
});

test('#5 exactly 3.2 g passes at 200 ppm; 3.3 g blocks', () => {
  const base = { meatWeightGrams: 1000, saltPct: 2.5, sugarPct: 0, cureType: 'cure1', limits: baconDry };
  const pass = evaluateCureGrams({ ...base, cureGrams: 3.2 });
  assert.equal(pass.nitritePpm, 200); assert.ok(within(pass));
  assert.equal(evaluateCureGrams({ ...base, cureGrams: 3.3 }).status, 'overLimit');
});

test('#6 jerky 156 limit: 2.5 g → BLOCK, fix 2.4, shows 156', () => {
  const r = evaluateCureGrams({ meatWeightGrams: 1000, cureGrams: 2.5, saltPct: 1.5, sugarPct: 0, cureType: 'cure1', limits: jerky });
  assert.equal(r.status, 'overLimit'); assert.equal(r.fixToLimitGrams, 2.4); assert.equal(r.nitritePpm, 156);
});

test('limits per preset', () => {
  const cd = limitsOf('canadianBacon', 'dry'), cw = limitsOf('canadianBacon', 'wet');
  assert.deepEqual([cd.recommendedPpm, cd.hardStopPpm], [156, 200]);
  assert.deepEqual([cw.recommendedPpm, cw.hardStopPpm], [156, 200]);
  assert.equal(cd.allowsCure2, false);
  assert.deepEqual([baconWet.recommendedPpm, baconWet.hardStopPpm], [120, 120]);
  assert.equal(baconDry.allowsCure2, false); // Cure #2 on bacon is blocked at the preset
  assert.equal(limitsOf('biltong', 'dry').recommendedPpm, 0);
  assert.deepEqual([pancetta.hardStopPpm, pancetta.nitrateStopPpm], [625, 2187]);
});

test('brine target is the strength of the brine', () => {
  const r = calcBrine({ meatWeightGrams: 850, waterGrams: 1000, saltPct: 3, sugarPct: 1, cureType: 'nps', limits: limitsOf('canadianBacon', 'wet'), targetPpm: 170 });
  assert.equal(r.cureGrams, 34); assert.equal(r.nitritePpm, 170);
  assert.ok(Math.abs((r.cureGrams * 0.005 * 1e6) / 850 - 200) <= 0.5);
});

test('dose follows the water', () => {
  const doseFor = (water) => calcBrine({ meatWeightGrams: 1000, waterGrams: water, saltPct: 3, sugarPct: 0, cureType: 'cure1', limits: baconWet, targetPpm: 120 }).cureGrams;
  assert.equal(doseFor(500), 0.9); assert.equal(doseFor(1000), 1.9);
  assert.equal(doseFor(2000), 3.8); assert.equal(doseFor(3000), 5.7);
});

test('#7 wet 1500/2000 → 3.8 g, brine 118, system 67, salt 101', () => {
  const r = calcBrine({ meatWeightGrams: 1500, waterGrams: 2000, saltPct: 3, sugarPct: 0, cureType: 'cure1', limits: baconWet, targetPpm: 120 });
  assert.equal(r.cureGrams, 3.8); assert.equal(r.nitritePpm, 118); assert.equal(r.systemPpm, 67);
  assert.equal(r.saltGrams, 101); assert.ok(within(r));
});

test('#7a wet 1:1 → 2.8 g / 116 / 58', () => {
  const r = calcBrine({ meatWeightGrams: 1500, waterGrams: 1500, saltPct: 3, sugarPct: 0, cureType: 'cure1', limits: baconWet, targetPpm: 120 });
  assert.equal(r.cureGrams, 2.8); assert.equal(r.nitritePpm, 116); assert.equal(r.systemPpm, 58);
});

test('#7b wet without water → invalid', () => {
  const r = calcBrine({ meatWeightGrams: 1500, waterGrams: 0, saltPct: 3, sugarPct: 0, cureType: 'cure1', limits: baconWet, targetPpm: 120 });
  assert.equal(r.status, 'invalidWeight'); assert.equal(r.cureGrams, 0);
});

test('#13 0.5% cure salt covers the salt target → 0 g', () => {
  const r = dry({ meatWeightGrams: 1000, cureType: 'nps' });
  assert.equal(r.cureGrams, 31); assert.equal(r.saltGrams, 0); assert.equal(r.saltCoveredByCure, true);
});

test('#8 3 lb → 3.3 g / 151 ppm', () => {
  const r = dry({ meatWeightGrams: 3 * G_PER_LB });
  assert.equal(r.cureGrams, 3.3); assert.equal(r.nitritePpm, 151);
});

test('#9 zero / negative weight → invalid', () => {
  for (const w of [0, -100]) {
    const r = dry({ meatWeightGrams: w });
    assert.equal(r.status, 'invalidWeight'); assert.equal(r.cureGrams, 0);
  }
});

test('#10 Cure #2 pancetta 2.5 g → nitrite 156, nitrate 100', () => {
  const r = evaluateCureGrams({ meatWeightGrams: 1000, cureGrams: 2.5, saltPct: 2.5, sugarPct: 0, cureType: 'cure2', limits: pancetta });
  assert.equal(r.nitritePpm, 156); assert.equal(r.nitratePpm, 100); assert.ok(within(r));
});

test('#11 custom 0.5% → 30.0 g', () => {
  const r = dry({ meatWeightGrams: 1000, cureType: 'custom', nitritePct: 0.5, targetPpm: 150 });
  assert.equal(r.cureGrams, 30); assert.equal(r.nitritePpm, 150); assert.equal(r.nitritePct, 0.5); assert.equal(r.status, 'ok');
});

test('#12 peklosól 0.6% → 25.0 g', () => {
  const r = dry({ meatWeightGrams: 1000, cureType: 'peklosol', targetPpm: 150 });
  assert.equal(r.cureGrams, 25); assert.equal(r.nitritePpm, 150); assert.equal(r.nitritePct, 0.6);
});

test('nitrite is never rounded up: dose never exceeds the target', () => {
  for (const w of [333, 777, 1234, 2501, 99]) for (const ppm of [100, 120, 156, 200]) {
    const r = dry({ meatWeightGrams: w, targetPpm: ppm, limits: limitsOf('custom', 'dry') });
    assert.ok(r.nitritePpm <= ppm, `${w} g @ ${ppm} → ${r.nitritePpm}`);
  }
});

test('nitrite verdict bands', () => {
  const adv = (meat, ppm, method = 'dry') => nitriteAdvice({ ppm, limits: limitsOf(meat, method), meat });
  assert.equal(adv('bacon', 156).band, 'ok');
  assert.equal(adv('bacon', 190).band, 'above');
  assert.equal(adv('bacon', 196).band, 'high');
  assert.equal(adv('bacon', 201).band, 'over');
  assert.equal(adv('pancetta', 0).band, 'noneUnsafe');
  assert.equal(adv('bacon', 0).band, 'noneBare');
  assert.equal(adv('biltong', 0).band, 'noneOk');
  assert.equal(adv('jerky', 60).band, 'low');
  assert.ok(adviceNeedsPopup(adv('jerky', 60)));
  assert.ok(!adviceNeedsPopup(adv('bacon', 60)));
  assert.equal(adv('biltong', 120).band, 'ok');
});

test('salt and sugar bands', () => {
  assert.equal(saltBand(1.4), 'under'); assert.equal(saltBand(2.5), 'normal'); assert.equal(saltBand(4.6), 'over');
  assert.equal(sugarBand(0), 'none'); assert.equal(sugarBand(1), 'normal'); assert.equal(sugarBand(4.5), 'max');
});
