import AsyncStorage from '@react-native-async-storage/async-storage';

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

    if (response.ok) {
      // Guardar token en AsyncStorage y manejar expiración
      if (data.token && data.expiration) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('expiration', JSON.stringify(Date.now() + data.expiration * 1000));
        console.log('Token almacenado:', data.token);
        console.log('Expiration almacenada:', data.expiration);
    }

      return { success: true, token: data.token, expiration: data.expiration };
    } else if (data.status === 'blocked') {
      return { success: false, message: 'Cuenta bloqueada. Contacte al soporte.' }; // CA4: Usuario bloqueado
    } else {
      return { success: false, message: data.message || 'Error al iniciar sesión.' }; // CA 1 y CA 2: Manejo de errores
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, message: 'Error al conectar con el servidor.' }; // CA 2: Error del servicio
  }
}
