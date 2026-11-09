import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card, AppBar, Note } from '../components/ui';
import { color, space, type } from '../theme';

export default function RoleSelectScreen({ onStudent, onInstructor }) {
  return (
    <View style={{ flex: 1, backgroundColor: color.bgScreen }}>
      <AppBar title="TinigNa" />
      <View style={s.body}>
        <Text style={[type.title, { color: color.text, marginBottom: space.sm }]}>Select your role</Text>
        <Text style={[type.body, { color: color.textSecondary, marginBottom: space.lg }]}>
          Anonymous mid-semester feedback for students and instructors.
        </Text>
        <Card>
          <Text style={[type.heading, { color: color.text }]}>Student</Text>
          <Text style={[type.bodySmall, { color: color.textSecondary, marginBottom: space.md }]}>Give anonymous feedback on your courses.</Text>
          <Button label="Continue as Student" onPress={onStudent} />
        </Card>
        <Card>
          <Text style={[type.heading, { color: color.text }]}>Instructor</Text>
          <Text style={[type.bodySmall, { color: color.textSecondary, marginBottom: space.md }]}>Get themed feedback and respond with actions.</Text>
          <Button label="Continue as Instructor" onPress={onInstructor} variant="secondary" />
        </Card>
        <Note text="Students join with a course code. No name, email, or student ID is stored with feedback." />
      </View>
    </View>
  );
}
const s = StyleSheet.create({ body: { padding: space.md } });
