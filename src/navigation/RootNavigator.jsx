import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../screens/SettingsScreen';
import InstagramComp from './InstagramComp';
import CustomDrawerContent from './CustomDrawerContent';
import Icon from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import HomeScreen from '../screens/HomeScreen';
import PolicyScreen from '../screens/PolicyScreen';
import AboutScreen from '../screens/AboutScreen';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LinearGradient from 'react-native-linear-gradient';
import AboutScreenStack from './AboutScreenStack';
// import { Header } from 'react-navigation' ;

const RootNavigator = () => {
  // const Drawer = createMaterialTopTabNavigator()
  const Drawer = createDrawerNavigator();

  const GradientHeader = props => (
    <View style={{backgroundColor: '#eee'}}>
      <LinearGradient
        colors={['red', 'blue']}
        style={[StyleSheet.absoluteFill, {height: Header.HEIGHT}]}>
        <Header {...props} />
      </LinearGradient>
    </View>
  );

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Whatsapp"
      screenOptions={{
        drawerPosition: 'left',
        drawerType: 'slide',
        drawerActiveBackgroundColor: '#0d5a61',
        drawerActiveTintColor: '#25f795',
        headerShadowVisible: false,
        headerStyle: {
          // height: 50,
          backgroundColor: '#074e54',
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '300',
          color: '#fff',
          fontStyle: 'italic',
        },
        headerTintColor: '#fff',
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
          // headerStyle: {
          //   backgroundColor: '#074e54',
          //   shadowColor: '#074e54',
          //   // height: 50,
          // },
          headerTitle: 'Whatsapp status saver',

          title: 'Whatsapp',
          lazy: false,
        }}
      />
      {/* <Drawer.Screen
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
          headerStyle: {
            backgroundColor: '#fa7e1e',
            shadowColor: '#d62976',
          },
          // headerBackground: () => {
          //   <LinearGradient
          //     colors={['#4c669f', '#3b5998', '#192f6a']}
          //     // style={styles.linearGradient}
          //   />;
          // },
        }}
      /> */}
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
        }}
      />
      {/* <Drawer.Screen
        name="Privacy Policy"
        component={PolicyScreen}
        options={{
          title: 'privacyPolicy',
          headerTitle: 'Privacy & Policy',
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
        }}
      /> */}
      <Drawer.Screen
        name="AboutStack"
        component={AboutScreenStack}
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
          title:"About WISS ",
        }}
      />
    </Drawer.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
});
