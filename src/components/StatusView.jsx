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

const StatusView = ({item, setIsCrntStatusVisible, setStatuses,navigation}) => {
  // console.log({item});
  const {height, width} = Dimensions.get('window');
  return (
    <TouchableOpacity
      onPress={() => {
        setStatuses(prevState => ({
          ...prevState,
          currentMedia: item.path,
          mediaName:item.name
        }));
        setIsCrntStatusVisible(true);
      
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
        {/* <Text style={{color:'#000'}}>{item.name}</Text> */}
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
