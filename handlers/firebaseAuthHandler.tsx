// firebaseAuthHandler.js
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDU74BqnGL0UAsq3J99mDH7_TxXPQ9CIMc",
  authDomain: "twitsnap-d3c22.firebaseapp.com",
  projectId: "twitsnap-d3c22",
  storageBucket: "twitsnap-d3c22.appspot.com",
  messagingSenderId: "856906798335",
  appId: "1:856906798335:android:9b6be3edd94e8d895be8ca",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function firebaseLogin(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken(); // Obtiene el token del usuario

    return { success: true, token }; // Devuelve el token
  } catch (error) {
    console.error('Error al iniciar sesión en Firebase:', error);
    return { success: false, message: (error as Error).message || 'Unknown error occurred' }; // Manejo de errores
  }
}


// Función para iniciar sesión con Google usando Popup
export async function googleLoginWithPopup() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken(); // Obtiene el token del usuario

    return { success: true, token }; // Devuelve el token
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    return { success: false, message: (error as Error).message || 'Unknown error occurred' }; // Manejo de errores
  }
}


export async function googleSignUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken(); // Obtiene el token del usuario

    return { success: true, token }; // Devuelve el token
  } catch (error) {
    console.error('Error al registrar en Firebase:', error);
    return { success: false, message: (error as Error).message || 'Unknown error occurred' }; // Manejo de errores
  }
}
