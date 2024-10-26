// context/authContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getToken, removeToken, saveToken } from '../handlers/authTokenHandler';
import { loginUser } from '../handlers/loginHandler';
import { registerUser } from '../handlers/signUpHandler';
import { getProfile } from '../handlers/profileHandler';
import { saveRegistrationState, getRegistrationState, clearRegistrationState } from '../helper/registrationStorage';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  surname: string;
  username: string;
  description: string;
  country: string;
  interests: string[];
  birthdate: string;
}

interface RegistrationState {
  email: string;
  password: string;
  currentStep: string;
  [key: string]: any; // Para pasos adicionales
}

interface AuthContextProps {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
  registrationState: RegistrationState | null;
  updateRegistrationState: (newState: Partial<RegistrationState>) => Promise<void>;
  clearRegistration: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
  registrationState: null,
  updateRegistrationState: async () => {},
  clearRegistration: () => {},
    refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationState, setRegistrationState] = useState<RegistrationState | null>(null);

  // Función de login existente
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loginResponse = await loginUser(email, password);
      if (loginResponse.success && loginResponse.token) {
        const profileResponse = await getProfile();
        if (profileResponse.success && profileResponse.profile) {
          saveToken(loginResponse.token);
          setUser(profileResponse.profile);
          setIsAuthenticated(true);
          console.log("[AuthProvider] User logged in:", profileResponse.profile.username);
        } else {
          console.error('Error al obtener el perfil después de iniciar sesión.');
          throw new Error('Error al obtener el perfil.');
        }
      } else {
        console.error('Error en el inicio de sesión:', loginResponse.message);
        throw new Error(loginResponse.message || 'Error al iniciar sesión.');
      }


    } catch (error) {
      console.log('Error durante el login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Nueva función de signup
  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await registerUser(email, password);
      if (response.success) {
        const initialRegistrationState: RegistrationState = {
          email,
          password,
          currentStep: 'location', // Paso siguiente
        };
        await saveRegistrationState(initialRegistrationState);
        setRegistrationState(initialRegistrationState);
        console.log("[AuthProvider] Registro inicial guardado.");
      } else {
        if (response.message === 'Email already in use') {
          throw new Error('El correo electrónico ya está en uso.');
        } else {
          throw new Error('Error al registrar el usuario.');
        }
      }
    } catch (error) {
        console.log("Error durante el registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    clearRegistrationState();
    setRegistrationState(null);
    console.log("[AuthProvider] User logged out");
  };

  const updateRegistrationStateFunc = async (newState: Partial<RegistrationState>) => {
    if (registrationState) {
      const updatedState = { ...registrationState, ...newState };
      await saveRegistrationState(updatedState);
      setRegistrationState(updatedState);
      console.log("[AuthProvider] Registro actualizado:", updatedState);
    }
  };

  const clearRegistration = async () => {
    await clearRegistrationState();
    setRegistrationState(null);
    console.log("[AuthProvider] Registro limpiado.");
  };

  const refreshUser = async () => {
      setIsLoading(true);
      try {
          const token = await getToken();
          if (token) {
              const profileResponse = await getProfile();
              if (profileResponse?.success && profileResponse.profile) {
                  setUser(profileResponse.profile);
                  setIsAuthenticated(true);
                  console.log("[AuthProvider] User refreshed:", profileResponse.profile.username);

              } else {
                  console.error('Error al obtener el perfil después de iniciar sesión.');
                  setIsAuthenticated(false);
              }
          } else {
                setIsAuthenticated(false);
          }
      } catch (error) {
            console.error('Error al refrescar el usuario:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          const profileResponse = await getProfile();
          if (profileResponse?.success && profileResponse.profile) {
            setUser(profileResponse.profile);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }

        // Cargar estado de registro si existe
        const savedRegistrationState = await getRegistrationState();
        if (savedRegistrationState) {
          setRegistrationState(savedRegistrationState);
          console.log("[AuthProvider] Estado de registro cargado:", savedRegistrationState);
        }
      } catch (error) {
        console.error('Error al inicializar la autenticación:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        console.log("[AuthProvider] isLoading set to false");
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        signup,
        registrationState,
        updateRegistrationState: updateRegistrationStateFunc,
        clearRegistration,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
