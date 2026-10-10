import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Suggestion } from '../data/suggestions';
import { useStore } from '../lib/store';
import { colors, common } from '../lib/theme';
import { Button } from './Button';
import { Chip } from './Chip';
import { DateTimeField } from './DateTimeField';

const DURATIONS = [
  { minutes: 30, label: '30 min' },
  { minutes: 60, label: '1 h' },
  { minutes: 120, label: '2 h' },
  { minutes: 180, label: '3 h' },
  { minutes: 240, label: '4 h' },
  { minutes: 480, label: 'Päev' },
];

function defaultDate(): Date {
  // Vaikimisi järgmine laupäev kell 18.00.
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  d.setHours(18, 0, 0, 0);
  return d;
}

type Props = {
  visible: boolean;
  suggestion?: Suggestion;
  onClose: () => void;
};

export function PlanForm({ visible, suggestion, onClose }: Props) {
  const { addPlan, settings } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [duration, setDuration] = useState(120);
  const [toCalendar, setToCalendar] = useState(settings.addToCalendarByDefault);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setTitle(suggestion?.title ?? '');
    setDescription(suggestion?.description ?? '');
    setDate(defaultDate());
    setDuration(suggestion?.durationMinutes ?? 120);
    setToCalendar(settings.addToCalendarByDefault);
  }, [visible, suggestion, settings.addToCalendarByDefault]);

  const save = async () => {
    if (!title.trim()) {
      Alert.alert('Pealkiri puudub', 'Kirjuta, mida plaanid.');
      return;
    }
    if (date.getTime() <= Date.now()) {
      Alert.alert('Aeg on möödas', 'Vali tulevikus olev aeg.');
      return;
    }
    setSaving(true);
    try {
      const warnings = await addPlan({
        title: title.trim(),
        description: description.trim(),
        date,
        durationMinutes: duration,
        suggestionId: suggestion?.id,
        addToCalendar: toCalendar,
      });
      if (warnings.length > 0) Alert.alert('Plaan salvestatud', warnings.join('\n'));
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={common.screen} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={common.content} keyboardShouldPersistTaps="handled">
          <Text style={common.h1}>Planeeri üllatus</Text>

          <Text style={common.h2}>Mida?</Text>
          <TextInput style={common.input} value={title} onChangeText={setTitle} placeholder="Nt teatriõhtu" />
          <TextInput
            style={[common.input, { minHeight: 80, textAlignVertical: 'top' }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Märkmed (koht, piletid, mida kaasa võtta…)"
            multiline
          />

          <Text style={common.h2}>Millal?</Text>
          <DateTimeField value={date} onChange={setDate} />

          <Text style={common.h2}>Kui kaua?</Text>
          <View style={[common.row, { flexWrap: 'wrap' }]}>
            {DURATIONS.map((d) => (
              <Chip key={d.minutes} label={d.label} selected={duration === d.minutes} onPress={() => setDuration(d.minutes)} />
            ))}
          </View>

          <View style={[common.row, { justifyContent: 'space-between' }]}>
            <Text style={common.text}>Lisa telefoni kalendrisse</Text>
            <Switch value={toCalendar} onValueChange={setToCalendar} trackColor={{ true: colors.primary }} />
          </View>
          <Text style={common.muted}>
            {settings.reminderDaysBefore === 0
              ? 'Meeldetuletus tuleb samal päeval.'
              : `Meeldetuletus tuleb ${settings.reminderDaysBefore} päev(a) enne kell 9.00.`}
          </Text>

          <Button title={saving ? 'Salvestan…' : 'Salvesta plaan'} onPress={save} disabled={saving} />
          <Button title="Loobu" variant="secondary" onPress={onClose} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
