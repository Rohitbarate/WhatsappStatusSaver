import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

const CustomDrawerContent = props => {
  return (
    <DrawerContentScrollView {...props}>
      <Icon
        style={{
          alignSelf: 'flex-end',
          paddingBottom: 10,
          paddingHorizontal: 10,
        }}
        name="close"
        size={25}
        color={'#00000080'}
        onPress={() => {
          props.navigation.closeDrawer();
        }}
      />
      <DrawerItemList {...props} />
      <View
        style={{height:1,width:'100%',backgroundColor:'grey',opacity:0.2}}
      />
      <DrawerItem
        label={'Check for update'}
        icon={({focused, color, size}) => (
          <Icon
            style={{
              alignSelf: 'center',
              position: 'absolute',
              left: 5,
            }}
            color={color}
            size={size}
            name={'reload'}
          />
        )}
      />
      <DrawerItem
        label={'Rate Us'}
        icon={({focused, color, size}) => (
          <Icon
            style={{
              alignSelf: 'center',
              position: 'absolute',
              left: 5,
            }}
            color={color}
            size={size}
            name={'star-outline'}
          />
        )}
      />
       <View
        style={{height:1,width:'100%',backgroundColor:'grey',opacity:0.2}}
      />
      <DrawerItem
        label={'Share App'}
        icon={({focused, color, size}) => (
          <Icon
            style={{
              alignSelf: 'center',
              position: 'absolute',
              left: 5,
            }}
            color={color}
            size={size}
            name={'share-variant-outline'}
          />
        )}
      />
       <DrawerItem
        label={'Invite Friends'}
        icon={({focused, color, size}) => (
          <Feather
            style={{
              alignSelf: 'center',
              position: 'absolute',
              left: 5,
            }}
            color={color}
            size={size}
            name={'users'}
          />
        )}
      />
       <View
        style={{height:1,width:'100%',backgroundColor:'grey',opacity:0.2}}
      />
      <DrawerItem
        label={'Report Bug'}
        icon={({focused, color, size}) => (
          <Icon
            style={{
              alignSelf: 'center',
              position: 'absolute',
              left: 5,
            }}
            color={color}
            size={size}
            name={'bug'}
          />
        )}
      />
      <DrawerItem
        label={'Suggest a feature'}
        icon={({focused, color, size}) => (
          <Icon
            style={{
              alignSelf: 'center',
              position: 'absolute',
              left: 5,
            }}
            color={color}
            size={size}
            name={'lightbulb-on-outline'}
          />
        )}
      />
     
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({});
