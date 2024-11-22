import React, { useEffect, useContext, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getRegistrationState, clearRegistrationState } from '@/helper/registrationStorage';
import { AuthContext } from '@/context/authContext';
import MainTabs from './tabs';
import LoginPage from './login';

const Index = () => {
  const { isAuthenticated, isLoading, registrationState } = useContext(AuthContext);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        // Verificar si hay un estado de registro activo
        const registrationState = await getRegistrationState();

        if (registrationState && registrationState.currentStep) {
          const { currentStep, email, password, country, interests } = registrationState;

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
            case 'confirmPin':
              router.replace({
                pathname: './confirmPin',
                params: { email, password, country, interests },
              });
              break;
            default:
              await clearRegistrationState();
              router.push('./login');
              break;
          }
        } else if (!isAuthenticated) {
          // Si no está autenticado y no hay registro, redirige al login
          router.replace('./login');
        } else {
          // Si está autenticado y no hay registro en progreso, redirige al feed
          router.replace('/tabs');
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
  }, [isLoading, isAuthenticated, registrationState]);

  if (isLoading || isCheckingRegistration) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return isAuthenticated ? <MainTabs /> : <LoginPage />;
};

export default Index;
