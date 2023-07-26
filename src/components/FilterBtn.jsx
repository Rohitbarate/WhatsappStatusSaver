import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterIcon from 'react-native-vector-icons/Entypo';
import FilterIcon2 from 'react-native-vector-icons/FontAwesome5';

const FilterBtn = props => {
  const {
    filterModalVisible,
    setFilterModalVisible,
    filter,
    setFilter,
    handleScrollToTop,
  } = props;
  const {height, width} = Dimensions.get('window');

  const handlePress = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const handleFilter = filterOption => {
    setFilter(filterOption);
    setFilterModalVisible(false);
    handleScrollToTop();
  };

  return (
    <View
      style={{
        display: 'flex',
        // alignItems: 'flex-end',
        justifyContent: 'center',
        // width: width,
      }}>
      <TouchableOpacity
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexDirection: 'row',
        }}
        onPress={handlePress}>
        <Text style={{color: '#000', fontWeight: '500'}}>{filter}</Text>
        <MaterialCommunityIcons
          name={'filter-outline'}
          size={24}
          color={'#000'}
        />
      </TouchableOpacity>

      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 5,
          }}
          onPress={() => setFilterModalVisible(false)}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'grey',
              //   position: 'absolute',
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
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => handleFilter('Images')}>
                <FilterIcon name={'images'} size={20} color={filter==='Images'?'green':'#000'} />
                <Text
                  style={[
                    styles.filterItemText,
                    {color: filter === 'Images' ? 'green' : '#000'},
                  ]}>
                  Images
                </Text>
              </TouchableOpacity>
              <View
                style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
              />

              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => handleFilter('Videos')}>
                <FilterIcon name={'folder-video'} size={20} color={filter==='Videos'?'green':'#000'} />
                <Text
                  style={[
                    styles.filterItemText,
                    {color: filter === 'Videos' ? 'green' : '#000'},
                  ]}>
                  Videos
                </Text>
              </TouchableOpacity>
              <View
                style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
              />
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => handleFilter('All Statuses')}>
                <FilterIcon2 name={'photo-video'} size={20} color={filter==='All Statuses'?'green':'#000'} />
                <Text
                  style={[
                    styles.filterItemText,
                    {color: filter === 'All Statuses' ? 'green' : '#000'},
                  ]}>
                  All Media
                </Text>
              </TouchableOpacity>
              <View
                style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
              />
              {/* Add more filter options as needed */}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default FilterBtn;

const styles = StyleSheet.create({
  filterItem: {
    paddingTop: 20,
    flexDirection:'row',
    alignItems:'center'
  },
  filterItemText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft:10
  },
});
