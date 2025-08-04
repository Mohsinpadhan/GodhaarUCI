import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export default function AddFarmerScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [district, setDistrict] = useState('');
  const [mandal, setMandal] = useState('');
  const [village, setVillage] = useState('');

  const handleAddFarmer = async () => {
    if (!fullName || !mobile || !aadhaar || !district || !mandal || !village) {
      Alert.alert('All fields are required.');
      return;
    }

    if (aadhaar.length !== 12 || mobile.length !== 10) {
      Alert.alert('Enter valid Aadhaar (12 digits) and Mobile (10 digits).');
      return;
    }

    try {
      const userId = auth().currentUser.uid;
      await firestore().collection('farmers').add({
        fullName,
        mobile,
        aadhaar,
        district,
        mandal,
        village,
        userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Farmer added successfully!');
      navigation.navigate('FarmerList');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Farmer</Text>
      <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Mobile Number" value={mobile} onChangeText={setMobile} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Aadhaar Number" value={aadhaar} onChangeText={setAadhaar} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="District" value={district} onChangeText={setDistrict} />
      <TextInput style={styles.input} placeholder="Mandal" value={mandal} onChangeText={setMandal} />
      <TextInput style={styles.input} placeholder="Village" value={village} onChangeText={setVillage} />
      <Button title="Save Farmer" onPress={handleAddFarmer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10
  }
});
