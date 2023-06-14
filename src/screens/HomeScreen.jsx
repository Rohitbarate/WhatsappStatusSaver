import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RecentScreen from './RecentScreen';
import SavedScreen from './SavedScreen';

const HomeScreen = () => {
  const TopTabBar = createMaterialTopTabNavigator();

  return (
    <TopTabBar.Navigator
      screenOptions={{
        tabBarInactiveTintColor: '#fff',
        tabBarActiveTintColor: '#25D366',
        tabBarStyle: {backgroundColor: '#075e54'},
        tabBarShowIcon: true,
        tabBarIndicatorStyle:{backgroundColor:'#25D366'}
      }}>
      <TopTabBar.Screen
        name="Recent"
        component={RecentScreen}
        options={{
        //   tabBarIcon: ({color}) => (
        //     <MaterialCommunityIcons name="camera-timer" size={20} color={color} />
        //   ),
        }}
      />
      <TopTabBar.Screen name="Saved" component={SavedScreen} options={{
        //   tabBarIcon: ({color}) => (
        //     <MaterialCommunityIcons name="download" size={20} color={color} />
        //   ),
        }}/>
    </TopTabBar.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
