// context/authContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getToken, saveToken, removeToken } from '@/handlers/authTokenHandler';
import axios from 'axios';

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Función para obtener el usuario actual desde el backend usando el token
  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await axios.get('/api/auth/me', { // Ajusta el endpoint según tu API
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setUser(response.data.user); // Asegúrate de que tu backend devuelve el usuario en 'data.user'
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      setUser(null);
    }
  };

  // Inicializar el estado de autenticación al montar el proveedor
  useEffect(() => {
    const initializeAuth = async () => {
      const token = await getToken();
      if (token) {
        await fetchCurrentUser(token);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Función para manejar el inicio de sesión
  const login = async (token: string) => {
    try {
      await saveToken(token);
      await fetchCurrentUser(token);
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      throw new Error('No se pudo iniciar sesión.');
    }
  };

  // Función para manejar el cierre de sesión
  const logout = async () => {
    try {
      await removeToken();
      setUser(null);
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
      throw new Error('No se pudo cerrar sesión.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
