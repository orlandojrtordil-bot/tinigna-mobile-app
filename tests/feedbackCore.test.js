const test = require('node:test');
const assert = require('node:assert');
const crypto = require('node:crypto');
const core = require('../src/lib/feedbackCore');

const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const fb = (i, extra) => Object.assign({ id: 'f' + i, courseId: 'c1', day: '2026-11-09', pace: 3, clarity: 4, materials: 4, comment: '' }, extra || {});

test('code format', () => {
  assert.ok(core.isValidCodeFormat(' tn-4f7k '));
  assert.ok(!core.isValidCodeFormat('TN-4F7'));
  assert.ok(!core.isValidCodeFormat('XX-4F7K'));
});

test('validation requires 1-5 ratings and short comment', () => {
  assert.ok(core.validateFeedback({ pace: 3, clarity: 4, materials: 5, comment: 'ok' }).ok);
  assert.ok(!core.validateFeedback({ pace: 0, clarity: 4, materials: 5 }).ok);
  assert.ok(!core.validateFeedback({ pace: 3, clarity: 4, materials: 5, comment: 'x'.repeat(501) }).ok);
  assert.ok(!core.validateFeedback({ pace: 3.5, clarity: 4, materials: 5 }).ok);
});

test('scrub removes emails, numbers, handles, titled names', () => {
  const s = core.scrubComment('Email me at juan@school.edu or 0917 123 4567, @juan99, Prof. Reyes talks fast');
  assert.ok(!/juan@school/.test(s));
  assert.ok(!/0917/.test(s));
  assert.ok(!/@juan99/.test(s));
  assert.ok(!/Reyes/.test(s));
  assert.ok(/talks fast/.test(s));
});

test('feedback record has no identity fields and only a day, not a time', () => {
  const rec = core.buildFeedbackRecord({ id: 'x', courseId: 'c1', pace: 2, clarity: 3, materials: 4, comment: 'hi', now: Date.UTC(2026, 10, 9, 14, 33, 12) });
  assert.deepStrictEqual(Object.keys(rec).sort(), ['clarity', 'comment', 'courseId', 'day', 'id', 'materials', 'pace']);
  assert.strictEqual(rec.day, '2026-11-09');
  assert.ok(!JSON.stringify(rec).includes('14:33'));
});

test('duplicate blocking uses a receipt that is not in the feedback record', () => {
  const r = sha(core.receiptInput('tn-4f7k', 'device-secret-1'));
  let receipts = [];
  assert.ok(!core.hasReceipt(receipts, r));
  receipts = core.addReceipt(receipts, r);
  assert.ok(core.hasReceipt(receipts, r));
  const other = sha(core.receiptInput('TN-4F7K', 'device-secret-2'));
  assert.ok(!core.hasReceipt(receipts, other));
  const rec = core.buildFeedbackRecord({ id: 'x', courseId: 'c1', pace: 2, clarity: 3, materials: 4, comment: '', now: Date.now() });
  assert.ok(!JSON.stringify(rec).includes(r));
});

test('receipts stay sorted so order does not reveal who submitted first', () => {
  let r = [];
  for (const x of ['d', 'a', 'c', 'b']) r = core.addReceipt(r, x);
  assert.deepStrictEqual(r, ['a', 'b', 'c', 'd']);
});

test('summary stays locked below 5 responses and leaks nothing', () => {
  const s = core.summarize([fb(1, { comment: 'too fast' }), fb(2), fb(3), fb(4)]);
  assert.strictEqual(s.unlocked, false);
  assert.strictEqual(s.needed, 1);
  assert.deepStrictEqual(Object.keys(s).sort(), ['count', 'min', 'needed', 'unlocked']);
});

test('summary unlocks at 5 and only shows themes with 2+ mentions', () => {
  const list = [
    fb(1, { comment: 'The lesson moves too fast' }),
    fb(2, { comment: 'Pace is too fast for me' }),
    fb(3, { comment: 'More worked examples please' }),
    fb(4, { comment: '' }),
    fb(5, { comment: 'Please share slides before class' })
  ];
  const s = core.summarize(list);
  assert.strictEqual(s.unlocked, true);
  assert.strictEqual(s.count, 5);
  const ids = s.themes.map(t => t.id);
  assert.ok(ids.includes('pace'));
  assert.ok(!ids.includes('examples'));
  assert.ok(!ids.includes('materials'));
  assert.strictEqual(s.averages.pace, 3);
});

test('shuffle keeps all items', () => {
  const a = [1, 2, 3, 4, 5, 6];
  assert.deepStrictEqual(core.shuffle(a).sort(), a);
});
