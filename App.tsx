import React from 'react';
import { ThemeProvider } from './src/theme/ThemeContext';
import Splash from './src/screens/Splash';
import Notes from './src/screens/Notes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Settings from './src/screens/Settings';
import AddNote from './src/screens/AddNote';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, display: 'flex' }}>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Splash"
          >
            <Stack.Screen name="Splash" component={Splash}></Stack.Screen>
            <Stack.Screen name="Notes" component={Notes}></Stack.Screen>
            <Stack.Screen name="AddNote" component={AddNote}></Stack.Screen>
            <Stack.Screen name="Settings" component={Settings}></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaView>
  );
};

export default App;
