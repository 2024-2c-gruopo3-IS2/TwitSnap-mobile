import { initializeApp } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence, 
  GoogleAuthProvider 
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyALzM0qnVTIw3gx5h6uv_P4fr4LB9bdl50",
  authDomain: "twitsnap-d3c22.firebaseapp.com",
  projectId: "twitsnap-d3c22",
  storageBucket: "twitsnap-d3c22.appspot.com",
  messagingSenderId: "856906798335",
  appId: "1:856906798335:android:9b6be3edd94e8d895be8ca",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const provider = new GoogleAuthProvider();

export { auth, provider };
