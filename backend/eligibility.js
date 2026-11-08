// Eligibility engine. Reads scheme records and the user's answers, and returns
// Eligible, Needs more information, or Not eligible for each scheme.
// A missing or "not sure" answer never counts as a failed condition.

// Income bands in rupees. Each band's edges sit on a scheme limit.
const INCOME_BANDS = {
  up_to_1_lakh:      { low: 0,      high: 100000 },
  '1_to_2_lakh':     { low: 100000, high: 200000 },
  '2_to_2_5_lakh':   { low: 200000, high: 250000 },
  '2_5_to_3_5_lakh': { low: 250000, high: 350000 },
  '3_5_to_4_5_lakh': { low: 350000, high: 450000 },
  above_4_5_lakh:    { low: 450000, high: Infinity },
};

const OPERATORS = new Set(['equals', 'lte', 'lt', 'gte', 'gt', 'in']);

// Turns the onboarding answers into the fields the scheme rules check
function deriveProfile(p) {
  const d = { ...p };
  const college = p.occupation === 'College student';
  const school = p.occupation === 'School student';

  // Land and farming
  d.owns_cultivable_land_in_records = p.owns_land;
  d.owned_land_on_2019_02_01 = p.land_before_2019;
  if (p.owns_land === true) d.has_insurable_interest = true;
  if (p.owns_land === false && p.occupation !== undefined && p.occupation !== 'Farmer') d.has_insurable_interest = false;

  // One family question covers three exclusions: a yes fails each of them
  d.govt_or_psu_employee_or_retired = p.family_excluded_group;
  d.holds_or_held_such_post = p.family_excluded_group;
  d.registered_professional = p.family_excluded_group;

  d.paid_income_tax_last_year = p.paid_income_tax;
  if (p.receives_pension === false) d.monthly_pension = 0;
  d.has_aadhaar_or_enrolment_number = p.has_aadhaar;
  d.has_bank_account = p.has_bank_account;
  d.is_indian_national = p.is_indian_national;

  if (college) {
    d.passed_matriculation = true;
    d.school_type = 'college';
    d.course_recognised = p.course_recognised;
    if (p.regular_course === true) d.course_mode = 'regular_degree';
    if (p.regular_course === false) d.course_mode = 'other';
    d.has_other_scholarship = p.has_other_scholarship;
  } else if (school) {
    d.course_mode = 'school';
    if (p.school_govt === true) d.school_type = 'government';
    if (p.school_govt === false) d.school_type = 'other';
    d.has_other_scholarship = p.has_other_scholarship;
  } else if (p.occupation !== undefined) {
    // Not a student: study-based schemes cannot apply
    d.course_recognised = false;
    d.course_mode = 'not_studying';
    d.school_type = 'not_student';
  }

  // Aliases used by some scheme records
  d.institution_recognised = d.course_recognised;
  d.has_other_central_scholarship = d.has_other_scholarship;
  return d;
}

function compare(have, op, want) {
  switch (op) {
    case 'equals': return have === want;
    case 'lte': return have <= want;
    case 'lt': return have < want;
    case 'gte': return have >= want;
    case 'gt': return have > want;
    case 'in': return Array.isArray(want) && want.includes(have);
    default: return false;
  }
}

// Income rules: the band must sit wholly on one side of the limit
function evaluateIncome(rule, band) {
  const range = INCOME_BANDS[band];
  if (!range || rule.operator !== 'lte') return 'unknown';
  if (range.high <= rule.value) return 'met';
  if (range.low >= rule.value) return 'not_met';
  return 'unknown';
}

// Returns 'met', 'not_met', 'unknown' or 'not_applicable'
function evaluateRule(rule, d) {
  if (rule.applies_to === 'renewal') return 'not_applicable';
  if (rule.field === 'family_income_per_year') return evaluateIncome(rule, d.income_range);
  if (!OPERATORS.has(rule.operator)) return 'unknown';
  const have = d[rule.field];
  if (have === undefined || have === null) return 'unknown';
  return compare(have, rule.operator, rule.value) ? 'met' : 'not_met';
}

function evaluateScheme(record, d) {
  const checks = (record.eligibility_rules || [])
    .map((rule) => ({
      id: rule.id,
      description: rule.description,
      source_para: rule.source_para || null,
      result: evaluateRule(rule, d),
    }))
    .filter((c) => c.result !== 'not_applicable');

  const met = checks.filter((c) => c.result === 'met');
  const unmet = checks.filter((c) => c.result === 'not_met');
  const missing = checks.filter((c) => c.result === 'unknown');

  let eligibility_status = 'eligible';
  if (unmet.length) eligibility_status = 'not_eligible';
  else if (missing.length) eligibility_status = 'needs_more_information';

  return {
    scheme_id: record.scheme_id,
    scheme_name: record.scheme_name,
    target_group: record.target_group,
    eligibility_status,
    met,
    unmet,
    missing,
    required_documents: record.required_documents || [],
    application_steps: record.application_steps || [],
    official_portal: record.official_portal,
    source_document: record.source_document,
    last_verified: record.last_verified,
    deadline_note: record.deadline_note || '',
    open_items: record.open_items || [],
  };
}

const ORDER = { eligible: 0, needs_more_information: 1, not_eligible: 2 };

// Central schemes apply everywhere. State schemes apply only in their own state.
function matchSchemes(records, profile) {
  const d = deriveProfile(profile);
  return records
    .filter((r) => r.state === 'central' || r.state === profile.state)
    .map((r) => evaluateScheme(r, d))
    .sort((a, b) => ORDER[a.eligibility_status] - ORDER[b.eligibility_status]);
}

module.exports = { matchSchemes, evaluateScheme, deriveProfile, INCOME_BANDS };
