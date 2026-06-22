import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { colors, fonts } from '../lib/theme';
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

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: focused ? 21 : 18,
                  // cyan shadow glow on active icon
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
