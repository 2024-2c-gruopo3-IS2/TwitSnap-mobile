// firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyALzM0qnVTIw3gx5h6uv_P4fr4LB9bdl50",
  authDomain: "twitsnap-d3c22.firebaseapp.com",
  projectId: "twitsnap-d3c22",
  storageBucket: "twitsnap-d3c22.appspot.com",
  messagingSenderId: "856906798335",
  appId: "1:856906798335:android:9b6be3edd94e8d895be8ca",
  databaseURL: "https://twitsnap-d3c22-default-rtdb.firebaseio.com/",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getDatabase(app);

// Inicializa Storage
const storage = getStorage(app);

// Inicializa Firebase Auth con persistencia usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, storage, db };


