import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const InstagramComp = () => {

  useEffect(() => {
  // Alert.alert("","Feature will coming soon , Stay tune")
  }, [])
  
  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <Text style={{color:'#000'}}>Feature will coming soon , Stay tune</Text>
    </View>
  )
}

export default InstagramComp

const styles = StyleSheet.create({})