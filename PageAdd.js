import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;

const SelectorOption = ({ title, currentValue, setValue }) => (
  <TouchableOpacity
    style={[styles.selectorOption, currentValue === title && styles.selectedOption]}
    onPress={() => setValue(title)}
  >
    <Text style={styles.optionText}>{title}</Text>
  </TouchableOpacity>
);

const NewSpots = () => {
  const [sport, setSport] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('Gratuit');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Intérieur');
  const [rating, setRating] = useState(1);
  const [image, setImage] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const navigation = useNavigation();

  const handleAdd = useCallback(() => {
    // Code to save new spot data
    navigation.navigate('Home');
  }, [navigation]);

  const navigateToMap = useCallback(() => {
    navigation.navigate('MapPage', {
      onLocationSelect: (selectedAddress) => setAddress(selectedAddress)
    });
  }, [navigation, setAddress]);

  const selectImage = useCallback(() => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    const handleSearch = async (text) => {
      setSearchText(text);

      try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json`, {
          params: {
            access_token: 'pk.eyJ1IjoiZnJhbmt5YmFieSIsImEiOiJjbGluanJ2dTMwaW0zM2VwbmhmOGY3MnZmIn0.T46gf4BvWkV7zaCp479kNw',
            limit: 10
          }
        });

        if (response.data.features) {
          setSearchResults(response.data.features);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleSelectAddress = (place) => {
      const position = {
        latitude: place.center[1],
        longitude: place.center[0],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setAddress(place.place_name);
      setSearchResults([]); // clear the search results
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setImage(source);
      }
    });
  }, [setImage]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Spots</Text>

      <Text style={styles.sectionTitle}>Nom du sport</Text>
      <TextInput style={styles.input} placeholder="Nom du sport" value={sport} onChangeText={setSport} />

      <Text style={styles.sectionTitle}>Adresse</Text>
      <TextInput style={styles.input} placeholder="Adresse" value={address} onChangeText={setAddress} />
      <Button title="Choisir sur la carte" onPress={navigateToMap} />

      <Text style={styles.sectionTitle}>Prix</Text>
      <View style={styles.selectorContainer}>
        <SelectorOption title="Gratuit" currentValue={price} setValue={setPrice} />
        <SelectorOption title="Payant" currentValue={price} setValue={setPrice} />
      </View>
      {price === 'Payant' && (
        <TextInput
          style={styles.input}
          placeholder="Numéro de téléphone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
        />
      )}

      <Text style={styles.sectionTitle}>Emplacement</Text>
      <View style={styles.selectorContainer}>
        <SelectorOption title="Intérieur" currentValue={location} setValue={setLocation} />
        <SelectorOption title="Extérieur" currentValue={location} setValue={setLocation} />
      </View>

      <Text style={styles.sectionTitle}>État du terrain</Text>
      <View style={styles.selectorContainer}>
        {[1, 2, 3, 4, 5].map(value => (
          <SelectorOption key={value} title={value} currentValue={rating} setValue={setRating} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Image</Text>
      <Button title="Sélectionner une image" onPress={selectImage} />
      {image && <Image source={image} style={styles.image} />}

      <TouchableOpacity
        style={styles.boutonAjouterConteneur}
        onPress={handleAdd}
      >
        <Text style={styles.texteBoutonAjouter}>Ajouter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  boutonAjouterConteneur: {
    backgroundColor: 'blue',
    paddingVertical: 10 * aspectRatio,
    borderRadius: 8 * aspectRatio,
    alignItems: 'center',
    marginBottom: 16 * aspectRatio,
  },
  texteBoutonAjouter: {
    color: '#fff',
    fontSize: 14 * aspectRatio,
    fontWeight: 'bold',
  },
  container: {
    padding: 16 * aspectRatio,
    backgroundColor: '#FFF',
    minHeight: height,
  },
  title: {
    fontSize: 18 * aspectRatio,
    fontWeight: 'bold',
    marginBottom: 30 * aspectRatio,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14 * aspectRatio,
    fontWeight: 'bold',
    marginBottom: 8 * aspectRatio,
  },
  input: {
    height: 30 * aspectRatio,
    fontSize: 12 * aspectRatio,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8 * aspectRatio,
    paddingHorizontal: 10 * aspectRatio,
    marginBottom: 6 * aspectRatio,
  },
  selectorContainer: {
    flexDirection: 'row',
    marginBottom: 8 * aspectRatio,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8 * aspectRatio,
    overflow: 'hidden',
  },
  selectorOption: {
    flex: 1,
    paddingVertical: 8 * aspectRatio,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    backgroundColor: '#DDDDDD',
  },
  optionText: {
    fontSize: 14 * aspectRatio,
    fontWeight: 'bold',
  },
  image: {
    width: 80 * aspectRatio, // Or the size you want
    height: 80 * aspectRatio, // Or the size you want
    marginBottom: 12 * aspectRatio,
  },
});

export default NewSpots;
