// app/index.tsx

import React, { useEffect, useContext, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import LoginPage from './login';
import Feed from './feed';
import { getRegistrationState, clearRegistrationState } from '@/helper/registrationStorage';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/authContext';

const MainApp = () => {
  console.log("[MainApp] Render started"); // Log inicial
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const router = useRouter();

  console.log("[INDEX] Username:", user);
  console.log("[MainApp] isAuthenticated:", isAuthenticated);
  console.log("[MainApp] isLoading:", isLoading);
  console.log("[MainApp] isCheckingRegistration:", isCheckingRegistration);

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
        console.log("[MainApp] setIsCheckingRegistration(false)");
      }
    };

    if (!isLoading) {
      checkRegistration();
    }
  }, [isLoading]);

  if (isLoading || isCheckingRegistration) {
    console.log("[MainApp] Showing ActivityIndicator");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  console.log("[MainApp] Rendering Feed or LoginPage");

  return (
    <>
      {isAuthenticated ? <Feed /> : <LoginPage />}
    </>
  );
};

export default function Index() {
  console.log("[Index] Rendering MainApp");
  return (
    <MainApp />
  );
}
