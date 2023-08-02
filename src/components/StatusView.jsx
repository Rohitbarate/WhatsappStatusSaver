import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ScopedStorage from 'react-native-scoped-storage';
import RNFS from 'react-native-fs';
import {AppContext} from '../context/appContext';

const StatusView = ({
  item,
  setIsCrntStatusVisible,
  setStatuses,
  navigation,
  statuses,
  getStatuses,
}) => {
  const {height, width} = Dimensions.get('window');
  const {getSavedStatuses} = useContext(AppContext);

  const WhatsAppStatusDirectory = `/storage/emulated/0/Android/media/com.whatsapp/Whatsapp/Media/.Statuses/`;

  const WhatsAppSavedStatusDirectory = `${RNFS.DCIMDirectoryPath}/wi_status_saver/`;

  // console.log({item});

  const status = {
    fileName: item.name || item.filename,
    filePath: item.path ? `file://${item.path}` : item.uri,
  };
  // console.log({filename:status.fileName});

  const deleteStatus = async () => {
    if (!item.path) {
      ToastAndroid.show(
        'You can not delete unsaved statuses',
        ToastAndroid.SHORT,
      );
    } else {
      Alert.alert(
        '',
        'Delete status?',
        [
          {
            text: 'cancel',
          },
          {
            text: 'delete',
            onPress: async () => {
              const isExist = await RNFS.exists(
                WhatsAppSavedStatusDirectory + status.fileName,
              );
              if (!isExist) {
                ToastAndroid.show('Status not available', ToastAndroid.SHORT);
                return
              }
              await RNFS.unlink(WhatsAppSavedStatusDirectory + item.name)
                .then(() => {
                  getSavedStatuses();
                  console.log('FILE DELETED');
                  ToastAndroid.show('Status deleted', ToastAndroid.SHORT);
                })
                .catch(err => {
                  console.log(err.message);
                  ToastAndroid.show(err.message, ToastAndroid.SHORT);
                });
            },
          },
        ],
        {
          cancelable: true,
        },
      );
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        setStatuses(prevState => ({
          ...prevState,
          currentMedia: item.uri || item.path,
          mediaName: item.name,
        }));
        setIsCrntStatusVisible(true);
        navigation.navigate('SelectedStatusScreen', {
          uri: status.filePath,
          statusName: status.fileName,
          mime: item.mime,
          // getStatuses:getStatuses
        });
      }}
      onLongPress={async () => {
        deleteStatus();
      }}>
      <View style={[styles.outerView, {width: width / 2.3}]}>
        <Image
          style={{
            width: width / 2.3,
            height: 250,
            resizeMode: 'cover',
            aspectRatio: 1,
          }}
          source={{uri: status.filePath}}
        />
        {status.fileName.indexOf('.mp4') >= 0 && (
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              backgroundColor: '#212121',
              borderRadius: 55,
              opacity: 0.8,
            }}>
            <Icon
              style={{
                backfaceVisibility: 'visible',
                opacity: 1,
                paddingLeft: 6,
              }}
              name="play-sharp"
              color="#fff"
              size={45}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default StatusView;

const styles = StyleSheet.create({
  outerView: {
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 10,
    // padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: 10,
  },
});
