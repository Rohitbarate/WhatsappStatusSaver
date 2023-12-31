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
  Image,
  StyleSheet,
  Modal,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  NativeModules,
  StatusBar,
  Linking,
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
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../context/appContext';
import SendIntentAndroid from 'react-native-send-intent';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

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
    isExtPermissionGranted,
    showAppTypeDilogue,
    requestExtPermissions,
  } = useContext(AppContext);

  const [isCrntStatusVisible, setIsCrntStatusVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const {height, width} = Dimensions.get('window');
  const [showScrollButton, setShowScrollButton] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    // if (isLatestVersion) {
    // getAccess();
    getStatuses();
    // } else {
    // isExtPermissionGranted && (
    //   // const statu
    // )
    // }

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

    // Cleanup the event listener when the component is unmounted
    return () => {
      // onScreenFocus()
      backHandler.remove();
    };
  }, [filter]);

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollButton(offsetY > 0);
  };

  const handleScrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
    }
  };

  // change filter
  const handleFilter = filterOption => {
    setFilter(filterOption);
    handleScrollToTop();
    // getStatuses()
  };

  // const currentTime = new Date();

  const sortedData = [...statuses.allStatuses].sort((a, b) => {
    return b.lastModified - a.lastModified;
  });

  const bannerAdId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-9923230267052642/1145057793';

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // paddingHorizontal:10
        // paddingBottom: 10,
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
      {showDilogue && !accessLoading && !showAppTypeDilogue && (
        <View style={{flex: 1, position: 'absolute'}}>
          <StatusBar backgroundColor={'red'} barStyle={'light-content'} />
          <Modal animationType="fade" transparent={true}>
            <View style={styles.centeredView}>
              {Platform.Version >= 29 ? (
                // scoped storage permission view --v (10+)
                <View style={styles.modalView}>
                  <Image
                    source={require('../assets/permission_img.jpg')}
                    style={{
                      height: undefined,
                      width: 250,
                      aspectRatio: 3 / 4,
                      borderRadius: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 14,
                      fontWeight: 500,
                      textAlign: 'center',
                      textTransform: 'capitalize',
                      marginTop: 10,
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
              ) : (
                // external storage permission view --v (10-)
                <View style={styles.modalView}>
                  {/* <Image
                    source={require('../assets/permission_img.jpg')}
                    style={{
                      height: undefined,
                      width: 250,
                      aspectRatio: 3 / 4,
                      borderRadius: 10,
                    }}
                  /> */}
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 14,
                      fontWeight: 500,
                      textAlign: 'center',
                      textTransform: 'capitalize',
                      marginTop: 10,
                    }}>
                    App Needs Storage Permission to download your whatsapp
                    statuses
                  </Text>
                  <TouchableOpacity
                    onPress={requestExtPermissions}
                    style={styles.prmBtn}>
                    <Text style={styles.prmBtnText}>Grant Permission</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Modal>
        </View>
      )}
      {/* header*/}
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
        {/* <FilterBtn
          filterModalVisible={filterModalVisible}
          setFilterModalVisible={setFilterModalVisible}
          filter={filter}
          setFilter={setFilter}
          handleScrollToTop={handleScrollToTop}
          isSaved={false}
        /> */}
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => handleFilter('Images')}
            style={[
              styles.filterBtn,
              filter == 'Images' && styles.activeFilterText,
            ]}>
            <Text
              style={[
                styles.filterText,
                {color: filter == 'Images' ? '#fff' : '#000'},
              ]}>
              IMAGES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFilter('Videos')}
            style={[
              styles.filterBtn,
              filter == 'Videos' && styles.activeFilterText,
            ]}>
            <Text
              style={[
                styles.filterText,
                {color: filter == 'Videos' ? '#fff' : '#000'},
              ]}>
              VIDEOS
            </Text>
          </TouchableOpacity>

          {/* <Text style={styles.filterText}>New</Text> */}
        </View>
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
          columnWrapperStyle={{flex: 1, justifyContent: 'flex-start'}}
          onRefresh={() => getStatuses()}
          ref={flatListRef}
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{right: 2}}
          numColumns={2}
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
            <Text style={{color: '#000', fontSize: 18, fontWeight: '500'}}>
              Status not available,
            </Text>
            <Text style={{color: '#00000080', fontSize: 14}}>
              See statuses in whatsapp app
            </Text>
            <TouchableOpacity onPress={getStatuses} style={styles.prmBtn}>
              <Text style={styles.prmBtnText}>Reload</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                SendIntentAndroid.openApp('com.whatsapp').then(wasOpened => {})
              }
              style={[
                styles.prmBtn,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Icon2 name="logo-whatsapp" size={25} color={'#fff'} />
              <Text style={[styles.prmBtnText, {marginLeft: 5}]}>
                Open Whatsapp
              </Text>
            </TouchableOpacity>
          </View>
        )
      )}

      {showScrollButton && (
        <TouchableOpacity
          onPress={handleScrollToTop}
          style={styles.scrollButton}>
          <Icon name="arrow-up" size={30} color={'#fff'} />
        </TouchableOpacity>
      )}
      {/* <View style={{backgroundColor: '#fff',marginTop:2}}>
        <BannerAd
          unitId={bannerAdId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View> */}
    </View>
  );
};

export default RecentScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000090',
    backfaceVisibility: 'visible',
  },
  filterBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  filterText: {
    color: '#000',
    fontWeight: '600',
  },
  activeFilterText: {
    backgroundColor: '#074e54',
    borderColor: 'green',
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
    borderRadius: 6,
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  prmBtnText: {
    fontWeight: '800',
    fontSize: 18,
    color: '#fff',
  },
  scrollButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
});
