export interface RegisterResponse {
    success: boolean;
    message?: string;
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
        // Registro exitoso
        return { success: true, ...data };
      } else {
        // Error en el registro
        return { success: false, message: data.message || 'Error al registrar el usuario.' };
      }
    } catch (error) {
      // Error de red u otro error
      console.error(error);
      return { success: false, message: 'Error al conectar con el servidor.' };
    }
  }
  