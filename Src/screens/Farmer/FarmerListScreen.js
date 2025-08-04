import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export default function FarmerListScreen({ navigation }) {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    const userId = auth().currentUser.uid;
    const unsubscribe = firestore()
      .collection('farmers')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFarmers(list);
      });
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CattleList', { farmerId: item.id, farmerName: item.fullName })}
    >
      <Text style={styles.name}>{item.fullName}</Text>
      <Text style={styles.detail}>Village: {item.village}</Text>
      <Text style={styles.detail}>Mobile: {item.mobile}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Farmers</Text>
      <FlatList
        data={farmers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddFarmer')}>
        <Text style={styles.addButtonText}>+ Add Farmer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  card: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 8
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  detail: {
    fontSize: 14,
    color: '#555'
  },
  addButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center'
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
