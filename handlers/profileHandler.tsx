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
                'token': `${token}`,
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
    const create_profile_url = `${API_URL}/profiles/`;

    try {
        const response = await fetch(create_profile_url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'token': `${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

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
    const users_url = `${API_URL}/profiles/`
    try {
        const response = await fetch(users_url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'token': `${token}`,
            },
        });

        const data = await response.json();

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
    const update_profile_url = `${API_URL}/profiles/`;

    try {
        const response = await fetch(update_profile_url, {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

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
                'token': `${token}`,
            },
        });

        const data = await response.json();

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
    const users_url = `${API_URL}/profiles/all-usernames/`

    try {
        const response = await fetch(users_url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            },
        });

        const data = await response.json();

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


/**
 * Elimina el perfil del usuario autenticado.
 */
export async function deleteProfile(): Promise<{ success: boolean; message?: string }> {
    const token = await getToken();
    const delete_profile_url = `${API_URL}/profiles/`;

    try {
        const response = await fetch(delete_profile_url, {
            method: 'DELETE',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Perfil eliminado:', data);
            return { success: true, message: 'Perfil eliminado exitosamente.' };
        } else {
            console.log('Error al eliminar perfil:', data);
            return { success: false, message: data.detail || 'Error al eliminar perfil.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 @router.get("/followers-with-time/")
    Get followers of a user with the time they followed.
 */
export async function getFollowersWithTime(username: string): Promise<{ success: boolean; followers?: any[]; message?: string }> {
    const token = await getToken();
    const followers_url = `${API_URL}/profiles/followers-with-time?username=${encodeURIComponent(username)}`;

    try {
        const response = await fetch(followers_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Seguidores encontrados:', data);
            return { success: true, followers: data };
        } else {
            console.log('Error al obtener seguidores:', data);
            return { success: false, message: data.detail || 'Error al obtener seguidores.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
. /verify: Verifica a un usuario
 */

export async function verifyUser(username: string): Promise<{ success: boolean; message?: string }> {
    const token = await getToken();
    const verify_url = `${API_URL}/profiles/verify?username=${encodeURIComponent(username)}`;

    try {
        const response = await fetch(verify_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Usuario verificado:', data);
            return { success: true };
        } else {
            console.log('Error al verificar usuario:', data);
            return { success: false, message: data.detail || 'Error al verificar usuario.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

export async function unverifyUser(username: string): Promise<{ success: boolean; message?: string }> {
    const token = await getToken();
    const unverify_url = `${API_URL}/profiles/unverify?username=${encodeURIComponent(username)}`;

    try {
        const response = await fetch(unverify_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Usuario no verificado:', data);
            return { success: true };
        } else {
            console.log('Error al no verificar usuario:', data);
            return { success: false, message: data.detail || 'Error al no verificar usuario.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}


