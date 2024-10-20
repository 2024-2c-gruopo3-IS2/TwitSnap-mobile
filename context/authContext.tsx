// context/authContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getToken, removeToken, setToken } from '../handlers/authTokenHandler';
import { getProfile, logoutProfile } from '../handlers/profileHandler';

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

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token: string, profile: UserProfile) => {
    setToken(token);
    setUser(profile);
    setIsAuthenticated(true);
    console.log("[AuthProvider] User logged in:", profile.username);
  };

  const logout = async () => {
    await logoutProfile();
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    console.log("[AuthProvider] User logged out");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          const profileResponse = await getProfile();
          console.log("Success:", profileResponse.success);
          console.log("response: ", profileResponse);
          console.log("User:", profileResponse.profile);
          if (profileResponse?.success && profileResponse.profile) {
            setUser(profileResponse.profile);
            console.log('Perfil del usuario SETEADO:', profileResponse.profile);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
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
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
