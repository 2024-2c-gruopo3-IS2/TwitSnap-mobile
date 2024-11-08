// handlers/authHandler.ts

import { getToken, saveToken } from './authTokenHandler';

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  expiration?: number;
}

export interface PasswordResetRequestResponse {
  success: boolean;
  message?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const API_URL = 'https://auth-microservice-vvr6.onrender.com/auth/signin';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, is_admin: false }),
    });

    const data = await response.json();


    if (response.ok && data.token) {
      await saveToken(data.token);
      console.log('Token almacenado:', data.token);
      return { success: true, token: data.token };
    } else if (data.status === 'blocked') {
      return { success: false, message: 'Cuenta bloqueada. Contacte al soporte.' }; // CA4: Usuario bloqueado
    } else if (data.error === 'invalid credentials') {
      return { success: false, message: 'El correo o la contraseña son incorrectos.' }; // CA2: Credenciales inválidas
    } else {
      return { success: false, message: data.message || 'Error al iniciar sesión.' }; // Error genérico
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, message: 'Error al conectar con el servidor.' }; // CA2: Error del servicio
  }
}

/**

 Pide el request de recupero de contraseña

 */


export async function requestPasswordReset(email: string): Promise<PasswordResetRequestResponse> {
  const API_URL = 'https://auth-microservice-vvr6.onrender.com/auth/request-password-reset';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    // Agrega un log para ver la estructura de la respuesta
    console.log('[API] Response from requestPasswordReset:', data);

    if (response.ok) {
      return { success: true, message: 'Se ha enviado un enlace de recuperación a tu correo electrónico.' };
    } else {
      return { success: false, message: data.message || 'No se pudo procesar la solicitud de recuperación.' };
    }
  } catch (error) {
    console.error('Error en requestPasswordReset:', error);
    return { success: false, message: 'Error al conectar con el servidor.' };
  }
}


/**
 Recupera la contraseña

 */

export async function resetPassword(email: string, password: string, token: string): Promise<ResetPasswordResponse> {
    const API_URL = 'https://auth-microservice-vvr6.onrender.com/auth/password-reset';

    try {
        const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, token }),
        });

        const data = await response.json();

        if (response.ok) {
        return { success: true, message: 'Contraseña actualizada correctamente.' };
        } else {
        return { success: false, message: data.message || 'No se pudo actualizar la contraseña.' };
        }
    } catch (error) {
        console.error('Error en resetPassword:', error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }

}
