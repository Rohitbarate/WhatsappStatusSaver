import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RecentScreen from '../screens/RecentScreen'
import SelectedStatus from '../screens/SelectedStatus'

const RecentScreenStack = () => {

    const Stack = createNativeStackNavigator()

  return (
   <Stack.Navigator
    initialRouteName='recentScreen'
   screenOptions={{
    headerShown:false
   }}
   >
    <Stack.Screen name='recentScreen' component={RecentScreen} options={{
     
      headerShown:false
    }} />
    <Stack.Screen name='SelectedStatusScreen' component={SelectedStatus} options={{ animation:'slide_from_bottom',animationDuration:50}} />
   </Stack.Navigator>
  )
}

export default RecentScreenStack

const styles = StyleSheet.create({})