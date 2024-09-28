import { getToken, saveToken } from './authTokenHandler';

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  expiration?: number;
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

    console.log('Data:', data);

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
    return { success: false, message: 'Error al conectar con el servidor.' }; // CA 2: Error del servicio
  }
}
