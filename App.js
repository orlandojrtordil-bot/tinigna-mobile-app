import React, { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { seedIfEmpty } from './src/lib/storage';
import RoleSelectScreen from './src/screens/RoleSelectScreen';
import JoinCourseScreen from './src/screens/JoinCourseScreen';
import FeedbackFormScreen from './src/screens/FeedbackFormScreen';
import InstructorDashboardScreen from './src/screens/InstructorDashboardScreen';
import { color } from './src/theme';

// Tiny state-based navigation: role -> join -> feedback, and role -> dashboard.
export default function App() {
  const [ready, setReady] = useState(false);
  const [route, setRoute] = useState({ name: 'role' });

  useEffect(() => { seedIfEmpty().then(() => setReady(true)); }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (route.name === 'role') return false;
      if (route.name === 'feedback') setRoute({ name: 'join' });
      else setRoute({ name: 'role' });
      return true;
    });
    return () => sub.remove();
  }, [route.name]);

  let screen = null;
  if (ready) {
    if (route.name === 'role') screen = <RoleSelectScreen onStudent={() => setRoute({ name: 'join' })} onInstructor={() => setRoute({ name: 'dashboard' })} />;
    if (route.name === 'join') screen = <JoinCourseScreen onBack={() => setRoute({ name: 'role' })} onJoined={course => setRoute({ name: 'feedback', course })} />;
    if (route.name === 'feedback') screen = <FeedbackFormScreen course={route.course} onBack={() => setRoute({ name: 'join' })} onDone={() => setRoute({ name: 'role' })} />;
    if (route.name === 'dashboard') screen = <InstructorDashboardScreen onBack={() => setRoute({ name: 'role' })} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, backgroundColor: color.primary }} edges={['top']}>
        <View style={{ flex: 1, backgroundColor: color.bgScreen }}>{screen}</View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
