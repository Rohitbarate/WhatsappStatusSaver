import {StyleSheet, Text, View, Dimensions, BackHandler} from 'react-native';
import React from 'react';
import Video from 'react-native-video';

const SelectedStatus = ({route, navigation}) => {
  const {uri, setStatuses} = route.params;

  BackHandler.addEventListener('hardwareBackPress', () => {
    setStatuses((prevState)=>({...prevState,currentMedia:''}))
  });

  return (
    <View style={styles.container}>
      <Video
        source={{uri: `file://${uri}`}}
        style={styles.video}
        controls={true}
        fullscreen={true}
        pictureInPicture={true}
        // posterResizeMode="cover"
        resizeMode="contain"
      />
    </View>
  );
};

export default SelectedStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    // aspectRatio:
    //   Dimensions.get('window').width / Dimensions.get('window').height,
    backgroundColor: '#000',
    width: Dimensions.get('window').width,
    height: 500,
  },
});
