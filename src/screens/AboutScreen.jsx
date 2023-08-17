import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AboutScreen = ({navigation}) => {
  // console.log({res: Platform.constants});
  const [appVersion, setAppVersion] = useState('');
  const [appName, setAppName] = useState('');

  useEffect(() => {
    async function fetchAppVersion() {
      const version = await DeviceInfo.getVersion();
      const appName = await DeviceInfo.getApplicationName();
      setAppVersion(version);
      setAppName(appName);
    }
    fetchAppVersion();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 100,
        backgroundColor: '#ededed',
        paddingHorizontal: 10,
      }}>
      <Image
        source={require('../../android/app/src/main/ic_launcher-playstore.png')}
        style={{height: 60, aspectRatio: 1, borderRadius: 14}}
      />
      <Text
        style={{
          color: '#363636',
          marginTop: 8,
          fontSize: 18,
          fontWeight: '600',
        }}>
        {appName}
      </Text>
      <Text
        style={{
          color: 'grey',
          marginTop: 4,
          fontSize: 15,
          fontWeight: '400',
          marginBottom: 20,
        }}>
        Version: {appVersion}
      </Text>
      <TouchableOpacity
       onPress={()=>navigation.navigate("Privacy policy")}
      activeOpacity={0.5} style={styles.optContDiv}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingVertical: 18,
          }}>
          <Text style={{color: '#303030', fontSize: 17, fontWeight: '500'}}>
            Privacy policy
          </Text>
          <Icon color={'#00000050'} size={16} name={'arrow-forward-ios'} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={()=>navigation.navigate("LicenseScreen")}
      activeOpacity={0.5} style={styles.optContDiv}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingVertical: 18,
          }}>
          <Text style={{color: '#303030', fontSize: 17, fontWeight: '500'}}>
            Open source licenses
          </Text>
          <Icon color={'#00000050'} size={16} name={'arrow-forward-ios'} />
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity activeOpacity={0.5} style={styles.optContDiv}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingVertical: 18,
          }}>
          <Text style={{color: '#303030', fontSize: 17, fontWeight: '500'}}>
            About developer
          </Text>
          <Icon color={'#00000050'} size={16} name={'arrow-forward-ios'} />
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  optContDiv: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    elevation: 5,
  },
  optCont: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
});
