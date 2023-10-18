import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// fetch all games from async storage
const fetchHistory = async() => {
  let currentList = await AsyncStorage.getItem('totalList');
  // Convert the retrieved value to an integer (default to 0 if it doesn't exist)
  currentList = currentList ? JSON.parse(currentList) : [];
  return {
    totalList: currentList,
  };
};

export default fetchHistory;