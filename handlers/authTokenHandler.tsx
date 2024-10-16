// src/handlers/authTokenHandler.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'token';

/**
 * Guarda el token de autenticación y su expiración en el almacenamiento seguro.
 * @param token - El token de autenticación.
 * @param expiration - Tiempo de expiración en segundos desde ahora.
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    console.log('Token guardado exitosamente.');
  } catch (error) {
    console.error('Error al guardar el token:', error);
    throw new Error('No se pudo guardar el token de autenticación.');
  }
};

/**
 * Obtiene el token de autenticación del almacenamiento seguro.
 * @returns El token de autenticación o null si no existe.
 */
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    if (token) {
      return token;
    } else {
        console.log('No se encontró el token de autenticación.');
        return null
    }

  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

/**
 * Elimina el token de autenticación y su expiración del almacenamiento seguro.
 */
export const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log('Token eliminado exitosamente.');
  } catch (error) {
    console.error('Error al eliminar el token:', error);
    throw new Error('No se pudo eliminar el token de autenticación.');
  }
};
