import { ReactNode, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { ALL_CATEGORIES, CATEGORY_LABELS, Category, SUGGESTIONS } from '../data/suggestions';
import { FREQUENCIES, pickSuggestion } from '../lib/logic';
import { sendTestSuggestion } from '../lib/notifications';
import { useStore } from '../lib/store';
import { colors, common } from '../lib/theme';

const MINUTES = [0, 15, 30, 45];
const REMINDER_DAYS = [
  { days: 0, label: 'Samal päeval' },
  { days: 1, label: '1 päev enne' },
  { days: 2, label: '2 päeva enne' },
  { days: 7, label: 'Nädal enne' },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={common.card}>
      <Text style={common.h2}>{title}</Text>
      {children}
    </View>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const btn = (label: string, delta: number) => (
    <Pressable
      accessibilityRole="button"
      onPress={() => onChange((value + delta + 24) % 24)}
      style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}
    >
      <Text style={{ fontSize: 18, color: colors.primary }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={common.row}>
      {btn('−', -1)}
      <Text style={[common.h2, { minWidth: 32, textAlign: 'center' }]}>{String(value).padStart(2, '0')}</Text>
      {btn('+', 1)}
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, updateSettings, history } = useStore();
  const [name, setName] = useState(settings.partnerName);

  useEffect(() => setName(settings.partnerName), [settings.partnerName]);

  const toggleCategory = (c: Category) => {
    const categories = settings.categories.includes(c)
      ? settings.categories.filter((x) => x !== c)
      : [...settings.categories, c];
    void updateSettings({ categories });
  };

  const test = async () => {
    const s = pickSuggestion(SUGGESTIONS, settings.categories, history);
    if (!s) {
      Alert.alert('Vali vähemalt üks kategooria');
      return;
    }
    const ok = await sendTestSuggestion(s);
    Alert.alert(ok ? 'Proovisoovitus tuleb 5 sekundi pärast' : 'Teavituste luba puudub', ok ? undefined : 'Luba teavitused telefoni seadetes.');
  };

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content} keyboardShouldPersistTaps="handled">
      <Section title="Kaaslase nimi">
        <TextInput
          style={common.input}
          value={name}
          onChangeText={setName}
          onEndEditing={() => void updateSettings({ partnerName: name.trim() })}
          placeholder="Nt Mari"
          returnKeyType="done"
        />
        <Text style={common.muted}>Kasutatakse soovitustes ja teavitustes.</Text>
      </Section>

      <Section title="Soovituste teavitused">
        <View style={[common.row, { justifyContent: 'space-between' }]}>
          <Text style={common.text}>Saada soovitusi</Text>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(v) => void updateSettings({ notificationsEnabled: v })}
            trackColor={{ true: colors.primary }}
          />
        </View>

        <Text style={[common.text, { marginTop: 8 }]}>Kui tihti?</Text>
        <View style={[common.row, { flexWrap: 'wrap' }]}>
          {FREQUENCIES.map((f) => (
            <Chip
              key={f.intervalDays}
              label={f.label}
              selected={settings.intervalDays === f.intervalDays}
              onPress={() => void updateSettings({ intervalDays: f.intervalDays })}
            />
          ))}
        </View>

        <Text style={[common.text, { marginTop: 8 }]}>Mis kell?</Text>
        <View style={[common.row, { flexWrap: 'wrap' }]}>
          <Stepper value={settings.hour} onChange={(hour) => void updateSettings({ hour })} />
          <Text style={common.h2}>:</Text>
          {MINUTES.map((m) => (
            <Chip
              key={m}
              label={String(m).padStart(2, '0')}
              selected={settings.minute === m}
              onPress={() => void updateSettings({ minute: m })}
            />
          ))}
        </View>

        <Button title="🔔 Saada proovisoovitus" variant="secondary" onPress={test} />
      </Section>

      <Section title="Mis tüüpi soovitusi?">
        <View style={[common.row, { flexWrap: 'wrap' }]}>
          {ALL_CATEGORIES.map((c) => (
            <Chip key={c} label={CATEGORY_LABELS[c]} selected={settings.categories.includes(c)} onPress={() => toggleCategory(c)} />
          ))}
        </View>
      </Section>

      <Section title="Plaanid ja kalender">
        <Text style={common.text}>Meeldetuletus enne plaani</Text>
        <View style={[common.row, { flexWrap: 'wrap' }]}>
          {REMINDER_DAYS.map((r) => (
            <Chip
              key={r.days}
              label={r.label}
              selected={settings.reminderDaysBefore === r.days}
              onPress={() => void updateSettings({ reminderDaysBefore: r.days })}
            />
          ))}
        </View>
        <View style={[common.row, { justifyContent: 'space-between', marginTop: 8 }]}>
          <Text style={[common.text, { flex: 1 }]}>Lisa plaanid vaikimisi kalendrisse</Text>
          <Switch
            value={settings.addToCalendarByDefault}
            onValueChange={(v) => void updateSettings({ addToCalendarByDefault: v })}
            trackColor={{ true: colors.primary }}
          />
        </View>
      </Section>
    </ScrollView>
  );
}
