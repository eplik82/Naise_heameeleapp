import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, Text, View } from 'react-native';
import { formatDateTime } from '../lib/logic';
import { common } from '../lib/theme';

type Props = { value: Date; onChange: (d: Date) => void };

/** Kuupäeva ja kellaaja valik: Androidis süsteemi dialoogid, iOS-is kompaktne valija. */
export function DateTimeField({ value, onChange }: Props) {
  if (Platform.OS === 'ios') {
    return (
      <View style={{ alignItems: 'flex-start' }}>
        <DateTimePicker
          value={value}
          mode="datetime"
          display="compact"
          minimumDate={new Date()}
          minuteInterval={5}
          locale="et-EE"
          onValueChange={(_, d) => onChange(d)}
        />
      </View>
    );
  }

  const open = () => {
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      minimumDate: new Date(),
      onValueChange: (_, date) => {
        DateTimePickerAndroid.open({
          value: date,
          mode: 'time',
          is24Hour: true,
          onValueChange: (__, time) => onChange(time),
        });
      },
    });
  };

  return (
    <Pressable onPress={open} style={common.input} accessibilityRole="button">
      <Text style={common.text}>📅 {formatDateTime(value)}</Text>
    </Pressable>
  );
}
