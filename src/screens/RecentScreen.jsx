import React, {useEffect, useRef, useState, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
  StyleSheet,
  Modal,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  NativeModules,
  StatusBar,
} from 'react-native';
import RNFS from 'react-native-fs';
import StatusView from '../components/StatusView';
import {
  checkMultiple,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
const {ScopedStorage} = NativeModules;
import * as ScopedStoragePackage from 'react-native-scoped-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilterBtn from '../components/FilterBtn';
import {AppContext} from '../context/appContext';

const RecentScreen = ({navigation}) => {
  const {
    requestScopedPermissionAccess,
    getData,
    storeData,
    getAccess,
    getStatuses,
    setIsAccessGranted,
    loading,
    setLoading,
    accessLoading,
    setAccessLoading,
    showDilogue,
    setShowDialogue,
    statuses,
    setStatuses,
    filter,
    setFilter,
    isLatestVersion,
    isExtPermissionGranted
  } = useContext(AppContext);

  const [isCrntStatusVisible, setIsCrntStatusVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const {height, width} = Dimensions.get('window');

  const flatListRef = useRef(null);

  useEffect(() => {
    if (isLatestVersion) {
      getAccess();
      getStatuses();
    }else{
      // isExtPermissionGranted && (
      //   // const statu
      // )
    }

    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Exit', onPress: () => BackHandler.exitApp()},
          ],
          {cancelable: false},
        );
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // const onScreenFocus = navigation.addListener('focus', () => {
    //   getStatuses();
    //   console.log('focus');
    // });

    // Cleanup the event listener when the component is unmounted
    return () => {
      // onScreenFocus()
      backHandler.remove();
    };
  }, [filter]);

  const handleScrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
    }
  };

  // const currentTime = new Date();

  const sortedData = [...statuses.allStatuses].sort((a, b) => {
    return b.lastModified - a.lastModified;
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // paddingHorizontal:10
      }}>
      {/* file loading component */}
      {accessLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ffffff80',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
              backgroundColor: '#075e54',
            }}>
            <ActivityIndicator color={'#fff'} size={30} />
            <Text
              style={{
                color: '#fff',
                fontWeight: '500',
                fontSize: 16,
                marginLeft: 10,
              }}>
              Checking Folder Access
            </Text>
          </View>
        </View>
      )}

      {/* Access dilogue component */}

      {showDilogue && !accessLoading && (
        <View style={{flex: 1, position: 'absolute'}}>
          <Modal animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: 'center',
                    textTransform: 'capitalize',
                  }}>
                  App Needs Storage Permission to download your whatsapp
                  statuses
                </Text>
                <TouchableOpacity
                  onPress={requestScopedPermissionAccess}
                  style={styles.prmBtn}>
                  <Text style={styles.prmBtnText}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}

      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          padding: 10,
          width: width,
        }}>
        <Text style={{color: '#000000', fontWeight: '400', fontSize: 13}}>
          {sortedData.length} items in total
        </Text>
        {/* filter btn */}
        <FilterBtn
          filterModalVisible={filterModalVisible}
          setFilterModalVisible={setFilterModalVisible}
          filter={filter}
          setFilter={setFilter}
          handleScrollToTop={handleScrollToTop}
          isSaved={false}
        />
      </View>

      {loading && statuses.allStatuses.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ffffff80',
          }}>
          <ActivityIndicator color={'green'} size={30} />
        </View>
      )}

      {statuses.allStatuses.length !== 0 ? (
        <FlatList
          refreshing={loading}
          bounces={true}
          onRefresh={() => getStatuses()}
          ref={flatListRef}
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{right: 2}}
          numColumns={2}
          data={sortedData}
          keyExtractor={item => item.name}
          renderItem={({item}) => (
            <StatusView
              item={item}
              isCrntStatusVisible={isCrntStatusVisible}
              setIsCrntStatusVisible={setIsCrntStatusVisible}
              setStatuses={setStatuses}
              navigation={navigation}
              statuses={statuses}
              getStatuses={getStatuses}
            />
          )}
        />
      ) : (
        !loading &&
        !showDilogue && (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: '#000', fontSize: 20, fontWeight: '500'}}>
              Status not found,
            </Text>
            <Text style={{color: '#00000080', fontSize: 14}}>
              See statuses in whatsapp app
            </Text>
            <TouchableOpacity onPress={getStatuses} style={styles.prmBtn}>
              <Text style={styles.prmBtnText}>Reload</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
};

export default RecentScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
    backfaceVisibility: 'visible',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  prmBtn: {
    borderRadius: 10,
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  prmBtnText: {
    fontWeight: '800',
    fontSize: 18,
    color: '#fff',
  },
});
