import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import RNFS from 'react-native-fs';
import StatusView from '../components/StatusView';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const RecentScreen = () => {
  const [isAllPermissionGranted, setIsAllPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL'); // opts : 'IMG','VIDEO','ALL' .etc
  const [statuses, setStatuses] = useState({
    allStatuses: [],
    currentMedia: '',
  });
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const {height, width} = Dimensions.get('window');

  const flatListRef = useRef(null);

  useEffect(() => {
    getStatuses();
  }, [filter]);

  const WhatsAppStatusDirectory = `${RNFS.ExternalStorageDirectoryPath}/Android/media/com.whatsapp/Whatsapp/Media/.Statuses/`;

  const onlyVideos = /\.(mp4)$/i;
  const onlyImages = /\.(jpg|jpeg|png|gif)$/i;
  const AllMedia = /\.(jpg|jpeg|png|gif|pdf|mp4|mov)$/i;

  const getStatuses = async () => {
    try {
        setLoading(true)
      const granted = await requestPermissions();
      if (!granted) {
          setIsAllPermissionGranted(false);
          setLoading(false)
      } else {
        setIsAllPermissionGranted(true);
        const files = await RNFS.readDir(WhatsAppStatusDirectory);
        if (filter === 'IMG') {
          const filterFiles = files.filter(file => onlyImages.test(file.name));
          console.log({filterFiles});
          setStatuses(preState => ({...preState, allStatuses: filterFiles}));
        } else if (filter === 'VIDEO') {
          const filterFiles = files.filter(file => onlyVideos.test(file.name));
          console.log({filterFiles});
          setStatuses(preState => ({...preState, allStatuses: filterFiles}));
        } else {
          const filterFiles = files.filter(file => AllMedia.test(file.name));
          console.log({filterFiles});
          setStatuses(preState => ({...preState, allStatuses: filterFiles}));
        }
        setLoading(false)
      }
    } catch (error) {
        setLoading(false)
      console.log({getAllStatuses_error: error});
    }
  };

  const requestPermissions = async () => {
    try {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
      ])
        .then(result => {
          if (
            result['android.permission.READ_MEDIA_IMAGES'] &&
            result['android.permission.READ_MEDIA_VIDEO'] &&
            result['android.permission.READ_MEDIA_AUDIO'] &&
            result['android.permission.READ_EXTERNAL_STORAGE'] &&
            // result['android.permission.MANAGE_EXTERNAL_STORAGE'] &&
            result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
          ) {
            console.log('permission granted');
            setIsAllPermissionGranted(true);
            //   loadStatuses();
            return true;
          } else if (
            result['android.permission.READ_MEDIA_IMAGES'] ||
            result['android.permission.READ_MEDIA_VIDEO'] ||
            result['android.permission.READ_MEDIA_AUDIO'] ||
            result['android.permission.READ_EXTERNAL_STORAGE'] ||
            // result['android.permission.MANAGE_EXTERNAL_STORAGE'] ||
            result['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              'never_ask_again'
          ) {
            setIsAllPermissionGranted(false);
            ToastAndroid.show(
              'Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue',
              ToastAndroid.LONG,
            );
            return false;
          }
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log({error});
    }
  };

  //   media filter logic start

  const handlePress = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const handleFilter = filterOption => {
    setFilter(filterOption);
    setFilterModalVisible(false);
    handleScrollToTop();
  };

  const handleScrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
    }
  };
  //   media filter logic end

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal:10
      }}>
      {/* filter btn */}
      <View
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          padding: 10,
          justifyContent: 'center',
          width: width,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={handlePress}>
          <Text style={{color: '#000'}}>Filter</Text>
          <MaterialCommunityIcons name={'filter'} size={24} color={'#000'} />
        </TouchableOpacity>
        <Modal visible={filterModalVisible} animationType="fade" transparent>
          <TouchableOpacity
            style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)'}}
            onPress={() => setFilterModalVisible(false)}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'grey',
                position: 'absolute',
                right: 20,
                top: 80,
                borderRadius: 10,
                overflow: 'hidden',
                borderWidth: 1,
                borderTopRightRadius: 0,
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  paddingHorizontal: 10,
                  paddingBottom: 10,
                }}>
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={() => handleFilter('IMG')}>
                  <Text style={{color: '#000'}}>Images</Text>
                </TouchableOpacity>
                <View
                  style={{backgroundColor: 'grey', height: 1, marginTop: 5}}
                />

                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={() => handleFilter('VIDEO')}>
                  <Text style={{color: '#000'}}>Videos</Text>
                </TouchableOpacity>
                <View
                  style={{backgroundColor: 'grey', height: 1, marginTop: 5}}
                />
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={() => handleFilter('ALL')}>
                  <Text style={{color: '#000'}}>All Media</Text>
                </TouchableOpacity>
                <View
                  style={{backgroundColor: 'grey', height: 1, marginTop: 5}}
                />
                {/* Add more filter options as needed */}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {!isAllPermissionGranted && (
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
                App Needs Storage Permission to load your whatsapp statuses
              </Text>
              <TouchableOpacity
                onPress={requestPermissions}
                style={styles.prmBtn}>
                <Text style={styles.prmBtnText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
          data={statuses.allStatuses}
          keyExtractor={item => item.name}
          renderItem={StatusView}
        />
      ) : (
        <Text>Status not available. </Text>
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
