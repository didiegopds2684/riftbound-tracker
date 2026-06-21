import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors } from '../lib/theme';
import { MatchCounterScreen } from '../screens/MatchCounterScreen';
import { MatchesScreen } from '../screens/MatchesScreen';
import { ChampionsScreen } from '../screens/ChampionsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, string> = {
  Jogar: '⚔',
  Partidas: '📋',
  Legends: '🏆',
  Perfil: '👤',
};

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 18 }}>{ICONS[route.name]}</Text>
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingBottom: 4,
            height: 60,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Jogar" component={MatchCounterScreen} />
        <Tab.Screen name="Partidas" component={MatchesScreen} />
        <Tab.Screen name="Legends" component={ChampionsScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
