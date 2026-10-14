import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const COUNTRIES = ['Morocco', 'France', 'Spain', 'Germany', 'USA', 'Japan'];
const INTERESTS = ['Coding', 'Music', 'Sports', 'Travel', 'Gaming', 'Art'];
const GENDERS = ['Male', 'Female', 'Other'];
const COLORS = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899',
  '#000000', '#6B7280',
];

const initial = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  age: null,
  coursesTaken: 0,
  birthDate: '',
  gender: '',
  country: '',
  interests: [],
  favoriteColor: '#3B82F6',
  bio: '',
  newsletter: true,
  notifications: false,
  terms: false,
};

function Field({ label, error, children }) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      {children}
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

function Option({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.option, selected && s.optionOn]}
    >
      <Text style={[s.optionText, selected && s.optionTextOn]}>{label}</Text>
    </TouchableOpacity>
  );
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const pad = (n) => String(n).padStart(2, '0');

function calculateAge(dateStr) {
  const b = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const hadBirthday =
    now.getMonth() > b.getMonth() ||
    (now.getMonth() === b.getMonth() && now.getDate() >= b.getDate());
  if (!hadBirthday) age -= 1;
  return Math.max(0, age);
}

function Calendar({ value, onSelect }) {
  const start = value ? new Date(value + 'T00:00:00') : new Date(2000, 0, 1);
  const [year, setYear] = useState(start.getFullYear());
  const [month, setMonth] = useState(start.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const changeMonth = (delta) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  return (
    <View style={s.calendar}>
      <View style={s.calHeader}>
        <TouchableOpacity style={s.calNav} onPress={() => setYear(year - 1)}>
          <Text style={s.calNavTxt}>«</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.calNav} onPress={() => changeMonth(-1)}>
          <Text style={s.calNavTxt}>‹</Text>
        </TouchableOpacity>
        <Text style={s.calTitle}>
          {MONTHS[month]} {year}
        </Text>
        <TouchableOpacity style={s.calNav} onPress={() => changeMonth(1)}>
          <Text style={s.calNavTxt}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.calNav} onPress={() => setYear(year + 1)}>
          <Text style={s.calNavTxt}>»</Text>
        </TouchableOpacity>
      </View>
      <View style={s.calRow}>
        {DAYS.map((d) => (
          <Text key={d} style={s.calDayName}>{d}</Text>
        ))}
      </View>
      {Array.from({ length: cells.length / 7 }, (_, w) => (
        <View key={w} style={s.calRow}>
          {cells.slice(w * 7, w * 7 + 7).map((d, i) => {
            const str = d ? `${year}-${pad(month + 1)}-${pad(d)}` : '';
            const selected = d && str === value;
            return (
              <TouchableOpacity
                key={i}
                disabled={!d}
                style={[s.calCell, selected && s.calCellOn]}
                onPress={() => onSelect(str)}
              >
                <Text style={[s.calCellTxt, selected && { color: '#fff', fontWeight: '700' }]}>
                  {d || ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default function App() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [showCal, setShowCal] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleInterest = (i) =>
    set(
      'interests',
      form.interests.includes(i)
        ? form.interests.filter((x) => x !== i)
        : [...form.interests, i]
    );

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (!form.terms) e.terms = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) {
      console.warn('Form has validation errors');
      return;
    }
    console.log('Form submitted:', form);
    console.log(JSON.stringify(form, null, 2));
    setForm(initial);
    setErrors({});
  };

  return (
    <View style={s.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.container}>
          <Text style={s.title}>Sign Up Form</Text>

          <Field label="Full name" error={errors.fullName}>
            <TextInput
              style={s.input}
              placeholder="Jane Doe"
              value={form.fullName}
              onChangeText={(v) => set('fullName', v)}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <TextInput
              style={s.input}
              placeholder="jane@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => set('email', v)}
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <TextInput
              style={s.input}
              placeholder="At least 6 characters"
              secureTextEntry
              value={form.password}
              onChangeText={(v) => set('password', v)}
            />
          </Field>

          <Field label="Phone">
            <TextInput
              style={s.input}
              placeholder="+212 600 000 000"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => set('phone', v)}
            />
          </Field>

          <Field label="Birth date">
            <TouchableOpacity
              style={s.input}
              onPress={() => setShowCal(!showCal)}
            >
              <Text style={{ color: form.birthDate ? '#111827' : '#9CA3AF', fontSize: 15 }}>
                {form.birthDate || 'Select a date  📅'}
              </Text>
            </TouchableOpacity>
            {showCal && (
              <Calendar
                value={form.birthDate}
                onSelect={(d) => {
                  setForm((f) => ({ ...f, birthDate: d, age: calculateAge(d) }));
                  setShowCal(false);
                }}
              />
            )}
          </Field>

          <Field label="Courses taken">
            <View style={s.rowCenter}>
              <TouchableOpacity
                style={s.stepBtn}
                onPress={() => set('coursesTaken', Math.max(0, form.coursesTaken - 1))}
              >
                <Text style={s.stepTxt}>−</Text>
              </TouchableOpacity>
              <Text style={s.ageVal}>{form.coursesTaken}</Text>
              <TouchableOpacity
                style={s.stepBtn}
                onPress={() => set('coursesTaken', Math.min(100, form.coursesTaken + 1))}
              >
                <Text style={s.stepTxt}>+</Text>
              </TouchableOpacity>
            </View>
          </Field>

          <Field label="Age (calculated from birth date)">
            <View style={[s.input, s.readonly]}>
              <Text style={s.text}>
                {form.age === null ? 'Select a birth date first' : `${form.age} years`}
              </Text>
            </View>
          </Field>

          <Field label="Gender">
            <View style={s.row}>
              {GENDERS.map((g) => (
                <Option
                  key={g}
                  label={g}
                  selected={form.gender === g}
                  onPress={() => set('gender', g)}
                />
              ))}
            </View>
          </Field>

          <Field label="Country">
            <View style={s.row}>
              {COUNTRIES.map((c) => (
                <Option
                  key={c}
                  label={c}
                  selected={form.country === c}
                  onPress={() => set('country', c)}
                />
              ))}
            </View>
          </Field>

          <Field label="Interests">
            <View style={s.row}>
              {INTERESTS.map((i) => (
                <Option
                  key={i}
                  label={i}
                  selected={form.interests.includes(i)}
                  onPress={() => toggleInterest(i)}
                />
              ))}
            </View>
          </Field>

          <Field label="Favorite color">
            <View style={s.row}>
              {COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => set('favoriteColor', c)}
                  style={[
                    s.swatch,
                    { backgroundColor: c },
                    form.favoriteColor === c && s.swatchOn,
                  ]}
                />
              ))}
            </View>
            <View style={[s.rowCenter, { marginTop: 10 }]}>
              <View style={[s.preview, { backgroundColor: form.favoriteColor }]} />
              <TextInput
                style={[s.input, { flex: 1 }]}
                placeholder="#RRGGBB"
                autoCapitalize="characters"
                value={form.favoriteColor}
                onChangeText={(v) => set('favoriteColor', v)}
              />
            </View>
          </Field>

          <Field label="Bio">
            <TextInput
              style={[s.input, { height: 90, textAlignVertical: 'top' }]}
              placeholder="Tell us about yourself..."
              multiline
              value={form.bio}
              onChangeText={(v) => set('bio', v)}
            />
          </Field>

          <View style={s.switchRow}>
            <Text style={s.text}>Newsletter</Text>
            <Switch
              value={form.newsletter}
              onValueChange={(v) => set('newsletter', v)}
            />
          </View>
          <View style={s.switchRow}>
            <Text style={s.text}>Notifications</Text>
            <Switch
              value={form.notifications}
              onValueChange={(v) => set('notifications', v)}
            />
          </View>

          <TouchableOpacity
            style={[s.rowCenter, { marginVertical: 8 }]}
            onPress={() => set('terms', !form.terms)}
          >
            <View style={[s.checkbox, form.terms && s.checkboxOn]}>
              {form.terms && <Text style={s.check}>✓</Text>}
            </View>
            <Text style={s.text}>I accept the terms & conditions</Text>
          </TouchableOpacity>
          {errors.terms ? <Text style={s.error}>{errors.terms}</Text> : null}

          <TouchableOpacity style={s.submit} onPress={submit}>
            <Text style={s.submitTxt}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const BLUE = '#2563EB';

const s = StyleSheet.create({
  calendar: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  calHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  calNav: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  calNavTxt: { fontSize: 20, color: BLUE, fontWeight: '700' },
  calTitle: { flex: 1, textAlign: 'center', fontWeight: '700', color: '#111827' },
  calRow: { flexDirection: 'row' },
  calDayName: { flex: 1, textAlign: 'center', color: '#6B7280', fontSize: 12, paddingVertical: 4 },
  calCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  calCellOn: { backgroundColor: BLUE },
  calCellTxt: { color: '#111827', fontSize: 14 },
  screen: { flex: 1, backgroundColor: '#F3F4F6' },
  scroll: { paddingVertical: 32, paddingHorizontal: 16, alignItems: 'center' },
  container: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  text: { fontSize: 15, color: '#111827' },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#fff',
  },
  error: { color: '#DC2626', fontSize: 12, marginTop: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  optionOn: { backgroundColor: BLUE, borderColor: BLUE },
  optionText: { color: '#374151', fontSize: 14 },
  optionTextOn: { color: '#fff', fontWeight: '600' },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchOn: { borderColor: '#111827' },
  preview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTxt: { fontSize: 20, color: BLUE, fontWeight: '700' },
  readonly: { backgroundColor: '#F3F4F6' },
  ageVal: { fontSize: 18, fontWeight: '600', minWidth: 36, textAlign: 'center' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: BLUE, borderColor: BLUE },
  check: { color: '#fff', fontWeight: '700', fontSize: 14 },
  submit: {
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  submitTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
