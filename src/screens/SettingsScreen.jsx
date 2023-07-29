import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useContext} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../context/appContext';

const SettingsScreen = () => {
  // const {appVersion, setAppVer} = useContext(AppContext);
  const [whatsappType, setWhatsappType] = useState('Whatsapp'); // options 1.Whatsapp 2. WA_business
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [modelfor, setModelfor] = useState(null); // 'appType' & 'appTheme'
  const [appTheme, setAppTheme] = useState('Light'); // Light || Dark || System

  const handleFilter = filterOption => {
    setWhatsappType(filterOption);
    setIsModelVisible(false);
  };

  const handleThemeFilter = filterOption => {
    setAppTheme(filterOption);
    setIsModelVisible(false);
  };

  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        paddingVertical: 16,
        alignItems: 'center',
      }}>
      {/* app type */}
      <TouchableOpacity
        style={styles.optContDiv}
        onPress={() => {
          setIsModelVisible(true);
          setModelfor('appType');
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon3 color={'#000'} size={30} name={'options-outline'} />
          <View style={styles.optCont}>
            <Text style={{color: '#000', fontSize: 16, fontWeight: '600'}}>
              Whatsapp Type
            </Text>
            <Text style={{color: '#25c795', fontSize: 12}}>
              {whatsappType === 'WA_business'
                ? 'Whatsapp business'
                : 'Whatsapp (Default)'}
            </Text>
          </View>
        </View>
        <Icon color={'#000'} size={20} name={'arrow-forward-ios'} />
      </TouchableOpacity>
      {/* app theme */}
      <TouchableOpacity
        style={[styles.optContDiv]}
        onPress={() => {
          Alert.alert('', 'Feature will coming soon, Stay tune' );
          // setIsModelVisible(true);
          // setModelfor('appTheme');
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon3 color={'#000'} size={30} name={'color-palette'} />
          <View style={styles.optCont}>
            <Text style={{color: '#000', fontSize: 16, fontWeight: '600'}}>
              Theme
            </Text>
            <Text style={{color: '#25c795', fontSize: 12}}>
              {appTheme == 'System' ? 'System default' : appTheme}
            </Text>
          </View>
        </View>
        <Icon color={'#000'} size={20} name={'arrow-forward-ios'} />
      </TouchableOpacity>

      {/* {isModelVisible && ( */}
      <Modal
        visible={isModelVisible && modelfor !== null}
        animationType="slide"
        transparent>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 5,
            overflow: 'hidden',
          }}
          onPress={() => setIsModelVisible(false)}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              // position: 'absolute',
              right: 0,
              bottom: 0,
              borderRadius: 12,
              overflow: 'hidden',
              //   borderWidth: 1,
              width: '94%',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: '10%',
                paddingBottom: 20,
                width: '100%',
              }}>
              <View
                style={{
                  width: 50,
                  height: 5,
                  backgroundColor: 'grey',
                  marginVertical: 5,
                  borderRadius: 5,
                  alignSelf: 'center',
                }}
              />
              {/* app type model */}
              {modelfor == 'appType' && (
                <View>
                  <TouchableOpacity
                    style={styles.filterItem}
                    onPress={() => handleFilter('Whatsapp')}>
                    <Icon2
                      name={'whatsapp'}
                      size={20}
                      color={whatsappType === 'Whatsapp' ? 'green' : '#000'}
                    />
                    <Text
                      style={[
                        styles.filterItemText,
                        {color: whatsappType === 'Whatsapp' ? 'green' : '#000'},
                      ]}>
                      Whatsapp
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
                  />
                  <TouchableOpacity
                    style={styles.filterItem}
                    onPress={() => handleFilter('WA_business')}>
                    {/* <Icon2
                  name={'whatsapp'}
                  size={20}
                  color={whatsappType === 'WA_business' ? 'green' : '#000'}
                /> */}
                    <Image
                      style={{height: 20, width: 20}}
                      source={
                        whatsappType === 'WA_business'
                          ? require('../assets/whatsapp-business-green.png')
                          : require('../assets/whatsapp-business.png')
                      }
                    />
                    <Text
                      style={[
                        styles.filterItemText,
                        {
                          color:
                            whatsappType === 'WA_business' ? 'green' : '#000',
                        },
                      ]}>
                      Whatsapp business
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
                  />
                </View>
              )}

              {/* app theme model */}
              {modelfor == 'appTheme' && (
                <View>
                  <TouchableOpacity
                    style={styles.filterItem}
                    onPress={() => handleThemeFilter('System')}>
                    <Icon2
                      name={'whatsapp'}
                      size={20}
                      color={appTheme === 'System' ? 'green' : '#000'}
                    />
                    <Text
                      style={[
                        styles.filterItemText,
                        {color: appTheme === 'System' ? 'green' : '#000'},
                      ]}>
                      System default
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
                  />
                  <TouchableOpacity
                    style={styles.filterItem}
                    onPress={() => handleThemeFilter('Light')}>
                    <Icon2
                      name={'whatsapp'}
                      size={20}
                      color={appTheme === 'Light' ? 'green' : '#000'}
                    />
                    <Text
                      style={[
                        styles.filterItemText,
                        {color: appTheme === 'Light' ? 'green' : '#000'},
                      ]}>
                      Light
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
                  />
                  <TouchableOpacity
                    style={styles.filterItem}
                    onPress={() => handleThemeFilter('Dark')}>
                    <Icon2
                      name={'whatsapp'}
                      size={20}
                      color={appTheme === 'Dark' ? 'green' : '#000'}
                    />
                    <Text
                      style={[
                        styles.filterItemText,
                        {
                          color: appTheme === 'Dark' ? 'green' : '#000',
                        },
                      ]}>
                      Dark
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
                  />
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  optContDiv: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#00000050',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  optCont: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  filterItem: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterItemText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
});
