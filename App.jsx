import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createMaterialBottomTabNavigator();

const App = () => {
  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = ['SelectedStatusScreen'];
    return hideOnScreens.indexOf(routeName) <= -1;
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        id="rootTab"
        initialRouteName="Home"
        activeColor="#25D366"
        inactiveColor="#fff"
        // labeled={false}
        shifting={true}
        barStyle={{backgroundColor: '#075e54', display: 'none'}}
        // screenOptions={{tabbarsty}}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={({route}) => ({
            tabBarVisible: !getTabBarVisibility(route),
            title: 'Home',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="home" color={color} size={24} />
            ),
            
          })}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialIcons name="settings" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
