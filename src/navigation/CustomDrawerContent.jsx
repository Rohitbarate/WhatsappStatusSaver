import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerContent = props => {
  return (
    <DrawerContentScrollView {...props}>
      <StatusBar
        backgroundColor={'#074e54'}
        barStyle={'light-content'}
      />
      {/* <View style={{height: 50, width: '100%', backgroundColor: '#000'}}></View> */}
      <DrawerItemList {...props} />
      <DrawerItem
        label={'Check for update'}
        icon={({ focused, color, size }) => <Icon  style={{
          alignSelf: 'center',
          position: 'absolute',
          left: 5,
        }} color={color} size={size} name={'reload'} />}
        
      />
      <DrawerItem
        label={'Rate Us'}
        icon={({ focused, color, size }) => <Icon  style={{
          alignSelf: 'center',
          position: 'absolute',
          left: 5,
        }} color={color} size={size} name={'star-outline'} />}
      />
      <DrawerItem
        label={'Share App'}
        icon={({ focused, color, size }) => <Icon  style={{
          alignSelf: 'center',
          position: 'absolute',
          left: 5,
        }} color={color} size={size} name={'share-outline'} />}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({});
