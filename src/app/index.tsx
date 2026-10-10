import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { PlanForm } from '../components/PlanForm';
import { CATEGORY_LABELS } from '../data/suggestions';
import { formatDateTime } from '../lib/logic';
import { useStore } from '../lib/store';
import { colors, common } from '../lib/theme';

export default function TodayScreen() {
  const { loaded, current, nextSuggestion, settings, schedule, plans } = useStore();
  const [planning, setPlanning] = useState(false);

  if (!loaded) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  const name = settings.partnerName.trim();
  const nextNotification = schedule[0] ? new Date(schedule[0].date) : undefined;
  const upcoming = plans.find((p) => !p.done && new Date(p.date) > new Date());

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      <Text style={common.h1}>{name ? `Tee ${name} täna rõõmsaks 💝` : 'Tänane soovitus 💝'}</Text>

      {current ? (
        <View style={common.card}>
          <Text style={common.muted}>{CATEGORY_LABELS[current.category]}</Text>
          <Text style={common.h2}>{current.title}</Text>
          <Text style={common.text}>{current.description}</Text>
          <View style={{ gap: 8, marginTop: 8 }}>
            <Button title="📅 Planeeri ja lisa kalendrisse" onPress={() => setPlanning(true)} />
            <Button title="🔄 Näita teist soovitust" variant="secondary" onPress={nextSuggestion} />
          </View>
        </View>
      ) : (
        <View style={common.card}>
          <Text style={common.text}>Ühtegi kategooriat pole valitud. Vali seadetes, millised soovitused sulle sobivad.</Text>
        </View>
      )}

      {upcoming && (
        <View style={common.card}>
          <Text style={common.muted}>Järgmine plaan</Text>
          <Text style={common.h2}>{upcoming.title}</Text>
          <Text style={common.text}>{formatDateTime(new Date(upcoming.date))}</Text>
        </View>
      )}

      <Text style={common.muted}>
        {settings.notificationsEnabled && nextNotification
          ? `Järgmine soovitus tuleb teavitusena ${formatDateTime(nextNotification)}.`
          : 'Soovituste teavitused on välja lülitatud (vt Seaded).'}
      </Text>

      <PlanForm visible={planning} suggestion={current} onClose={() => setPlanning(false)} />
    </ScrollView>
  );
}
