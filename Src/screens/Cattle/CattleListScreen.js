import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function CattleListScreen({ route, navigation }) {
  const { farmerId, farmerName } = route.params;
  const [cattleList, setCattleList] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('cattle')
      .where('farmerId', '==', farmerId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCattleList(list);
      });
    return () => unsubscribe();
  }, [farmerId]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.sideImageUrl }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.text}><Text style={styles.label}>Breed:</Text> {item.breed}</Text>
        <Text style={styles.text}><Text style={styles.label}>Tag No:</Text> {item.tagNumber}</Text>
        <Text style={styles.text}><Text style={styles.label}>Age:</Text> {item.age}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cattle of {farmerName}</Text>
      <FlatList
        data={cattleList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddCattle', { farmerId })}>
        <Text style={styles.addButtonText}>+ Add Cattle</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center'
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10
  },
  details: {
    flex: 1
  },
  text: {
    fontSize: 14,
    marginBottom: 4
  },
  label: {
    fontWeight: 'bold'
  },
  addButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center'
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
