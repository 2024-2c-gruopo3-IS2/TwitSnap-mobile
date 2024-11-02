// app/index.tsx

import React, { useEffect, useContext, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import LoginPage from './login';
import { getRegistrationState, clearRegistrationState } from '@/helper/registrationStorage';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/authContext';
import MainTabs from './tabs';

const Index = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkRegistration = async () => {
      try {
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
            default:
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

  return isAuthenticated ? <MainTabs/> : <LoginPage />;
};

export default Index;
