// index.tsx

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import LoginPage from './login';
import Feed from './feed'; 
import { getToken } from '../handlers/authTokenHandler'; 
import { getProfile } from '@/handlers/profileHandler';

import { PostProvider } from '@/context/postContext'; 
// Importar Toast
import Toast from 'react-native-toast-message';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        const profile_success = (await getProfile()).success;
        console.log('Token:', token);
        console.log('Profile success:', profile_success);
        if (token && profile_success) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (

    <PostProvider>
      {isAuthenticated ? <Feed /> : <LoginPage />}
      {/* Añadir Toast al final del árbol de componentes */}
      <Toast />
    </PostProvider>
  );
}
