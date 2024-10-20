// context/authContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getToken, removeToken, setToken } from '../handlers/authTokenHandler';
import { getProfile, logoutProfile } from '../handlers/profileHandler';

// La interfaz UserProfile está correcta
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

interface AuthContextProps {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, profile: UserProfile) => void;
  logout: () => void;
}

// Creamos el contexto con valores iniciales por defecto
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

// El AuthProvider envuelve toda la aplicación para que cualquier componente pueda usar el contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token: string, profile: UserProfile) => {
    setToken(token); // Guarda el token, asegurando persistencia de la sesión
    setUser(profile); // Actualiza el perfil del usuario
    setIsAuthenticated(true); // Marca al usuario como autenticado
  };

  const logout = async () => {
    await logoutProfile(); // Implementa la lógica de cierre de sesión
    removeToken(); // Elimina el token
    setUser(null); // Borra el perfil del usuario
    setIsAuthenticated(false); // Marca al usuario como no autenticado
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken(); // Intenta obtener el token de sesión
        if (token) {
          const profileResponse = await getProfile(); // Obtiene el perfil del usuario
          if (profileResponse?.success && profileResponse.user) {
            setUser(profileResponse.user); // Guarda el perfil del usuario en el estado
            console.log('Perfil del usuario SETEADO:', profileResponse.user);
            setIsAuthenticated(true); // Marca al usuario como autenticado
          } else {
            setIsAuthenticated(false); // No está autenticado si no hay perfil válido
          }
        } else {
          setIsAuthenticated(false); // No está autenticado si no hay token
        }
      } catch (error) {
        console.error('Error al inicializar la autenticación:', error);
        setIsAuthenticated(false); // En caso de error, no está autenticado
      } finally {
        setIsLoading(false); // Termina la carga inicial
      }
    };

    initializeAuth(); // Ejecuta la inicialización de la autenticación cuando el componente monta
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
