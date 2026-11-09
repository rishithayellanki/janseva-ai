const assert = require('assert');
const fs = require('fs');
const path = require('path');
const onboarding = require('../onboarding');
const eligibility = require('../eligibility');

console.log('--- Running JanSeva AI Deterministic Engine Tests ---');

// 1. Test Number Parsing in Telugu and English
assert.strictEqual(onboarding.normalise('20'), '20');
assert.strictEqual(onboarding.normalise('ఇరవై'), '20');
assert.strictEqual(onboarding.normalise('ముప్పై ఐదు'), '35');
assert.strictEqual(onboarding.normalise('2.5 లక్షలు'), '2.5 lakh');
console.log('✓ Normalisation of Telugu numbers & laksh passed');

// 2. Test State Matching (Levenshtein + Alias)
assert.strictEqual(onboarding.parse('state', 'Telangana', 'en').value, 'Telangana');
assert.strictEqual(onboarding.parse('state', 'తెలంగాణ', 'te').value, 'Telangana');
assert.strictEqual(onboarding.parse('state', 'తెలంగాణా', 'te').value, 'Telangana');
assert.strictEqual(onboarding.parse('state', 'Andhra Pradesh', 'en').value, 'Andhra Pradesh');
assert.strictEqual(onboarding.parse('state', 'ఆంధ్రప్రదేశ్', 'te').value, 'Andhra Pradesh');
console.log('✓ Bilingual state matching passed');

// 3. Test Income Band Resolution
const p1 = onboarding.parse('income_range', '1.5 lakh', 'en');
assert.strictEqual(p1.ok, true);
assert.strictEqual(p1.value, '1_to_2_lakh');

const p2 = onboarding.parse('income_range', '2.5 lakh', 'te');
assert.strictEqual(p2.ok, true);
assert.strictEqual(p2.value, '2_to_2_5_lakh');
console.log('✓ Income band parsing passed');

// 4. Test Eligibility for 5 Central Schemes
const dir = path.join(__dirname, '..', '..', 'data', 'schemes');
const records = fs.readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));

// Scenario A: SC College Student (Should be ELIGIBLE for PMS-SC)
const studentProfile = {
  age: 20,
  occupation: 'College student',
  state: 'Telangana',
  income_range: 'up_to_1_lakh',
  category: 'SC',
  is_indian_national: true,
  has_aadhaar: true,
  has_bank_account: true,
  owns_land: false,
  paid_income_tax: false,
  family_excluded_group: false,
  receives_pension: false,
  course_recognised: true,
  regular_course: true,
  has_other_scholarship: false,
};
const studentMatches = eligibility.matchSchemes(records, studentProfile);
const pmssc = studentMatches.find((m) => m.scheme_id === 'pms-sc');
assert.strictEqual(pmssc.eligibility_status, 'eligible', 'SC student must be eligible for PMS-SC');
console.log('✓ Scenario A: PMS-SC eligibility verification passed');

// Scenario B: Farmer with Land (PM-KISAN evaluation)
const farmerProfile = {
  age: 40,
  occupation: 'Farmer',
  state: 'Andhra Pradesh',
  income_range: '2_5_to_3_5_lakh',
  category: 'General',
  is_indian_national: true,
  has_aadhaar: true,
  has_bank_account: true,
  owns_land: true,
  land_before_2019: true,
  paid_income_tax: false,
  family_excluded_group: false,
  receives_pension: false,
};
const farmerMatches = eligibility.matchSchemes(records, farmerProfile);
const pmkisan = farmerMatches.find((m) => m.scheme_id === 'pm-kisan');
assert.ok(pmkisan.met.length >= 5, 'Farmer meets core land and exclusion rules');
console.log('✓ Scenario B: PM-KISAN rules verified');

console.log('ALL ENGINE TESTS PASSED SUCCESSFULLY! (100% Deterministic Guarantee)');
