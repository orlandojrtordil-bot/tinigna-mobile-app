import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Button, Field, Note, Card, AppBar } from '../components/ui';
import { getCourse, hasSubmitted, submitFeedback, listActions } from '../lib/storage';
import { validateFeedback, MAX_COMMENT } from '../lib/feedbackCore';
import { color, space, radius, type } from '../theme';

const QUESTIONS = [
  { key: 'pace', label: 'Pace of the class', low: 'Too slow', high: 'Too fast' },
  { key: 'clarity', label: 'Clarity of lessons', low: 'Unclear', high: 'Very clear' },
  { key: 'materials', label: 'Usefulness of materials', low: 'Not useful', high: 'Very useful' }
];

function Rating({ label, value, onChange, error }) {
  return (
    <View style={{ marginBottom: space.md }}>
      <Text style={[type.heading, { color: color.text, marginBottom: space.sm }]}>{label}</Text>
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map(n => {
          const on = value === n;
          return (
            <Pressable key={n} onPress={() => onChange(n)} accessibilityRole="button" accessibilityLabel={label + ' ' + n + ' out of 5'}
              accessibilityState={{ selected: on }}
              style={{ flex: 1, height: 48, marginRight: n < 5 ? space.sm : 0, borderRadius: radius.sm, borderWidth: 1,
                borderColor: on ? color.primary : color.border, backgroundColor: on ? color.primary : color.bgScreen,
                alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[type.button, { color: on ? color.onBrand : color.text }]}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={[type.bodySmall, { color: color.error, marginTop: space.xs }]}>{error}</Text> : null}
    </View>
  );
}

export default function FeedbackFormScreen({ course: initial, onBack, onDone }) {
  const [course, setCourse] = useState(initial);
  const [phase, setPhase] = useState('loading'); // loading | form | sending | success | already | closed
  const [ratings, setRatings] = useState({ pace: 0, clarity: 0, materials: 0 });
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [actions, setActions] = useState([]);

  useEffect(() => {
    (async () => {
      const fresh = (await getCourse(initial.id)) || initial;
      setCourse(fresh);
      if (await hasSubmitted(fresh.id)) setPhase('already');
      else if (!fresh.windowOpen) setPhase('closed');
      else setPhase('form');
    })();
  }, [initial.id]);

  async function loadActions() {
    setActions(await listActions(course.id));
  }

  function confirm() {
    const check = validateFeedback({ ...ratings, comment });
    setErrors(check.errors);
    if (!check.ok) return;
    Alert.alert(
      'Submit feedback?',
      'Your response is anonymous and cannot be edited after it is submitted.',
      [
        { text: 'Review Again', style: 'cancel' },
        { text: 'Submit', onPress: send }
      ]
    );
  }

  async function send() {
    setPhase('sending');
    const res = await submitFeedback(course.id, { ...ratings, comment });
    if (res.ok) { await loadActions(); setPhase('success'); return; }
    if (res.reason === 'duplicate') { setPhase('already'); return; }
    if (res.reason === 'closed') { setPhase('closed'); return; }
    setErrors(res.errors || {});
    setPhase('form');
    Alert.alert('Could not submit', 'Please check your answers and try again.');
  }

  const header = <AppBar title="Mid-semester feedback" onBack={phase === 'sending' ? undefined : onBack} />;

  if (phase === 'loading') {
    return <View style={{ flex: 1, backgroundColor: color.bgScreen }}>{header}<ActivityIndicator style={{ marginTop: space.xl }} color={color.primary} /></View>;
  }
  if (phase === 'sending') {
    return (
      <View style={{ flex: 1, backgroundColor: color.bgScreen }}>
        {header}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.lg }}>
          <ActivityIndicator size="large" color={color.primary} />
          <Text style={[type.title, { color: color.text, marginTop: space.lg }]}>Submitting your feedback</Text>
          <Text style={[type.bodySmall, { color: color.textSecondary, marginTop: space.sm, textAlign: 'center' }]}>Please wait while your response is sent. Please keep the app open.</Text>
        </View>
      </View>
    );
  }
  if (phase === 'already' || phase === 'closed' || phase === 'success') {
    const title = phase === 'success' ? 'Feedback submitted' : phase === 'already' ? 'Already submitted' : 'Feedback window closed';
    const body = phase === 'success'
      ? 'Your response was recorded anonymously. Instructors see summarized themes, never individual identities.'
      : phase === 'already'
        ? 'This device has already sent feedback for this course. Each student can respond once.'
        : 'This course is not collecting feedback right now.';
    return (
      <View style={{ flex: 1, backgroundColor: color.bgScreen }}>
        {header}
        <ScrollView contentContainerStyle={{ padding: space.md }}>
          <Text style={[type.title, { color: phase === 'success' ? color.success : color.text, marginBottom: space.sm }]}>{title}</Text>
          <Text style={[type.body, { color: color.textSecondary, marginBottom: space.lg }]}>{body}</Text>
          <Text style={[type.heading, { color: color.text, marginBottom: space.sm }]}>You Said, We Did</Text>
          {actions.length === 0
            ? <Note text="Your instructor has not responded yet. Updates appear here after the feedback window closes." />
            : actions.map(a => (
              <Card key={a.id}>
                <Text style={[type.heading, { color: color.text }]}>{a.theme}</Text>
                <Text style={[type.bodySmall, { color: color.textSecondary, marginTop: space.xs }]}>{a.text}</Text>
                <Text style={[type.label, { color: color.textSecondary, marginTop: space.sm }]}>{a.status}{a.when ? ' · ' + a.when : ''}</Text>
              </Card>
            ))}
          <Button label="Done" onPress={onDone} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.bgScreen }}>
      {header}
      <ScrollView contentContainerStyle={{ padding: space.md }} keyboardShouldPersistTaps="handled">
        <Text style={[type.heading, { color: color.text }]}>{course.name}</Text>
        <Text style={[type.bodySmall, { color: color.textSecondary, marginBottom: space.md }]}>{course.section} · Feedback open</Text>
        <Note text="Anonymous submission. Your identity is not stored with this response." />
        {QUESTIONS.map(q => (
          <Rating key={q.key} label={q.label} value={ratings[q.key]} error={errors[q.key]}
            onChange={n => { setRatings(r => ({ ...r, [q.key]: n })); setErrors(e => ({ ...e, [q.key]: undefined })); }} />
        ))}
        <Field
          label={'What should change? (optional, ' + comment.length + '/' + MAX_COMMENT + ')'}
          value={comment}
          onChangeText={setComment}
          placeholder="Type your comment..."
          multiline
          maxLength={MAX_COMMENT}
          error={errors.comment}
          helper="Please avoid names and personal details. We remove emails, phone numbers, and titled names."
        />
        <Button label="Submit Anonymously" onPress={confirm} />
      </ScrollView>
    </View>
  );
}
