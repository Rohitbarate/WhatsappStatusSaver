import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SelectedStatus from '../screens/SelectedStatus'
import SavedScreen from '../screens/SavedScreen'

const SavedScreenStack = () => {

    const Stack = createNativeStackNavigator()

  return (
   <Stack.Navigator
    initialRouteName='savedScreen'
   screenOptions={{
    headerShown:false
   }}
   >
    <Stack.Screen name='savedScreen' component={SavedScreen} options={{
      headerShown:false
    }} />
    <Stack.Screen name='SelectedStatusScreen' component={SelectedStatus} options={{ animation:'slide_from_bottom',animationDuration:50}} />
   </Stack.Navigator>
  )
}

export default SavedScreenStack

const styles = StyleSheet.create({})