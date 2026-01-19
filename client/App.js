/**
 * App.js - React Native Version
 */
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 
import LoginPage from './src/pages/LoginPage';
import RegisterPage from './src/pages/RegisterPage';
import DashboardPage from './src/pages/DashboardPage';

const Stack = createStackNavigator();

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login">
          {(props) => <LoginPage {...props} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
        </Stack.Screen>

        <Stack.Screen name="Register">
          {(props) => <RegisterPage {...props} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
        </Stack.Screen>

        <Stack.Screen name="Dashboard">
          {(props) => <DashboardPage {...props} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
        </Stack.Screen> 

      </Stack.Navigator>
    </NavigationContainer>
  );
}