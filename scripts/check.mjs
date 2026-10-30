import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { groupByCause, uniqueById, sameCause, readAs, dayFirst } from '../src/lib/kb/causes.ts';
import { DEDUPE_CASES } from '../src/lib/kb/dedupe-cases.ts';
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const rows = read('../src/lib/data/reports-4471.json');
const tenants = readdirSync(new URL('../src/lib/data/tenants/', import.meta.url))
  .map((name) => read('../src/lib/data/tenants/' + name));
const tenantOf = (r) => tenants.find((t) => t.handle === r.tenant);
assert(tenants.every((t) => dayFirst(t.locale)));
const reports = uniqueById(rows).filter((r) => r.mergedInto === 4471);
const groups = groupByCause(reports, tenantOf);
assert.equal(rows.length, 427);
assert.equal(reports.length, 412);
assert.deepEqual(Object.fromEntries(groups.map((g) => [g.cause, g.reports.length])), { parser: 379, hint: 33 });
assert.equal(groups.reduce((n, g) => n + g.reports.length, 0), reports.length);
assert.deepEqual(DEDUPE_CASES.map(({a,b}) => sameCause(a, tenantOf(a), b, tenantOf(b))), [true, false, false, true, false]);
const notes = read('../src/lib/data/desk-notes.json');
assert.equal(readAs(groups[0], notes.oneDayMove), 5);
assert.equal(readAs(groups[1], notes.oneDayMove), 0);
console.log(JSON.stringify({
  source: 'kb-export-267efc5e.zip / supplied causes.ts and tenant directory',
  rows: rows.length,
  uniqueMergedReports: reports.length,
  groups: groups.map((g) => ({...g, reports: g.reports.map((r) => r.id)})),
  mislabelled: groups.reduce((n,g) => n + g.reports.filter((r) => r.meta.intakeTag !== g.cause).length, 0),
  exceptions: notes.oneDayMove,
  dedupeCasesPassed: DEDUPE_CASES.length
}, null, 2));
