import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import AddFarmerScreen from '../screens/Farmer/AddFarmerScreen';
import FarmerListScreen from '../screens/Farmer/FarmerListScreen';
import AddCattleScreen from '../screens/Cattle/AddCattleScreen';
import CattleListScreen from '../screens/Cattle/CattleListScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="AddFarmer" component={AddFarmerScreen} />
        <Stack.Screen name="FarmerList" component={FarmerListScreen} />
        <Stack.Screen name="AddCattle" component={AddCattleScreen} />
        <Stack.Screen name="CattleList" component={CattleListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
