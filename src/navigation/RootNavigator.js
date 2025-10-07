import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CreatureScreen from '../screens/CreatureScreen';
import CreatureLibraryScreen from '../screens/CreatureLibraryScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Creature" component={CreatureScreen} />
        <Stack.Screen name="CreatureLibrary" component={CreatureLibraryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

