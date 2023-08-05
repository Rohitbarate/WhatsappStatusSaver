import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RecentScreen from './RecentScreen';
import SavedScreen from './SavedScreen';
import RecentScreenStack from '../navigation/RecentScreenStack';
import {getFocusedRouteNameFromRoute, useRoute} from '@react-navigation/native';
import SavedScreenStack from '../navigation/SavedScreenStack';
import {AppContext} from '../context/appContext';

const HomeScreen = ({navigation}) => {
  const {scrollEnabled, setScrollEnabled} = useContext(AppContext);
  const TopTabBar = createMaterialTopTabNavigator();

  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = ['SelectedStatusScreen'];
    return hideOnScreens.indexOf(routeName) <= -1;
  };

  return (
    <TopTabBar.Navigator
      screenOptions={({route}) => ({
        tabBarInactiveTintColor: '#fff',
        tabBarActiveTintColor: '#25D366',
        tabBarStyle: {
          backgroundColor: '#074e54',
          display: getTabBarVisibility(route) ? 'flex' : 'none',
          // height:40
        },
        tabBarShowIcon: true,
        tabBarIndicatorStyle: {backgroundColor: '#25D366'},
        swipeEnabled:scrollEnabled,
      })}
      initialRouteName="Recent"
      backBehavior="initialRoute">
      <TopTabBar.Screen
        name="Recent"
        component={RecentScreenStack}
        options={
          {
            //   tabBarIcon: ({color}) => (
            //     <MaterialCommunityIcons name="camera-timer" size={20} color={color} />
            //   ),
          }
        }
      />
      <TopTabBar.Screen
        name="SavedStack"
        component={SavedScreenStack}
        options={{
          title: 'saved',
          //   tabBarIcon: ({color}) => (
          //     <MaterialCommunityIcons name="download" size={20} color={color} />
          //   ),
        }}
      />
    </TopTabBar.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
