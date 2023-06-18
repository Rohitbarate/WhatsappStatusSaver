import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

const StatusView = ({
  item,
  setIsCrntStatusVisible,
  setStatuses,
  navigation,
  statuses,
}) => {
  // console.log({item});
  const {height, width} = Dimensions.get('window');
  return (
    <TouchableOpacity
      onPress={() => {
        setStatuses(prevState => ({
          ...prevState,
          currentMedia: item.path,
          mediaName: item.name,
        }));
        setIsCrntStatusVisible(true);
        navigation.push('SelectedStatusScreen', {
          uri: item.path,
          statusName: item.name,
        });
      }}>
      <View style={[styles.outerView, {width: width / 2.3}]}>
        <Image
          style={{
            width: width / 2.3,
            height: 250,
            resizeMode: 'cover',
            aspectRatio: 1,
          }}
          source={{uri: `file://${item.path}`}}
        />
        {item.name.indexOf('.jpg' || '.jpeg' || '.png') === -1 && (
          <View style={{position:'absolute',alignSelf:'center',backgroundColor:'#fff',borderRadius:50}}>
            <Icon name="play" color="#131313c7" size={50} />
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
