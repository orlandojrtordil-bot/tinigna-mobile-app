import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl } from 'react-native';
import { Button, Field, Note, Card, Chip, AppBar } from '../components/ui';
import { listCourses, getSummary, listActions, postAction, setWindowOpen, addDemoResponses, resetAllData } from '../lib/storage';
import { MIN_RESPONSES } from '../lib/feedbackCore';
import { SHOW_DEMO_TOOLS } from '../config';
import { color, space, radius, type } from '../theme';

const STATUSES = ['Planned', 'In progress', 'Done'];

function Bar({ label, value }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space.sm }}>
      <Text style={[type.bodySmall, { width: 80, color: color.text }]}>{label}</Text>
      <View style={{ flex: 1, height: 10, backgroundColor: color.border, borderRadius: radius.sm, marginHorizontal: space.sm }}>
        <View style={{ width: Math.max(0, Math.min(100, (value / 5) * 100)) + '%', height: 10, backgroundColor: color.primary, borderRadius: radius.sm }} />
      </View>
      <Text style={[type.bodySmall, { width: 28, color: color.text, textAlign: 'right' }]}>{value}</Text>
    </View>
  );
}

export default function InstructorDashboardScreen({ onBack }) {
  const [course, setCourse] = useState(null);
  const [summary, setSummary] = useState(null);
  const [actions, setActions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [theme, setTheme] = useState('');
  const [text, setText] = useState('');
  const [when, setWhen] = useState('');
  const [status, setStatus] = useState('Planned');
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    const courses = await listCourses();
    const c = courses[0] || null;
    setCourse(c);
    if (c) {
      setSummary(await getSummary(c.id));
      setActions(await listActions(c.id));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function refresh() { setRefreshing(true); await load(); setRefreshing(false); }

  async function publish() {
    setFormError('');
    const res = await postAction(course.id, { theme, text, when, status });
    if (!res.ok) { setFormError('Please describe what you will do.'); return; }
    setText(''); setWhen(''); setTheme(''); setStatus('Planned');
    setActions(await listActions(course.id));
  }

  function toggleWindow() {
    if (course.windowOpen) {
      Alert.alert('Close feedback window?',
        'Students will no longer be able to submit feedback for this course. You can reopen the window later.',
        [{ text: 'Keep Open', style: 'cancel' }, { text: 'Close Window', onPress: async () => { await setWindowOpen(course.id, false); load(); } }]);
    } else {
      setWindowOpen(course.id, true).then(load);
    }
  }

  async function demo() { await addDemoResponses(course.id, 1); load(); }

  if (!course || !summary) {
    return <View style={{ flex: 1, backgroundColor: color.bgScreen }}><AppBar title="Dashboard" onBack={onBack} /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.bgScreen }}>
      <AppBar title="Dashboard" onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: space.md }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />} keyboardShouldPersistTaps="handled">
        <Text style={[type.heading, { color: color.text }]}>{course.name}</Text>
        <Text style={[type.bodySmall, { color: color.textSecondary, marginBottom: space.md }]}>
          {course.section} · Code {course.code} · Window {course.windowOpen ? 'open' : 'closed'}
        </Text>

        <View style={{ flexDirection: 'row', marginBottom: space.md }}>
          <Card style={{ flex: 1, marginRight: space.sm }}>
            <Text style={[type.title, { color: color.text }]}>{summary.count} / {course.classSize}</Text>
            <Text style={[type.bodySmall, { color: color.textSecondary }]}>Responses</Text>
          </Card>
          <Card style={{ flex: 1 }}>
            <Text style={[type.title, { color: color.text }]}>{summary.unlocked ? summary.overall : '\u2013'}</Text>
            <Text style={[type.bodySmall, { color: color.textSecondary }]}>Avg. rating</Text>
          </Card>
        </View>

        {!summary.unlocked ? (
          <Card>
            <Text style={[type.heading, { color: color.text }]}>Summary not yet available</Text>
            <Text style={[type.bodySmall, { color: color.textSecondary, marginTop: space.xs }]}>
              Themes become available after {MIN_RESPONSES} responses, so that no comment can be traced to an individual student.
            </Text>
            <Text style={[type.label, { color: color.textSecondary, marginTop: space.sm }]}>{summary.count} of {summary.min} responses</Text>
          </Card>
        ) : (
          <>
            <Card>
              <Text style={[type.heading, { color: color.text, marginBottom: space.sm }]}>Average ratings</Text>
              <Bar label="Pace" value={summary.averages.pace} />
              <Bar label="Clarity" value={summary.averages.clarity} />
              <Bar label="Materials" value={summary.averages.materials} />
            </Card>
            <Text style={[type.heading, { color: color.text, marginVertical: space.sm }]}>Top themes</Text>
            {summary.themes.length === 0
              ? <Note text="No theme has 2 or more mentions yet." />
              : summary.themes.map(t => (
                <Card key={t.id}>
                  <Text style={[type.body, { color: color.text }]}>{t.label}</Text>
                  <Text style={[type.bodySmall, { color: color.textSecondary }]}>{t.mentions} mentions</Text>
                </Card>
              ))}
            <Text style={[type.heading, { color: color.text, marginVertical: space.sm }]}>Anonymous comments</Text>
            <Note text="Names and identifying details are removed. Order is shuffled." />
            {summary.comments.slice(0, 8).map((c, i) => (
              <Card key={i}><Text style={[type.bodySmall, { color: color.text }]}>{'\u201C'}{c}{'\u201D'}</Text></Card>
            ))}

            <Text style={[type.heading, { color: color.text, marginVertical: space.sm }]}>Respond to feedback</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {summary.themes.map(t => <Chip key={t.id} label={t.label} selected={theme === t.label} onPress={() => setTheme(t.label)} />)}
            </View>
            <Field label="What will you do?" value={text} onChangeText={setText} placeholder="e.g. Add a 10-minute recap at the start of class" multiline error={formError} />
            <Field label="When? (optional)" value={when} onChangeText={setWhen} placeholder="e.g. By Week 8" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {STATUSES.map(st => <Chip key={st} label={st} selected={status === st} onPress={() => setStatus(st)} />)}
            </View>
            <Note text={'Students will see this in "You Said, We Did".'} />
            <Button label="Publish Response" onPress={publish} />
          </>
        )}

        {actions.length > 0 ? (
          <>
            <Text style={[type.heading, { color: color.text, marginVertical: space.sm }]}>Published responses</Text>
            {actions.map(a => (
              <Card key={a.id}>
                <Text style={[type.body, { color: color.text }]}>{a.theme}</Text>
                <Text style={[type.bodySmall, { color: color.textSecondary }]}>{a.text}</Text>
                <Text style={[type.label, { color: color.textSecondary, marginTop: space.xs }]}>{a.status}{a.when ? ' · ' + a.when : ''}</Text>
              </Card>
            ))}
          </>
        ) : null}

        <Button label={course.windowOpen ? 'Close Feedback Window' : 'Reopen Feedback Window'} onPress={toggleWindow} variant="secondary" style={{ marginTop: space.md }} />

        {SHOW_DEMO_TOOLS ? (
          <>
        <Text style={[type.label, { color: color.textSecondary, marginTop: space.lg, marginBottom: space.sm }]}>DEMO TOOLS (remove before release)</Text>
        <Button label="Add 1 demo response" onPress={demo} variant="secondary" />
        <Button label="Reset all demo data" onPress={() => Alert.alert('Reset demo data?', 'This deletes all responses and actions on this device.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', onPress: async () => { await resetAllData(); load(); } }])} variant="secondary" />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
