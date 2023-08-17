import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import SendIntentAndroid from 'react-native-send-intent';

const PolicyScreen = ({navigation}) => {
  const [showBorder, setShowBorder] = useState(false);
  const scrollRef = useRef(null);

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
              // marginLeft:"20%"
              marginLeft: 5,
            }}>
            PRIVACY POLICY
          </Text>
        )}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.innerContainer}
        ref={scrollRef}
        onScroll={handleScroll}>
        <Text
          style={[
            styles.text,
            {
              fontSize: 17,
              fontWeight: '800',
              alignSelf: 'center',
              marginVertical: 14,
            },
          ]}>
          PRIVACY POLICY
        </Text>
        <Text style={styles.text}>
          Last updated: 15/08/2023{'\n\n'}Your privacy is important to us. It is
          our policy to respect your privacy regarding any information we may
          collect from you through our app, Status Downloader.{'\n\n'}We only
          ask for personal information when we truly need it to provide a
          service to you. We collect it by fair and lawful means, with your
          knowledge and consent. We also let you know why we're collecting it
          and how it will be used.
        </Text>

        <Text style={styles.title}>Information Collection and Use :</Text>
        <Text style={styles.text}>
          While using our App, we may ask you to provide us with certain
          personally identifiable information that can be used to contact or
          identify you. Personally identifiable information may include, but is
          not limited to your name ("Personal Information").
        </Text>
        <Text style={styles.title}>Data Retention and Security :</Text>
        <Text style={styles.text}>
          We only retain collected information for as long as necessary to
          provide you with your requested service. What data we store, we'll
          protect within commercially acceptable means to prevent loss and
          theft, as well as unauthorized access, disclosure, copying, use, or
          modification.
        </Text>
        <Text style={styles.title}>Information Sharing :</Text>
        <Text style={styles.text}>
          We don't share any personally identifying information publicly or with
          third-parties, except when required to by law.
        </Text>
        <Text style={styles.title}>External Links :</Text>
        <Text style={styles.text}>
          Our app may link to external sites that are not operated by us. Please
          be aware that we have no control over the content and practices of
          these sites, and cannot accept responsibility or liability for their
          respective privacy policies.
        </Text>
        <Text style={styles.title}>Refusal and Continued Use :</Text>
        <Text style={styles.text}>
          You are free to refuse our request for your personal information, with
          the understanding that we may be unable to provide you with some of
          your desired services.{'\n\n'}Your continued use of our app will be
          regarded as acceptance of our practices around privacy and personal
          information.
        </Text>
        <Text style={styles.title}>Contact Us :</Text>
        <Text style={[styles.text,{marginBottom:0}]}>
          If you have any questions about how we handle user data and personal
          information, feel free to contact us.
        </Text>
        <TouchableOpacity
          onPress={() => {
            SendIntentAndroid.sendMail(
              'baraterohit100@gamil.com',
              'Subject test',
              'Test body',
            );
          }}
          style={{marginBottom:10}}
          >
          <Text style={{color:"#000",fontWeight:"600",fontSize:16}}>Email Us</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          This policy is effective as of 15 August 2023.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PolicyScreen;

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
    // flex: 1,
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
  title: {
    color: '#000',
    fontSize: 17,
    marginBottom: 12,
    lineHeight: 20,
    fontWeight: '800',
  },
});
