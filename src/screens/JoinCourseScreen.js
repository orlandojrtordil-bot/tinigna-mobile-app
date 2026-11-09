import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Field, Note, AppBar } from '../components/ui';
import { getCourseByCode } from '../lib/storage';
import { isValidCodeFormat } from '../lib/feedbackCore';
import { color, space, type } from '../theme';

export default function JoinCourseScreen({ onJoined, onBack }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function join() {
    setError('');
    if (!isValidCodeFormat(code)) {
      setError('Codes look like TN-4F7K. Please check it and try again.');
      return;
    }
    setBusy(true);
    const course = await getCourseByCode(code);
    setBusy(false);
    if (!course) {
      setError('The code was not recognized. Please verify it with your instructor and try again.');
      return;
    }
    onJoined(course);
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.bgScreen }}>
      <AppBar title="Join a course" onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: space.md }} keyboardShouldPersistTaps="handled">
        <Text style={[type.title, { color: color.text, marginBottom: space.sm }]}>Enter your course code</Text>
        <Text style={[type.body, { color: color.textSecondary, marginBottom: space.lg }]}>
          Ask your instructor for the code shown in class.
        </Text>
        <Field
          label="Course code"
          value={code}
          onChangeText={t => { setCode(t); if (error) setError(''); }}
          placeholder="e.g. TN-4F7K"
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={7}
          error={error}
          helper="We never ask for your name, email, or student ID."
          accessibilityLabel="Course code"
          onSubmitEditing={join}
        />
        <Button label={busy ? 'Checking...' : 'Join Course'} onPress={join} disabled={busy || !code.trim()} />
        <Note text="Demo course code: TN-4F7K" />
      </ScrollView>
    </View>
  );
}
