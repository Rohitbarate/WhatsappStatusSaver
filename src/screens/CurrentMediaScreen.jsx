import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import Video from 'react-native-video';

const CurrentMediaScreen = ({
  isCrntStatusVisible,
  setIsCrntStatusVisible,
  status,
  setStatuses,
}) => {
  const {height, width} = Dimensions.get('window');
  // console.log({ mediaName:status.mediaName});

  const handleShareToWhatsapp = async url => {
    try {
      Share.isPackageInstalled('com.whatsapp')
        .then(response => {
          if (response.isInstalled) {
            ToastAndroid.show('Sharing with Whatsapp', ToastAndroid.SHORT);
            Share.shareSingle({
              url: url,
              social: Share.Social.WHATSAPP,
            }).catch(err => {
              err && console.log(err);
            });
          } else {
            ToastAndroid.show('error: Whatsapp not found', ToastAndroid.LONG);
          }
        })
        .catch(error => {
          console.log(error);
          // { error }
        });
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error.message);
    }
  };

  const handleShare = url => {
    console.log({url});

    try {
      Share.open({
        url: url,
        failOnCancel: false,
      }).catch(error => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      });
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
    }
  };

  BackHandler.addEventListener('hardwareBackPress', () => {
    // if(statuses.currentMedia.length !== 0){
    setStatuses(prevState => ({
      ...prevState,
      currentMedia: '',
      mediaName: '',
    }));
  });
  return (
    <Modal animationType="slide" transparent visible={isCrntStatusVisible}>
      {/* <TouchableOpacity
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)'}}
        onPress={() => setIsCrntStatusVisible(false)}> */}
      <View style={styles.centeredView}>
        <View
          style={[styles.modalView, {width: width - 20, height: height / 1.4}]}>
          <TouchableOpacity
            onPress={() => {
              setIsCrntStatusVisible(false);
              setStatuses(prevState => ({
                ...prevState,
                currentMedia: '',
                mediaName: '',
              }));
            }}
            style={[
              styles.button,
              {
                position: 'absolute',
                zIndex: 100,
                left: 10,
                height: 45,
                width: 45,
                top: 10,
                borderRadius: 45,
              },
            ]}>
            <Icon name="md-arrow-back-outline" size={35} color={'#fff'} />
          </TouchableOpacity>
          {status.mediaName.indexOf('.jpg' || '.jpeg' || '.png') !== -1 ? (
            <View style={styles.container}>
              <Image
                source={{uri: `file://${status.currentMedia}`}}
                style={{
                  height: 400,
                  width: width - 20,
                  resizeMode: 'contain',
                  backgroundColor: '#000',
                }}
              />
            </View>
          ) : (
            <View style={styles.container}>
              <Video
                source={{uri: `file://${status.currentMedia}`}}
                style={styles.video}
                controls={true}
                fullscreen={true}
                pictureInPicture={true}
                resizeMode="contain"
                repeat={true}
              />
            </View>
          )}
          <View style={styles.btnView}>
            <TouchableOpacity
              onPress={() => handleShare(`file://${status.currentMedia}`)}
              style={[
                styles.button,
                {height: 50, width: 50, borderRadius: 50, marginHorizontal: 10},
              ]}>
              <Icon name="ios-share-social-outline" size={30} color={'#fff'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsCrntStatusVisible(false)}
              style={[
                styles.button,
                {height: 65, width: 65, borderRadius: 65, marginHorizontal: 10},
              ]}>
              <Icon name="ios-arrow-down" size={40} color={'#fff'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleShareToWhatsapp(`file://${status.currentMedia}`)
              }
              style={[
                styles.button,
                {height: 50, width: 50, borderRadius: 50, marginHorizontal: 10},
              ]}>
              <Icon name="logo-whatsapp" size={30} color={'#fff'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* </TouchableOpacity> */}
    </Modal>
  );
};

export default CurrentMediaScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
    backfaceVisibility: 'visible',
  },
  modalView: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 0,
    zIndex: 0,
    flexDirection: 'column',
  },
  button: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'absolute',
    bottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#000',
  },
  video: {
    aspectRatio: 4 / 3,
    backgroundColor: '#000',
    alignSelf: 'center',
    width: '100%',
    height: 500,
    marginTop: 10,
    marginBottom: 10,
    zIndex: 100,
  },
});
