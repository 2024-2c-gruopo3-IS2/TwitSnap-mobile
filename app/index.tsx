import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import LoginPage from './login';
import Feed from './feed';
import { getToken } from '../handlers/authTokenHandler';
import { getProfile } from '@/handlers/profileHandler';
import { getRegistrationState, clearRegistrationState } from '@/helper/registrationStorage';
import { PostProvider } from '@/context/postContext';
import { useRouter } from 'expo-router';
// Importar Toast
import Toast from 'react-native-toast-message';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRegistration = async () => {
      try {
        const token = await getToken();
        const profileResponse = await getProfile();
        const profile_success = profileResponse?.success || false;

        console.log('Token:', token);
        console.log('Profile success:', profile_success);

        if (token && profile_success) {
          // Si el token es válido y el perfil es exitoso, autenticamos al usuario
          setIsAuthenticated(true);
        } else {
          // Verificar si hay un registro en progreso
          const registrationState = await getRegistrationState();
          console.log('Registration state:', registrationState);

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
                // Si el paso no es reconocido o no es válido, limpiar el registro y redirigir al login
                await clearRegistrationState();
                router.push('./login');
                break;
            }
          } else {
            // Si no hay registro en progreso, redirigir directamente al login
            console.log('No hay registro en progreso, redirigiendo al login');
            router.replace('./login');
          }
        }
      } catch (error) {
        console.error('Error al verificar la autenticación o el registro:', error);
        router.replace('./login'); // Si hay un error, ir al login
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndRegistration();
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
    </PostProvider>
  );
}
