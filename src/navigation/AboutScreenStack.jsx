import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AboutScreen from '../screens/AboutScreen';
import PolicyScreen from '../screens/PolicyScreen';
import LicenseScreen from '../screens/LicenseScreen';
import AboutDeveloperScreen from '../screens/AboutDeveloperScreen';

const AboutScreenStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="About"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="About"
        // ='About WISS'
        component={AboutScreen}
      />
      <Stack.Screen name="Privacy policy" component={PolicyScreen} />
      <Stack.Screen name="LicenseScreen" component={LicenseScreen} />
      <Stack.Screen
        name="AboutDeveloperScreen"
        component={AboutDeveloperScreen}
      />
    </Stack.Navigator>
  );
};

export default AboutScreenStack;

const styles = StyleSheet.create({});
