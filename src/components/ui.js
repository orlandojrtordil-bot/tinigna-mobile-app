import React from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { color, space, radius, type } from '../theme';

export function Button({ label, onPress, variant = 'primary', disabled, style }) {
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        primary ? s.btnPrimary : s.btnSecondary,
        pressed && !disabled && (primary ? s.btnPrimaryPressed : s.btnSecondaryPressed),
        disabled && s.btnDisabled,
        style
      ]}
    >
      {({ pressed }) => (
        <Text style={[type.button, { color: disabled ? color.placeholder : primary ? (pressed ? color.onBrand : color.onAccent) : color.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

export function Field({ label, error, helper, ...props }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <View style={{ marginBottom: space.md }}>
      {label ? <Text style={[type.label, { color: color.textSecondary, marginBottom: space.xs }]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={color.placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={[s.input, focus && s.inputFocus, !!error && s.inputError, props.multiline && { height: 112, textAlignVertical: 'top' }]}
        {...props}
      />
      {error ? <Text style={[type.bodySmall, { color: color.error, marginTop: space.xs }]}>{error}</Text>
        : helper ? <Text style={[type.bodySmall, { color: color.textSecondary, marginTop: space.xs }]}>{helper}</Text> : null}
    </View>
  );
}

export function Note({ text, tone = 'info' }) {
  return (
    <View style={[s.note, tone === 'error' && { borderColor: color.error, borderWidth: 1 }]}>
      <Text style={[type.bodySmall, { color: tone === 'error' ? color.error : color.textSecondary }]}>{text}</Text>
    </View>
  );
}

export function Chip({ label, selected, onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!selected }}
      style={[s.chip, selected && s.chipSelected]}>
      <Text style={[type.bodySmall, { fontWeight: '500', color: selected ? color.onBrand : color.text }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function AppBar({ title, onBack }) {
  return (
    <View style={s.appBar}>
      {onBack ? (
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" hitSlop={12}>
          <Text style={{ color: color.onBrand, fontSize: 24, marginRight: space.sm }}>{'\u2039'}</Text>
        </Pressable>
      ) : null}
      <Text style={[type.heading, { color: color.onBrand }]}>{title}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  btn: { height: 52, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.md, borderWidth: 1, marginBottom: space.sm },
  btnPrimary: { backgroundColor: color.accent, borderColor: color.primary },
  btnPrimaryPressed: { backgroundColor: color.primary },
  btnSecondary: { backgroundColor: 'transparent', borderColor: color.borderStrong },
  btnSecondaryPressed: { backgroundColor: color.bgSurface },
  btnDisabled: { backgroundColor: color.bgSurface, borderColor: color.border },
  input: { height: 52, borderWidth: 1, borderColor: color.border, borderRadius: radius.sm, paddingHorizontal: space.md, paddingVertical: space.sm, fontSize: 16, color: color.text, backgroundColor: color.bgScreen },
  inputFocus: { borderColor: color.primary, borderWidth: 2 },
  inputError: { borderColor: color.error, borderWidth: 2 },
  note: { backgroundColor: color.bgSurface, borderRadius: radius.sm, padding: space.md, marginBottom: space.md },
  chip: { paddingHorizontal: space.md, paddingVertical: space.sm, borderWidth: 1, borderColor: color.border, borderRadius: radius.sm, marginRight: space.sm, marginBottom: space.sm, backgroundColor: color.bgScreen },
  chipSelected: { backgroundColor: color.primary, borderColor: color.primary },
  card: { backgroundColor: color.bgScreen, borderWidth: 1, borderColor: color.border, borderRadius: radius.sm, padding: space.md, marginBottom: space.sm },
  appBar: { backgroundColor: color.primary, paddingHorizontal: space.md, paddingVertical: space.md, flexDirection: 'row', alignItems: 'center' }
});
