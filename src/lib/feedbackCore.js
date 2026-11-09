// Pure logic for TinigNa. No React, no storage, no network, so it can be unit-tested with plain Node.
// The anonymity rules live here:
//   1. A feedback record never contains a student ID, device ID, receipt, or exact time.
//   2. Duplicate submissions are blocked with a one-way "receipt" kept in a SEPARATE list from feedback.
//   3. Summaries stay locked until MIN_RESPONSES responses exist.

const MIN_RESPONSES = 5;   // summaries hidden below this many responses
const THEME_MIN = 2;       // a theme needs this many mentions before it is shown
const MAX_COMMENT = 500;
const CODE_RE = /^TN-[A-Z0-9]{4}$/;

const THEMES = [
  { id: 'pace', label: 'Pace too fast', test: /\b(too fast|moves? fast|too quick|rush(ed|ing)?|pace|slow down)\b/i },
  { id: 'examples', label: 'Need more examples', test: /\b(examples?|worked|walk ?through|demo|sample)\b/i },
  { id: 'materials', label: 'Share materials earlier', test: /\b(slides?|materials?|notes|handouts?|upload|before class)\b/i },
  { id: 'deadlines', label: 'Too many deadlines', test: /\b(deadlines?|workload|too many (tasks|activities|requirements)|due)\b/i },
  { id: 'clarity', label: 'Explanations unclear', test: /\b(unclear|confus(ed|ing)|hard to follow|don'?t understand|explain)\b/i }
];

function normalizeCode(s) {
  return String(s || '').trim().toUpperCase().replace(/\s+/g, '');
}
function isValidCodeFormat(s) {
  return CODE_RE.test(normalizeCode(s));
}

function validateFeedback(input) {
  const errors = {};
  for (const k of ['pace', 'clarity', 'materials']) {
    const v = input && input[k];
    if (!Number.isInteger(v) || v < 1 || v > 5) errors[k] = 'Choose a rating from 1 to 5.';
  }
  const c = (input && input.comment) || '';
  if (c.length > MAX_COMMENT) errors.comment = 'Comment must be ' + MAX_COMMENT + ' characters or fewer.';
  return { ok: Object.keys(errors).length === 0, errors };
}

// Removes details that could identify the writer or a named person. Best-effort: it reduces risk, it does not guarantee anonymity.
function scrubComment(text) {
  let t = String(text || '').trim();
  t = t.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email removed]');
  t = t.replace(/https?:\/\/\S+/gi, '[link removed]');
  t = t.replace(/@\w{2,}/g, '[handle removed]');
  t = t.replace(/(\+?\d[\d\s-]{7,}\d)/g, '[number removed]');
  t = t.replace(/\b(Prof\.?|Professor|Sir|Ma'?am|Mr\.?|Ms\.?|Mrs\.?|Dr\.?)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?/g, '[name removed]');
  return t;
}

// Day only (UTC). Exact times are never stored, so a response cannot be matched to when someone submitted.
function dayBucket(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}

function buildFeedbackRecord({ id, courseId, pace, clarity, materials, comment, now }) {
  return {
    id,
    courseId,
    day: dayBucket(now),
    pace, clarity, materials,
    comment: scrubComment(comment)
  };
}

// The receipt is a hash of course code + a secret that only lives on the student's device.
// It is stored with the COURSE, never with the feedback record.
function receiptInput(courseCode, deviceSecret) {
  return normalizeCode(courseCode) + ':' + deviceSecret;
}

// Keep receipts sorted so their order never reveals who submitted first.
function addReceipt(receipts, receipt) {
  return Array.from(new Set([...receipts, receipt])).sort();
}
function hasReceipt(receipts, receipt) {
  return receipts.includes(receipt);
}

function shuffle(arr, rng) {
  const r = rng || Math.random;
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isUnlocked(count, min) {
  return count >= (min === undefined ? MIN_RESPONSES : min);
}

function avg(nums) {
  if (!nums.length) return 0;
  return Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 10) / 10;
}

function themeComments(comments) {
  const out = [];
  for (const th of THEMES) {
    const mentions = comments.filter(c => th.test.test(c)).length;
    if (mentions >= THEME_MIN) out.push({ id: th.id, label: th.label, mentions });
  }
  return out.sort((a, b) => b.mentions - a.mentions);
}

// Returns only counts while locked. Comments and averages are withheld until enough responses exist.
function summarize(feedback, min) {
  const m = min === undefined ? MIN_RESPONSES : min;
  const count = feedback.length;
  if (!isUnlocked(count, m)) return { count, unlocked: false, needed: m - count, min: m };
  const comments = feedback.map(f => f.comment).filter(Boolean);
  return {
    count,
    unlocked: true,
    min: m,
    averages: {
      pace: avg(feedback.map(f => f.pace)),
      clarity: avg(feedback.map(f => f.clarity)),
      materials: avg(feedback.map(f => f.materials))
    },
    overall: avg(feedback.flatMap(f => [f.pace, f.clarity, f.materials])),
    themes: themeComments(comments),
    comments: shuffle(comments)
  };
}

module.exports = {
  MIN_RESPONSES, THEME_MIN, MAX_COMMENT, THEMES,
  normalizeCode, isValidCodeFormat, validateFeedback, scrubComment, dayBucket,
  buildFeedbackRecord, receiptInput, addReceipt, hasReceipt, shuffle, isUnlocked, summarize, themeComments
};
