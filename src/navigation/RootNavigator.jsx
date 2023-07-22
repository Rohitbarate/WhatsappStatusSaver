import {View, Text,TouchableOpacity} from 'react-native';
import React from 'react';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../screens/SettingsScreen';
import InstagramComp from './InstagramComp';
import WhatsappComp from './WhatsappComp';
import CustomDrawerContent from './CustomDrawerContent';
import Icon from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import HomeScreen from '../screens/HomeScreen';
import PolicyScreen from '../screens/PolicyScreen';
import AboutScreen from '../screens/AboutScreen';

const RootNavigator = () => {
  // const Tab = createMaterialTopTabNavigator()
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'left',
        drawerType: 'slide',
        headerStyle:{
          height:60,
          shadowOpacity:0,
          shadowOffset:0,
        
        },
        headerTitleStyle:{
          color:'#fff'
        },
        headerTintColor:'#fff',
      }}>
      <Drawer.Screen
        name="Whatsapp"
        
        component={HomeScreen}
        options={{
          drawerIcon: ({color, size, focused}) => (
            <Icon
              style={{
                alignSelf: 'center',
                position: 'absolute',
                left: 5,
              }}
              name="whatsapp"
              size={size}
              color={color}
            />
          ),
          headerStyle:{
            backgroundColor:'#074e54',
            shadowColor:'#074e54',
            height:50,
          },
          headerTitle:'Whatsapp status saver',
          headerTitleStyle:{
            fontSize:20,
            fontWeight:'300',
            color:'#fff',
            fontStyle:'italic'
          },
          title:'Whatsapp',
          lazy:false,
         
        }}
      />
      <Drawer.Screen
        name="Instagram"
        component={InstagramComp}
        options={{
          drawerIcon: ({color, size, focused}) => (
            <Icon
              style={{
                alignSelf: 'center',
                position: 'absolute',
                left: 5,
              }}
              name="instagram"
              size={size}
              color={color}
            />
          ),
          headerStyle:{
            backgroundColor:'#ff8800',
            shadowColor:'#ff8800',
          }
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({color, size, focused}) => (
            <EvilIcons
              style={{
                alignSelf: 'center',
                position: 'absolute',
                left: 5,
              }}
              name="gear"
              size={size}
              color={color}
            />
          ),
          headerStyle:{
            backgroundColor:'#075e54',
            shadowColor:'#075e54',
          }
        }}
      />
      <Drawer.Screen
        name="Privacy Policy"
        component={PolicyScreen}
        options={{
          title:'privacyPolicy',
          drawerIcon: ({color, size, focused}) => (
            <Icon2
              style={{
                alignSelf: 'center',
                position: 'absolute',
                left: 5,
              }}
              name="shield-check-outline"
              size={size}
              color={color}
            />
          ),
          headerStyle:{
            backgroundColor:'#075e54',
            shadowColor:'#075e54',
          }
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          drawerIcon: ({color, size, focused}) => (
            <Icon3
              style={{
                alignSelf: 'center',
                position: 'absolute',
                left: 5,
              }}
              name="exclamationcircleo"
              size={size}
              color={color}
            />
          ),
          headerStyle:{
            backgroundColor:'#075e54',
            shadowColor:'#075e54',
          }
        }}
      />
    </Drawer.Navigator>
  );
};

export default RootNavigator;
