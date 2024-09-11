// index.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginPage from "../components/LoginPage";
import SignUpPage from "@/components/SignUpPage";

export default function IndexScreen() {
  const [isLoginPage, setIsLoginPage] = useState(true); // Estado para controlar la página mostrada

  // Función para alternar entre páginas
  const togglePage = () => {
    setIsLoginPage(!isLoginPage);
  };

  return (
    <View style={styles.container}>
      {isLoginPage ? (
        <LoginPage togglePage={togglePage} /> // Pasar función de alternancia como prop
      ) : (
        <SignUpPage togglePage={togglePage} /> // Pasar función de alternancia como prop
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
