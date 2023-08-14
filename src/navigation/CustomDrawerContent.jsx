import {StatusBar, StyleSheet, Text, View, Alert, Linking} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import SendIntentAndroid from 'react-native-send-intent';

const CustomDrawerContent = props => {
  const AppShareImgDir = `${RNFS.DocumentDirectoryPath}/media/shareApp.png`;
  const AppDir = `${RNFS.DocumentDirectoryPath}/media/`;

  // console.log({imageURI});
  const uploadShareAppImg = async () => {
    const imageExists = await RNFS.exists(AppShareImgDir);

    if (!imageExists) {
      RNFS.copyFileAssets('whatsapp-business-green', AppShareImgDir)
        .then(() => {
          console.log('Image copied successfully to the document directory.');
        })
        .catch(err => {
          console.log({err});
        });
    } else {
      console.log('Image already exists in the document directory.');
      RNFS.unlink(AppShareImgDir)
        .then(() => {
          // console.log('FILE DELETED');
          // ToastAndroid.show('Status deleted', ToastAndroid.SHORT);
          // navigation.goBack();
        })
        .catch(err => {
          console.log(err.message);
          ToastAndroid.show(err.message, ToastAndroid.SHORT);
        });
    }
    const files = await RNFS.readDir(AppDir);
    console.log({files});
  };

  const shareAppOptions = {
    message:
      '*Check out our WhatsApp Status Saver app!* \n\nHey there! \n  I wanted to share an amazing app with you: WI Status Saver.It lets you easily save and share WhatsApp statuses like photos, videos, and GIFs. No more asking friends to send them separately – you can download them directly to your device and access them anytime! \n\n *Main Features:*\n\n 📸 Save Photos\n 🎥 Save Videos\n 🚀 Easy Sharing\n ⭐️ Favorites\n 🔍 In-App Gallery\n\n The app is free, user-friendly, and perfect for saving and sharing WhatsApp statuses with ease!\n\n *How to Get Started:*\n\n1. [Link to App Store] - Download WhatsApp Status Saver.\n\n2. Install and grant permissions.\n\n3. Open WhatsApp, view the status you want to save.\n\n4. Go back to WhatsApp Status Saver – the status will be automatically saved.\n',
    url: 'https://photos.app.goo.gl/1VkicHncnjK16kHQ6',
    // url: 'https://github.com/Rohitbarate/WhatsappStatusSaver/releases',
  };

  const shareAppHandler = async () => {
    // await uploadShareAppImg();
    // Share.open(shareAppOptions)
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(err => {
    //     err && console.log(err);
    //   });
    let imageUri;
    RNFS.readDirAssets('images')
      .then(res => {
        console.log({assets: res});
        imageUri = `asset:/app/src/main/assets/${res.path}`;
      })
      .catch(err => {
        err && console.log(err);
      });

    Share.open({
      url: imageUri,
      type: 'image/jpeg', // Set the appropriate image type
    })
      .then(res => console.log('Share response:', res))
      .catch(err => console.log('Share error:', err));
  };

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
      {/* <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'grey',
          opacity: 0.2,
        }}
      />
     // SendIntentAndroid.installRemoteApp("https://example.com/my-app.apk", "my-saved-app.apk").then(installWasStarted => {});
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
      /> */}
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'grey',
          opacity: 0.2,
        }}
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
        onPress={shareAppHandler}
      />
      {/* <DrawerItem
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
      /> */}
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'grey',
          opacity: 0.2,
        }}
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
        onPress={async () => {
          const supported = await Linking.canOpenURL(
            'https://forms.gle/UAYCYcGNv3JSLjfB6',
          );
          if (supported) {
            Linking.openURL('https://forms.gle/UAYCYcGNv3JSLjfB6');
          } else {
            Alert.alert('Failed to open form', 'Try again after some type');
          }
        }}
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
        onPress={async () => {
          const supported = await Linking.canOpenURL(
            'https://forms.gle/1ouqv851sADMNVpi8',
          );
          if (supported) {
            Linking.openURL('https://forms.gle/1ouqv851sADMNVpi8');
          } else {
            Alert.alert('Failed to open form', 'Try again after some type');
          }
        }}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({});
