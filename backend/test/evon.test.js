const assert = require('assert');
const evon = require('../evon');

console.log('--- Running JanSeva AI Evon v3.3 Reasoning Tests ---');

// 1. Test Document Guidance in English and Telugu
const casteGuideEn = evon.getProcurementAdvice('Caste Certificate', 'en');
assert.ok(casteGuideEn.instructions.includes('MeeSeva'), 'Must guide citizen to MeeSeva');
assert.ok(casteGuideEn.portal.includes('meeseva'), 'Must provide MeeSeva portal URL');

const casteGuideTe = evon.getProcurementAdvice('Caste Certificate', 'te');
assert.ok(casteGuideTe.instructions.includes('మీసేవ'), 'Must provide Telugu guidance for MeeSeva');
console.log('✓ Document procurement advice for MeeSeva verified (EN & TE)');

// 2. Test Evon Counseling Synthesis for Eligible Case
const mockMatch = {
  scheme_id: 'pms-sc',
  scheme_name: 'Post-Matric Scholarship for SC Students',
  eligibility_status: 'eligible',
  target_group: 'SC students',
  official_portal: 'https://scholarships.gov.in',
  met: [{ description: 'Family income under 2.5 lakh' }],
  unmet: [],
  missing: [],
  benefits: [{ component: 'Tuition waiver and maintenance' }],
};

evon.generateCounseling({
  profile: { age: 20, occupation: 'College student' },
  match: mockMatch,
  language: 'te',
}).then((adviceTe) => {
  assert.strictEqual(adviceTe.ok, true);
  assert.ok(adviceTe.text.includes('అర్హులు'), 'Telugu advice must state eligibility clearly');
  console.log('✓ Evon Telugu eligibility counseling generated');

  return evon.generateCounseling({
    profile: { age: 20, occupation: 'College student' },
    match: mockMatch,
    language: 'en',
  });
}).then((adviceEn) => {
  assert.strictEqual(adviceEn.ok, true);
  assert.ok(adviceEn.text.includes('eligible'), 'English advice must confirm eligibility');
  console.log('✓ Evon English eligibility counseling generated');
  console.log('ALL EVON REASONING TESTS PASSED SUCCESSFULLY!');
}).catch((err) => {
  console.error('Evon test failed:', err);
  process.exit(1);
});
