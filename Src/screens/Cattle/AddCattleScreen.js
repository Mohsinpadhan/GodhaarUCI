import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'react-native-image-picker';

export default function AddCattleScreen({ route, navigation }) {
  const { farmerId } = route.params;

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [type, setType] = useState('');
  const [sideImage, setSideImage] = useState(null);
  const [muzzleImage, setMuzzleImage] = useState(null);

  const pickImage = async (type) => {
    ImagePicker.launchCamera({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel || response.errorCode) return;
      if (type === 'side') setSideImage(response.assets[0]);
      if (type === 'muzzle') setMuzzleImage(response.assets[0]);
    });
  };

  const uploadImage = async (image) => {
    const filename = image.fileName || `${Date.now()}.jpg`;
    const ref = storage().ref(`cattleImages/${filename}`);
    await ref.putFile(image.uri);
    return await ref.getDownloadURL();
  };

  const handleSave = async () => {
    if (!age || !gender || !breed || !weight || !tagNumber || !type || !sideImage || !muzzleImage) {
      Alert.alert('Please fill all fields and upload images.');
      return;
    }

    try {
      const sideImageUrl = await uploadImage(sideImage);
      const muzzleImageUrl = await uploadImage(muzzleImage);

      await firestore().collection('cattle').add({
        farmerId,
        age,
        gender,
        breed,
        weight,
        tagNumber,
        type,
        sideImageUrl,
        muzzleImageUrl,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Cattle added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Cattle</Text>
      <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Gender (Male/Female)" value={gender} onChangeText={setGender} />
      <TextInput style={styles.input} placeholder="Breed" value={breed} onChangeText={setBreed} />
      <TextInput style={styles.input} placeholder="Weight (KG)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Tag Number" value={tagNumber} onChangeText={setTagNumber} />
      <TextInput style={styles.input} placeholder="Cattle Type" value={type} onChangeText={setType} />

      <Button title="Capture Side View" onPress={() => pickImage('side')} />
      {sideImage && <Image source={{ uri: sideImage.uri }} style={styles.image} />}

      <Button title="Capture Muzzle View" onPress={() => pickImage('muzzle')} />
      {muzzleImage && <Image source={{ uri: muzzleImage.uri }} style={styles.image} />}

      <Button title="Save Cattle" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8
  }
});
