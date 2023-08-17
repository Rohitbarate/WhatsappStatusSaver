import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect,useState,useRef} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const LicenseScreen = ({navigation}) => {
    const [showBorder,setShowBorder] = useState(false)
    const scrollRef = useRef(null)

    const handleScroll = event => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowBorder(offsetY > 28);
      };

  useEffect(() => {
    function backAction() {
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
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
     <View style={[styles.header, {borderBottomWidth: showBorder ? 1 : 0}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            alignSelf: 'flex-start',
          }}>
          <Icon name="arrow-back-outline" size={26} color={'#323232'} />
        </TouchableOpacity>
        {showBorder && (
          <Text
            style={{
              color: '#000',
              fontSize: 17,
              fontWeight: '800',
              alignSelf: 'center',
              marginLeft:5,
              textAlign:"center"
            }}>
            OPEN SOURCE SOFTWARE NOTICE
          </Text>
        )}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.innerContainer}
        ref={scrollRef}
        onScroll={handleScroll}
        >
        <Text
          style={[
            styles.text,
            {
              fontSize: 17,
              fontWeight: '700',
              alignSelf: 'center',
              marginVertical: 14,
            },
          ]}>
          OPEN SOURCE SOFTWARE NOTICE
        </Text>
        <Text style={[styles.text, {}]}>
          This document contains licenses and notices for open source software
          used in this product.
        </Text>
        <Text
          style={[
            styles.text,
            {
              fontWeight: '500',
              marginBottom: 2,
            },
          ]}>
          Warranty Disclaimer
        </Text>
        <Text style={[styles.text, {}]}>
          The open source software in this application is offered without any
          warranty, including but not limited to the general usability or
          fitness for a particular purpose.
        </Text>
        {/* <Text
          style={[
            styles.text,
            {
              fontWeight: '500',
              marginBottom: 2,
            },
          ]}>
          Components:
        </Text>
        <Text
          style={[
            styles.text,
            {
              fontWeight: '500',
              marginBottom: 2,
            },
          ]}>
          Licenses:
        </Text> */}
        <Text style={[styles.text, {}]}>
          Please note that this document is provided for informational purposes
          and does not constitute legal advice.{'\n\n'}It is your responsibility to
          ensure proper compliance with the terms of the open-source licenses
          for the components used in your app. If you have any legal concerns or
          questions, consider consulting with legal professionals.
        </Text>
        <Text style={[styles.text, {fontSize:15}]}>
          THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR
          IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
          WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
          DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
          INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
          (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
          SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
          HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
          STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
          IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
          POSSIBILITY OF SUCH DAMAGE.
        </Text>
        <Text style={[styles.text, {}]}>
          Copyright (c) ,{'\n'}All rights reserved.{'\n\n'}Redistribution and use in source
          and binary forms, with or without modification, are permitted provided
          that the following conditions are met:{'\n\n'}* Redistributions of source
          code must retain the above copyright notice, this list of conditions
          and the following disclaimer.{'\n\n'}* Redistributions in binary form must
          reproduce the above copyright notice, this list of conditions and the
          following disclaimer in the documentation and/or other materials
          provided with the distribution.{'\n\n'}* Neither the name of the nor the
          names of its contributors may be used to endorse or promote products
          derived from this software without specific prior written permission.
        </Text>
        <Text style={[styles.text, {fontSize:15}]}>
          THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
          "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
          LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
          A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
          OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
          SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
          LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
          DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
          THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
          (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
          OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        </Text>
        <Text style={[styles.text, {}]}>=={'\n\n'}
          JSON License{'\n'}(JSON-java 20230817){'\n\n'}The JSON License{'\n'} ================{'\n\n'}
          Copyright (c) 2023 theperfectcode.org{'\n\n'}Permission is hereby granted, free of
          charge, to any person obtaining a copy of this software and associated
          documentation files (the "Software"), to deal in the Software without
          restriction, including without limitation the rights to use, copy,
          modify, merge, publish, distribute, sublicense, and/or sell copies of
          the Software, and to permit persons to whom the Software is furnished
          to do so, subject to the following conditions:{'\n\n'}The above copyright
          notice and this permission notice shall be included in all copies or
          substantial portions of the Software.{'\n\n'}The Software shall be used for
          Good, not Evil.
        </Text>
       
      </ScrollView>
    </View>
  );
};

export default LicenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#e2e2e2',
  },
  header: {
    paddingVertical: 10,
    borderBottomColor: '#323232',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  innerContainer: {
    backgroundColor: '#e2e2e2',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    flexGrow: 1,
  },
  text: {
    color: '#000',
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 18,
  },
});

// App Information: App Name: whats-Insta
//           Status Saver Owner: Rohit Rajendra Barate Technology Used: React
//           Native, Java, Node.js Permissions: Storage
