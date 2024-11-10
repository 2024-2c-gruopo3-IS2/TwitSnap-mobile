import {getToken, saveToken} from './authTokenHandler';

export interface RegisterResponse {
  success: boolean;
  token?: string;
  message?: string;
  expiration?: number; 
}

export async function registerUser(email: string, password: string): Promise<RegisterResponse> {
  const API_URL = 'https://auth-microservice-vvr6.onrender.com/auth/signup';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, is_admin: false }),
    });

    const data = await response.json();


    if (response.ok) {
      if (data.token) {
        await saveToken(data.token);
        return { success: true, token: data.token };
      } else {
        return { success: false, message: data.message || 'Error al registrar el usuario' };
      }
    } 
    return { success: false, message: data.message || 'Error al registrar el usuario' };
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return { success: false, message: 'Error al conectar con el servidor.' }; // CA 2: Error del servicio
  }
}

export async function generatePin(email: string): Promise<RegisterResponse> {
  const API_URL = 'https://auth-microservice-vvr6.onrender.com/auth/generate-pin';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Error al generar el pin' };
    }
  } catch (error) {
    console.error('Error al generar el pin:', error);
    return { success: false, message: 'Error al conectar con el servidor.' }; // CA 2: Error del servicio
  }
}

export async function verifyPin(email: string, pin: string): Promise<RegisterResponse> {
  const API_URL = 'https://auth-microservice-vvr6.onrender.com/auth/verify-pin';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, pin }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Error al verificar el pin' };
    }
  } catch (error) {
    console.error('Error al verificar el pin:', error);
    return { success: false, message: 'Error al conectar con el servidor.' }; // CA 2: Error del servicio
  }
}


