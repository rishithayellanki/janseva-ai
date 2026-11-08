const fs = require('fs');
const path = require('path');
const onboarding = require('./onboarding');
const eligibility = require('./eligibility');

const dir = path.join(__dirname, '..', 'data', 'schemes');
const records = fs.readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));

// Answers are given in the order the onboarding asks the questions
function runOnboarding(answers) {
  const profile = {};
  for (const answer of answers) {
    const q = onboarding.nextQuestion(profile);
    if (!q) break;
    const r = onboarding.parse(q.field, answer, 'en');
    if (!r.ok) throw new Error(`"${answer}" not accepted for ${q.field}`);
    profile[q.field] = r.value;
  }
  return profile;
}

const cases = {
  // College student, SC, Telangana, up to 1 lakh, no land
  'College student, SC, Telangana': [
    '20', '2', 'Telangana', '1', '1', 'yes', 'yes', 'yes', 'no', 'no', 'no', 'no', 'yes', 'yes', 'no',
  ],
  // School student, BC, Telangana, government school, no land
  'School student, BC, Telangana': [
    '15', '1', 'Telangana', '2', '4', 'yes', 'yes', 'yes', 'no', 'no', 'no', 'no', 'yes',
  ],
  // Farmer, General, Andhra Pradesh, 2.5 to 3.5 lakh, owns land bought before 2019
  'Farmer, General, Andhra Pradesh': [
    '40', '3', 'Andhra Pradesh', '4', '6', 'yes', 'yes', 'yes', 'yes', 'yes', 'no', 'no', 'no',
  ],
};

for (const [name, answers] of Object.entries(cases)) {
  const profile = runOnboarding(answers);
  console.log('\n== ' + name);
  console.log('   profile:', JSON.stringify(profile));
  for (const m of eligibility.matchSchemes(records, profile)) {
    console.log('  ' + m.eligibility_status.padEnd(24) + m.scheme_id);
  }
}
