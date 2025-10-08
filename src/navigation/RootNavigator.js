import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CreatureScreen from '../screens/CreatureScreen';
import CreatureLibraryScreen from '../screens/CreatureLibraryScreen';
import InfoScreen from '../screens/InfoScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Creature" component={CreatureScreen} />
        <Stack.Screen name="CreatureLibrary" component={CreatureLibraryScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
