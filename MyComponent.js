import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const MyComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [location, setLocation] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [region, setRegion] = useState(route.params?.selectedPosition || null);
  const emojis = ['🎾', '⚽️', '🏀', '🏈','+'];

  const handleEmojiSelect = (emoji) => {
    if(emoji === '+') {
      navigation.navigate('SearchScreen');
    } else {
      setSelectedEmoji(emoji);
    }
  };

  const handleCogPress = () => {
    navigation.navigate('BlankPage');
  };

  useEffect(() => {
    if (!region) {
      if (route.params?.selectedPosition) {
        setRegion(route.params.selectedPosition);
      } else {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
          }

          let currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
          setRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        })();
      }
    }
  }, []);



  const handleRegionChange = (region) => {
    setRegion(region);
    setShowButton(true);
  };

  const handleBackToUserLocation = () => {
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setShowButton(false);
  };

  return (
    <View style={{ flex: 1 }}>
        {location ? (
    <MapView
      style={{ flex: 1 }}
      region={region}
      onRegionChangeComplete={handleRegionChange}
    >
      <Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }}
      >
        <View
          style={{
            height: hp('2.5%'),
            width: wp('5%'),
            borderRadius: wp('2.5%'),
            backgroundColor: 'blue',
            borderColor: 'white',
            borderWidth: wp('0.75%'),
          }}
        />
      </Marker>
    </MapView>
  ) : null}

  {showButton && (
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: hp('15%'),
        right: wp('40%'),
        backgroundColor: '#FFF',
        padding: wp('3.75%'),
        borderRadius: wp('10%'),
        zIndex: 2,
      }}
      onPress={handleBackToUserLocation}
    >
      <Text>Back</Text>
    </TouchableOpacity>
  )}


  <TouchableOpacity
    style={{
      position: 'absolute',
      top: hp('7.5%'),
      left: wp('5%'),
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      width: wp('10%'),
      height: hp('5%'),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: wp('6.25%'),
    }}
    onPress={() => navigation.navigate('BlankPage')}
  >
    <Icon name="person" size={wp('5%')} color="white" />
  </TouchableOpacity>


  <TouchableOpacity
    style={{
      position: 'absolute',
      top: hp('7.5%'),
      alignSelf: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      width: wp('37.5%'),
      height: hp('5%'),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: wp('5%'),
      borderWidth: wp('0.5%'),
      borderColor: 'white'
    }}
    onPress={() => navigation.navigate('SearchByRectangleScreen')}
  >
    <Text style={{
      color: 'white',
      fontSize: wp('4.25%'),
      fontWeight: '900',
      textAlign: 'center'
    }}>
      Nantes
    </Text>
  </TouchableOpacity>


  <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
    <View style={{ position: 'absolute', top: hp('-93%'), backgroundColor: 'rgba(0, 0, 0, 0.2)', width: wp('11.25%'), height: hp('5.625%'), justifyContent: 'center', alignItems: 'center', borderRadius: wp('25%'), right: wp('5%') }}>
      <FAIcon name="cog" size={wp('6.25%')} color="white" />
    </View>
  </TouchableOpacity>



  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', position: 'absolute', bottom: hp('2.5%'), width: '100%', paddingBottom: hp('3.75%'),}}>

  <TouchableOpacity onPress={() => navigation.navigate('PageSports')}>
      <View style={{ alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', width: wp('11.25%'), height: hp('10%'), borderRadius: wp('7.5%'), left: wp('86%'), justifyContent: 'center', alignItems: 'center', top: hp('-30%'), opacity: 1 }}>
              <Text style={{ fontSize: wp('6,5%'), fontWeight: '900', top: hp('-0.875%') }}>{selectedEmoji}</Text>
              <Icon name="filter" size={wp('5%')} color="#000" />
          </View>
      </View>
  </TouchableOpacity>


  <TouchableOpacity onPress={() => navigation.navigate('PageAdd')}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      </View>
      <View style={{ borderWidth: 0, backgroundColor: 'white', width: wp('95%'), height: hp('10%'), borderRadius: wp('7.5%'), borderBottomRightRadius: wp('7.5%'), borderBottomLeftRadius: wp('7.5%'), borderTopLeftRadius: wp('7.5%'), right: wp('4%'), justifyContent: 'center', alignItems: 'center', top: hp('12.5%'), opacity: 0.95 }}>
        <Text style={{ fontSize: wp('5.5%'), fontWeight: '900', color: 'white', alignItems: 'center', justifyContent: 'center', color: 'black'}}>Ajouter un spot</Text>
      </View>
    <View style={{ width: wp('50%'), height: hp('8.75%'), alignItems: 'center', justifyContent: 'center', top: hp('3.75%'), paddingLeft: wp('5%') }}>
    </View>
  </TouchableOpacity>

  </View>




<View style={{
    position: 'absolute',right: wp('5%'),top: hp('16%'),width: wp('11%'),height: hp('28%'),borderRadius: wp('7.5%'),backgroundColor: 'rgba(10, 10, 0, 0.2)',justifyContent: 'center',alignItems: 'center'}}>
      {emojis.map((emoji, index) => (
        <TouchableOpacity
          key={index}
          style={{
            height: hp('5.625%'),
            width: wp('11.25%'),
            marginBottom: 0,
            marginLeft: wp('2.5%'),
            marginRight: wp('2.5%'),
            backgroundColor: selectedEmoji === emoji ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
            borderRadius: wp('100%'),
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => handleEmojiSelect(emoji)}
        >
          <Text style={{ fontSize: wp('6%') }}>{emoji}</Text>
        </TouchableOpacity>
      ))}
  </View>

    </View>
  );
};

export default MyComponent;
