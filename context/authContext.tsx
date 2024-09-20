// // src/context/AuthContext.tsx
// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import { fetchUserProfile } from '@/handlers/profileHandler'; 
// import { getToken, removeToken, saveToken } from '@/handlers/authTokenHandler';
// import { useRouter } from 'expo-router';
// import { Alert } from 'react-native';

// interface Profile {
//   username: string;
//   email: string;
//   location: string;
//   bio: string;
//   profilePicture: string;
// }

// interface AuthContextProps {
//   isAuthenticated: boolean;
//   profile: Profile | null;
//   login: (token: string, expiration: number) => Promise<void>;
//   logout: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextProps>({
//   isAuthenticated: false,
//   profile: null,
//   login: async () => {},
//   logout: async () => {},
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const token = await getToken();
//       if (token) {
//         const result = await fetchUserProfile();
//         if (result.success && result.profile) {
//           setProfile(result.profile);
//           setIsAuthenticated(true);
//         } else {
//           Alert.alert('Error', result.message || 'Error al cargar el perfil.');
//           await handleLogout();
//         }
//       }
//     };

//     initializeAuth();
//   }, []);

//   const login = async (token: string, expiration: number) => {
//     try {
//       await saveToken(token, expiration);
//       const result = await fetchUserProfile();
//       if (result.success && result.profile) {
//         setProfile(result.profile);
//         setIsAuthenticated(true);
//         router.replace('/feed');
//       } else {
//         Alert.alert('Error', result.message || 'Error al cargar el perfil.');
//         await handleLogout();
//       }
//     } catch (error) {
//       console.error('Error durante el login:', error);
//       Alert.alert('Error', 'No se pudo completar el inicio de sesión.');
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await removeToken();
//       setIsAuthenticated(false);
//       setProfile(null);
//       router.replace('/login');
//     } catch (error) {
//       console.error('Error durante el logout:', error);
//       Alert.alert('Error', 'No se pudo cerrar la sesión.');
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, profile, login, logout: handleLogout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };