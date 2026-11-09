const fs = require('fs');
const path = require('path');

const [id, url] = process.argv.slice(2);
if (!id || !/^https:\/\//.test(url || '')) {
  console.log('Usage: node set-source.js <scheme_id> <https url>');
  process.exit(1);
}
const file = path.join(__dirname, '..', 'data', 'schemes', `${id}.json`);
if (!fs.existsSync(file)) {
  console.log('No record for', id);
  process.exit(1);
}
const record = JSON.parse(fs.readFileSync(file, 'utf8'));
record.source_url = url;
fs.writeFileSync(file, JSON.stringify(record, null, 2) + '\n');
console.log('Set source_url for', id);
