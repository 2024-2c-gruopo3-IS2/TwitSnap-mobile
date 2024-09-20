// src/handlers/authTokenHandler.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'token';
const EXPIRATION_KEY = 'token_expiration';

/**
 * Guarda el token de autenticación y su expiración en el almacenamiento seguro.
 * @param token - El token de autenticación.
 * @param expiration - Tiempo de expiración en segundos desde ahora.
 */
export const saveToken = async (token: string, expiration: number): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    //const expirationTime = Date.now() + expiration * 1000;
    //await SecureStore.setItemAsync(EXPIRATION_KEY, expirationTime.toString());
    console.log('Token y expiración guardados exitosamente.');
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
    //const expiration = await SecureStore.getItemAsync(EXPIRATION_KEY);

    if (token) {
      return token;
    } else {
        console.log('No se encontró el token de autenticación.');
        return null
    }

    // if (token && expiration) {
    //   const expirationTime = parseInt(expiration, 10);
    //   if (Date.now() < expirationTime) {
    //     return token;
    //   } else {
    //     // Token expirado
    //     await removeToken();
    //     return null;
    //   }
    // }
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
    await SecureStore.deleteItemAsync(EXPIRATION_KEY);
    console.log('Token y expiración eliminados exitosamente.');
  } catch (error) {
    console.error('Error al eliminar el token:', error);
    throw new Error('No se pudo eliminar el token de autenticación.');
  }
};
