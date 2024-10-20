// index.tsx

import React, { useEffect, useContext, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import LoginPage from './login';
import Feed from './feed';
import { getRegistrationState, clearRegistrationState } from '@/helper/registrationStorage';
import { PostProvider } from '@/context/postContext';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthProvider, AuthContext } from '@/context/authContext';

const MainApp = () => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const router = useRouter();
  console.log("Username:", user);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const registrationState = await getRegistrationState();
        console.log('Estado de registro:', registrationState);

        if (registrationState && registrationState.currentStep) {
          const { currentStep, email, password, country, interests } = registrationState;

          // Redirigir al paso correspondiente del registro
          switch (currentStep) {
            case 'location':
              router.replace({
                pathname: './location',
                params: { email, password },
              });
              break;
            case 'interests':
              router.replace({
                pathname: './interests',
                params: { email, password, country },
              });
              break;
            case 'userRegisterData':
              router.replace({
                pathname: './userRegisterData',
                params: { email, password, country, interests },
              });
              break;
            default:
              // Si el paso no es reconocido, limpiar el estado de registro y redirigir al login
              await clearRegistrationState();
              router.push('./login');
              break;
          }
        }
      } catch (error) {
        console.error('Error al verificar el registro:', error);
      } finally {
        setIsCheckingRegistration(false);
      }
    };

    if (!isLoading) {
      checkRegistration();
    }
  }, [isLoading]);

  if (isLoading || isCheckingRegistration) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <PostProvider>
      {isAuthenticated ? <Feed /> : <LoginPage />}
    </PostProvider>
  );
};

export default function Index() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
