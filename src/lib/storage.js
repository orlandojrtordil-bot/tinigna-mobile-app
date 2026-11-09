// Local-only persistence for the MVP. Swap these functions for a backend (Firebase, Supabase) later.
// Feedback and receipts are kept in different keys on purpose: feedback has no receipt, receipts have no feedback.
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as core from './feedbackCore';
import { sha256, randomId } from './hash';

const K = {
  courses: 'tn:courses',
  feedback: 'tn:feedback',
  actions: 'tn:actions',
  secret: 'tn:deviceSecret'
};

async function read(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
async function write(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const DEMO_COURSE = {
  id: 'course-1',
  name: 'Intro to Mobile Design',
  section: 'Section C',
  code: 'TN-4F7K',
  classSize: 32,
  windowOpen: true,
  receipts: []
};

export async function seedIfEmpty() {
  const courses = await read(K.courses, null);
  if (!courses) await write(K.courses, [DEMO_COURSE]);
}

export async function resetAllData() {
  await AsyncStorage.multiRemove([K.courses, K.feedback, K.actions]);
  await seedIfEmpty();
}

export async function listCourses() {
  return read(K.courses, []);
}

export async function getCourseByCode(code) {
  if (!core.isValidCodeFormat(code)) return null;
  const c = core.normalizeCode(code);
  const courses = await read(K.courses, []);
  return courses.find(x => x.code === c) || null;
}

export async function getCourse(id) {
  const courses = await read(K.courses, []);
  return courses.find(x => x.id === id) || null;
}

async function getDeviceSecret() {
  let s = await AsyncStorage.getItem(K.secret);
  if (!s) {
    s = await randomId(16);
    await AsyncStorage.setItem(K.secret, s);
  }
  return s;
}

async function receiptFor(course) {
  return sha256(core.receiptInput(course.code, await getDeviceSecret()));
}

export async function hasSubmitted(courseId) {
  const course = await getCourse(courseId);
  if (!course) return false;
  return core.hasReceipt(course.receipts, await receiptFor(course));
}

// Result: { ok: true } or { ok: false, reason: 'invalid' | 'closed' | 'duplicate' | 'missing', errors? }
export async function submitFeedback(courseId, input) {
  const check = core.validateFeedback(input);
  if (!check.ok) return { ok: false, reason: 'invalid', errors: check.errors };
  const courses = await read(K.courses, []);
  const idx = courses.findIndex(c => c.id === courseId);
  if (idx < 0) return { ok: false, reason: 'missing' };
  const course = courses[idx];
  if (!course.windowOpen) return { ok: false, reason: 'closed' };
  const receipt = await receiptFor(course);
  if (core.hasReceipt(course.receipts, receipt)) return { ok: false, reason: 'duplicate' };

  const record = core.buildFeedbackRecord({
    id: await randomId(8),
    courseId,
    pace: input.pace,
    clarity: input.clarity,
    materials: input.materials,
    comment: input.comment || '',
    now: Date.now()
  });
  const all = await read(K.feedback, []);
  all.push(record);
  courses[idx] = Object.assign({}, course, { receipts: core.addReceipt(course.receipts, receipt) });
  await write(K.feedback, core.shuffle(all));   // stored order carries no timing information
  await write(K.courses, courses);
  return { ok: true };
}

export async function getSummary(courseId) {
  const all = await read(K.feedback, []);
  return core.summarize(all.filter(f => f.courseId === courseId));
}

export async function listActions(courseId) {
  const all = await read(K.actions, []);
  return all.filter(a => a.courseId === courseId).sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1));
}

export async function postAction(courseId, { theme, text, when, status }) {
  if (!text || !text.trim()) return { ok: false, reason: 'empty' };
  const all = await read(K.actions, []);
  all.push({
    id: await randomId(6),
    courseId,
    theme: theme || 'General',
    text: text.trim(),
    when: (when || '').trim(),
    status: status || 'Planned',
    postedAt: core.dayBucket(Date.now())
  });
  await write(K.actions, all);
  return { ok: true };
}

export async function setWindowOpen(courseId, open) {
  const courses = await read(K.courses, []);
  await write(K.courses, courses.map(c => (c.id === courseId ? Object.assign({}, c, { windowOpen: open }) : c)));
}

// Demo helper so one phone can show the unlocked dashboard. Adds anonymous responses with no receipts.
const DEMO_COMMENTS = [
  'The lessons move too fast for me to take notes.',
  'Pace is too fast during activities.',
  'More worked examples would help before activities.',
  'Please share the slides before class.',
  'Need more examples for the lab.',
  'Several deadlines land in the same week.',
  'Too many deadlines at the end of the month.',
  ''
];
export async function addDemoResponses(courseId, n) {
  const all = await read(K.feedback, []);
  for (let i = 0; i < n; i++) {
    const pick = DEMO_COMMENTS[Math.floor(Math.random() * DEMO_COMMENTS.length)];
    all.push(core.buildFeedbackRecord({
      id: await randomId(8),
      courseId,
      pace: 1 + Math.floor(Math.random() * 3),
      clarity: 3 + Math.floor(Math.random() * 3),
      materials: 2 + Math.floor(Math.random() * 4),
      comment: pick,
      now: Date.now()
    }));
  }
  await write(K.feedback, core.shuffle(all));
}
