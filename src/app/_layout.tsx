import * as Notifications from 'expo-notifications';
import { Tabs } from 'expo-router/js-tabs';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { configureNotifications, NotificationData } from '../lib/notifications';
import { StoreProvider, useStore } from '../lib/store';
import { colors } from '../lib/theme';

configureNotifications();

/** Seob teavitused ja äpi esiplaanile tuleku andmetega. */
function NotificationBridge() {
  const { loaded, showSuggestion, refresh } = useStore();
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!loaded || !response) return;
    const data = response.notification.request.content.data as Partial<NotificationData> | undefined;
    if (data?.kind === 'suggestion' && data.suggestionId) showSuggestion(data.suggestionId);
  }, [loaded, response, showSuggestion]);

  useEffect(() => {
    if (!loaded) return;
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') void refresh();
    });
    return () => sub.remove();
  }, [loaded, refresh]);

  return null;
}

const icon = (emoji: string) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NotificationBridge />
        <StatusBar style="dark" />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text },
            sceneStyle: { backgroundColor: colors.background },
          }}
        >
          <Tabs.Screen name="index" options={{ title: 'Täna', tabBarIcon: icon('💡') }} />
          <Tabs.Screen name="plaanid" options={{ title: 'Plaanid', tabBarIcon: icon('📅') }} />
          <Tabs.Screen name="seaded" options={{ title: 'Seaded', tabBarIcon: icon('⚙️') }} />
        </Tabs>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
