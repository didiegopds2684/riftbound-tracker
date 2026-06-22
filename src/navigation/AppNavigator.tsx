import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors, fonts } from '../lib/theme';
import { useBreakpoint } from '../lib/useBreakpoint';
import { WebSidebar, TabName } from '../components/WebSidebar';
import { MatchCounterScreen } from '../screens/MatchCounterScreen';
import { MatchesScreen } from '../screens/MatchesScreen';
import { ChampionsScreen } from '../screens/ChampionsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, string> = {
  Jogar:    '⚔',
  Partidas: '📋',
  Legends:  '🏆',
  Perfil:   '👤',
};

const SCREENS: Record<TabName, React.ComponentType> = {
  Jogar:    MatchCounterScreen,
  Partidas: MatchesScreen,
  Legends:  ChampionsScreen,
  Perfil:   ProfileScreen,
};

// ── Desktop web layout: sidebar + full-height content area ────────────────────
function WebLayout() {
  const [active, setActive] = useState<TabName>('Jogar');
  const Screen = SCREENS[active];

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background }}>
      <WebSidebar active={active} onNavigate={setActive} />
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Screen />
      </View>
    </View>
  );
}

// ── Mobile: standard bottom tab navigator ────────────────────────────────────
function MobileLayout() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: focused ? 21 : 18,
                  textShadowColor: focused ? colors.cyan : 'transparent',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: focused ? 8 : 0,
                }}
              >
                {ICONS[route.name]}
              </Text>
            </View>
          ),
          tabBarActiveTintColor: colors.cyan,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: 4,
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 0.4,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Jogar"    component={MatchCounterScreen} />
        <Tab.Screen name="Partidas" component={MatchesScreen} />
        <Tab.Screen name="Legends"  component={ChampionsScreen} />
        <Tab.Screen name="Perfil"   component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ── Root: pick layout based on screen width ───────────────────────────────────
export function AppNavigator() {
  const { isDesktop } = useBreakpoint();
  return isDesktop ? <WebLayout /> : <MobileLayout />;
}
