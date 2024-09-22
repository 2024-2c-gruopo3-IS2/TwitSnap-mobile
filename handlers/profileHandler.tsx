// handlers/profileHandler.tsx

import { getToken } from './authTokenHandler';

const API_URL = 'https://profile-microservice.onrender.com';

/**
 * Verifica la disponibilidad de un nombre de usuario.
 * @param username Nombre de usuario a verificar.
 * @returns `true` si está disponible, `false` si ya existe.
 */
export async function checkUsernameAvailability(username: string): Promise<boolean> {
    try {
        const user_url = `${API_URL}/profiles/by-username?username=${encodeURIComponent(username)}`;
        const token = await getToken();

        const response = await fetch(user_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 404) {
            // El nombre de usuario no existe, está disponible
            console.log('Nombre de usuario disponible:', username);
            return true;
        } else if (response.status === 200) {
            // El nombre de usuario existe
            console.log('Nombre de usuario no disponible:', username);
            return false;
        } else {
            // Otros códigos de estado
            console.log('Error al verificar disponibilidad:', await response.text());
            return false;
        }
    } catch (error) {
        console.error(error);
        return false; // Asumimos que no está disponible en caso de error
    }
}

/**
 * Crea un nuevo perfil de usuario.
 * @param profileData Datos del perfil a crear.
 * @returns Resultado de la operación.
 */
export async function createProfile(profileData: any): Promise<{ success: boolean; message?: string }> {
    const token = await getToken();
    const create_profile_url = `${API_URL}/profiles?token=${token}`;

    try {
        const response = await fetch(create_profile_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();
        console.log('Data:', data);

        if (response.ok) {
            console.log('Perfil creado:', data);
            return { success: true };
        } else {
            console.log('Error al crear el perfil:', data);
            return { success: false, message: data.detail || 'Error al crear el perfil.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Obtiene el perfil del usuario autenticado.
 * @returns Perfil del usuario.
 */
export async function getProfile(): Promise<{ success: boolean; profile?: any; message?: string }> {
    const token = await getToken();
    const users_url = `${API_URL}/profiles?token=${token}`
    try {
        const response = await fetch(users_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        console.log('Data:', data);

        if (response.ok) {
            console.log('Perfil encontrado:', data);
            return { success: true, profile: data };
        } else {
            console.log('Error al obtener el perfil:', data);
            return { success: false, message: data.detail || 'Error al obtener el perfil.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Actualiza el perfil del usuario.
 * @param profileData Datos del perfil a actualizar.
 * @returns Resultado de la operación.
 */
export async function updateProfile(profileData: any): Promise<{ success: boolean; message?: string }> {
    const token = await getToken();
    const update_profile_url = `${API_URL}/profiles?token=${token}`;

    try {
        const response = await fetch(update_profile_url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();
        console.log('Data:', data);

        if (response.ok) {
            console.log('Perfil actualizado:', data);
            return { success: true };
        } else {
            console.log('Error al actualizar el perfil:', data);
            return { success: false, message: data.detail || 'Error al actualizar el perfil.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Obtiene el perfil de un usuario específico por su nombre de usuario.
 * @param username Nombre de usuario del perfil a obtener.
 * @returns Perfil del usuario.
 */
export async function getUserProfile(username: string): Promise<{ success: boolean; profile?: any; message?: string }> {
    const user_url = `${API_URL}/profiles/by-username?username=${encodeURIComponent(username)}`;
    const token = await getToken();
    

    try {
        const response = await fetch(user_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        console.log('Data:', data);

        if (response.ok) {
            console.log('Usuario encontrado:', data);
            return { success: true, profile: data };
        } else {
            console.log('Error al obtener usuario:', data);
            return { success: false, message: data.detail || 'Error al obtener usuario.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

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