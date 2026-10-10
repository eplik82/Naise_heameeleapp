import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { PlanForm } from '../components/PlanForm';
import { formatDateTime } from '../lib/logic';
import { Plan, useStore } from '../lib/store';
import { colors, common } from '../lib/theme';

function PlanCard({ plan }: { plan: Plan }) {
  const { togglePlanDone, deletePlan } = useStore();
  const past = new Date(plan.date) < new Date();

  const confirmDelete = () =>
    Alert.alert('Kustuta plaan?', plan.calendarEventId ? 'Kirje kustutatakse ka kalendrist.' : undefined, [
      { text: 'Loobu', style: 'cancel' },
      { text: 'Kustuta', style: 'destructive', onPress: () => void deletePlan(plan.id) },
    ]);

  return (
    <View style={[common.card, plan.done && { opacity: 0.6 }]}>
      <Text style={[common.h2, plan.done && { textDecorationLine: 'line-through' }]}>{plan.title}</Text>
      <Text style={[common.text, past && !plan.done && { color: colors.primary }]}>
        {formatDateTime(new Date(plan.date))}
        {plan.calendarEventId ? '  ·  📅 kalendris' : ''}
      </Text>
      {plan.description ? <Text style={common.muted}>{plan.description}</Text> : null}
      <View style={[common.row, { marginTop: 4 }]}>
        <Pressable onPress={() => togglePlanDone(plan.id)} style={{ padding: 6 }}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>{plan.done ? '↩︎ Tagasi' : '✓ Tehtud'}</Text>
        </Pressable>
        <Pressable onPress={confirmDelete} style={{ padding: 6 }}>
          <Text style={{ color: colors.muted }}>🗑 Kustuta</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function PlansScreen() {
  const { plans } = useStore();
  const [adding, setAdding] = useState(false);
  const active = plans.filter((p) => !p.done);
  const done = plans.filter((p) => p.done).reverse();

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      <Button title="➕ Uus üllatus" onPress={() => setAdding(true)} />

      <Text style={common.h2}>Tulekul</Text>
      {active.length === 0 ? (
        <Text style={common.muted}>Plaane pole. Planeeri mõni tänane soovitus või lisa oma idee.</Text>
      ) : (
        active.map((p) => <PlanCard key={p.id} plan={p} />)
      )}

      {done.length > 0 && (
        <>
          <Text style={common.h2}>Tehtud</Text>
          {done.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </>
      )}

      <PlanForm visible={adding} onClose={() => setAdding(false)} />
    </ScrollView>
  );
}
