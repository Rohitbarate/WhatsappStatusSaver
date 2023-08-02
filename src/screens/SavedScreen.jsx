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
} from 'react-native';
import RNFS from 'react-native-fs';
import StatusView from '../components/StatusView';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterBtn from '../components/FilterBtn';
import {AppContext} from '../context/appContext';

const SavedScreen = ({navigation}) => {
  const {
    savedStatuses,
    setSavedStatuses,
    requestExtPermissions,
    isExtPermissionGranted,
    setIsExtPermissionGranted,
    getSavedStatuses,
    savedFilter,
    setSavedFilter,
    loading,
    setLoading,
  } = useContext(AppContext);
  // const [loading, setLoading] = useState(false);
  // const [savedFilter, setSavedFilter] = useState('All Statuses'); // opts : 'IMAGES','VIDEOS','ALL' .etc

  const [isCrntStatusVisible, setIsCrntStatusVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const {height, width} = Dimensions.get('window');
  const [fileNames, setFileNames] = useState([]);
  // const [savedStatuses, setSavedStatuses] = useState({
  //   allStatuses: [],
  //   currentMedia: '',
  //   mediaName: '',
  // });

  const flatListRef = useRef(null);

  useEffect(() => {
    getSavedStatuses();
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

    // navigation.addListener('focus', () => {
    //   getSavedStatuses();
    //   console.log('focus');
    // });

    // Cleanup the event listener when the component is unmounted
    return () => {
      // onScreenFocus;
      backHandler.remove();
    };
  }, [savedFilter]);

  const WhatsAppStatusDirectory = `${RNFS.DocumentDirectoryPath}/Media/Statuses/`;

  const onlyVideos = /\.(mp4)$/i;
  const onlyImages = /\.(jpg|jpeg|png|gif)$/i;
  const AllMedia = /\.(jpg|jpeg|png|gif|mp4|mov)$/i;

  // const getSavedStatuses = async () => {
  //   try {
  //     console.log('getSavedStatuses called !');
  //     setLoading(true);
  //     // const appV = Platform.Version;
  //     // if (appV >= 29) {
  //     //   setIsExtPermissionGranted(true);
  //     const isPathExist = await RNFS.exists(WhatsAppStatusDirectory);
  //     // console.log({isPathExist});
  //     if (!isPathExist) {
  //       await RNFS.mkdir(WhatsAppStatusDirectory);
  //     }
  //     const files = await RNFS.readDir(WhatsAppStatusDirectory);
  //     // console.log({files});
  //     if (savedFilter === 'Images') {
  //       const filterFiles = files.savedFilter(file => onlyImages.test(file.name));
  //       console.log({filterFiles});
  //       setSavedStatuses(preState => ({...preState, allStatuses: filterFiles}));
  //       if (filterFiles.length === 0) {
  //         ToastAndroid.show('Status not found', ToastAndroid.SHORT);
  //       }
  //     } else if (savedFilter === 'Videos') {
  //       const filterFiles = files.savedFilter(file => onlyVideos.test(file.name));
  //       setSavedStatuses(preState => ({...preState, allStatuses: filterFiles}));
  //       if (filterFiles.length === 0) {
  //         ToastAndroid.show('Status not found', ToastAndroid.SHORT);
  //       }
  //     } else {
  //       const filterFiles = files.savedFilter(file => AllMedia.test(file.name));
  //       setSavedStatuses(preState => ({...preState, allStatuses: filterFiles}));
  //       if (filterFiles.length === 0) {
  //         ToastAndroid.show('Status not found', ToastAndroid.SHORT);
  //       }

  //       console.log({filterFiles});
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.log({getAllStatuses_error_saved: error});
  //   }
  // };

  const handleScrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
    }
  };

  const currentTime = new Date();

  const sortedData = [...savedStatuses.allStatuses].sort((a, b) => {
    const timeA = new Date(a.mtime);
    const timeB = new Date(b.mtime);
    const differenceA = currentTime - timeA;
    const differenceB = currentTime - timeB;
    return differenceA - differenceB;
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
      }}>
      {loading && savedStatuses.allStatuses.length === 0 && (
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
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          paddingVertical: 10,
          width: '100%',
        }}>
        <Text style={{color: '#000000', fontWeight: '400', fontSize: 13}}>
          {sortedData.length} items in total
        </Text>
        {/* savedFilter btn */}
        <FilterBtn
          filterModalVisible={filterModalVisible}
          setFilterModalVisible={setFilterModalVisible}
          filter={savedFilter}
          setFilter={setSavedFilter}
          handleScrollToTop={handleScrollToTop}
          isSaved={true}
        />
      </View>

      {/* {!isExtPermissionGranted && (
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
                App Needs Storage Permission to load your whatsapp savedStatuses
              </Text>
              <TouchableOpacity
                onPress={requestPermissions}
                style={styles.prmBtn}>
                <Text style={styles.prmBtnText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )} */}

      {savedStatuses.allStatuses.length !== 0 ? (
        <FlatList
          stickyHeaderHiddenOnScroll={true}
          columnWrapperStyle={{flex:1,justifyContent: 'flex-start'}}
          refreshing={loading}
          bounces={true}
          onRefresh={() => getSavedStatuses()}
          ref={flatListRef}
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{right: 2}}
          numColumns={2}
          data={sortedData}
          keyExtractor={item => item.name + item.lastModified}
          renderItem={({item}) => (
            <StatusView
              item={item}
              isCrntStatusVisible={isCrntStatusVisible}
              setIsCrntStatusVisible={setIsCrntStatusVisible}
              setStatuses={setSavedStatuses}
              navigation={navigation}
              statuses={savedStatuses}
              getStatuses={getSavedStatuses}
            />
          )}
        />
      ) : (
        !loading && (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: '#000', fontSize: 20, fontWeight: '500'}}>
              Downloaded status not found,
            </Text>
            <Text style={{color: '#00000080', fontSize: 14}}>
              Download savedStatuses from RECENT screen{' '}
            </Text>
            <TouchableOpacity
              onPress={getSavedStatuses}
              style={[styles.prmBtn, {paddingHorizontal: 10, borderRadius: 5}]}>
              <Text style={styles.prmBtnText}>Reload</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
};

export default SavedScreen;

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
