// handlers/profileHandler.tsx
import { getToken } from './authTokenHandler';

/**
 * Obtiene la lista de todos los nombres de usuario.
 * @returns Una lista de usuarios.
 */
export async function getAllUsers(): Promise<{ success: boolean; users?: any[]; message?: string }> {
    const API_URL = 'https://profile-microservice.onrender.com'; 

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const users_url = `${API_URL}/profiles/all-usernames?token=${token}`

    try {
        const response = await fetch(users_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Enviar token en el encabezado
            },
        });

        const data = await response.json();
        console.log('Data:', data);

        if (response.ok) {
            console.log('Usuarios encontrados:', data);
            return { success: true, users: data }; // Devuelve los usuarios si se encuentra la lista
        } else {
            console.log('Error al obtener usuarios:', data);
            return { success: false, message: data.detail || 'Error al obtener usuarios.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}
