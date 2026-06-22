import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthScreen } from './src/screens/AuthScreen';
import { colors } from './src/lib/theme';

function Root() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return session ? <AppNavigator /> : <AuthScreen />;
}

export default function App() {
  useFonts({ VarelaRound_400Regular });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <Root />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
