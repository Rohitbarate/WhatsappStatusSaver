import { View, Text } from 'react-native'
import React from 'react'
import App from './App';
import { AppProvider } from './src/context/appContext';

const AppWraper = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  )
}

export default AppWraper