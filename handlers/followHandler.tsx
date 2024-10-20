// followHandler.ts
import { getToken } from './authTokenHandler';

const API_URL = 'https://profile-microservice.onrender.com/profiles';

/**
 * Sigue a un usuario.
 * @param username Nombre de usuario a seguir.
 */
export async function followUser(username: string): Promise<{ success: boolean; message?: string }> {

    const token = await getToken();
    console.log('Token:', token);
    const follow_url = `${API_URL}/follow?username=${encodeURIComponent(username)}`;
    console.log('URL:', follow_url);
    try {
        const response = await fetch(follow_url, {
            method: 'POST',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Seguiste al usuario:', data);
            return { success: true, message: 'Usuario seguido exitosamente.' };
        } else {
            console.log('Error al seguir al usuario:', data);
            return { success: false, message: data.detail || 'Error al seguir al usuario.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Deja de seguir a un usuario.
 * @param username Nombre de usuario a dejar de seguir.
 */
export async function unfollowUser(username: string): Promise<{ success: boolean; message?: string }> {
    const token = await getToken();
    const unfollow_url = `${API_URL}/unfollow?username=${encodeURIComponent(username)}`;

    try {
        const response = await fetch(unfollow_url, {
            method: 'DELETE',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Dejaste de seguir al usuario:', data);
            return { success: true, message: 'Has dejado de seguir al usuario.' };
        } else {
            console.log('Error al dejar de seguir al usuario:', data);
            return { success: false, message: data.detail || 'Error al dejar de seguir al usuario.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Obtiene los seguidores de un usuario.
 * @param username Nombre del usuario cuyos seguidores se obtendrán.
 */
export async function getFollowers(username: string): Promise<{ success: boolean; followers?: any[]; message?: string }> {
    const token = await getToken();
    console.log('Token:', token);
    const followers_url = `${API_URL}/followers?username=${encodeURIComponent(username)}`;
    console.log('URL:', followers_url);
    
    try {
        const response = await fetch(followers_url, {
            method: 'GET',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
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
 * Obtiene los usuarios seguidos por un usuario.
 * @param username Nombre del usuario cuyos seguidos se obtendrán.
 */
export async function getFollowed(username: string): Promise<{ success: boolean; followed?: any[]; message?: string }> {
    const token = await getToken();
    const followed_url = `${API_URL}/followed?username=${encodeURIComponent(username)}`;

    try {
        const response = await fetch(followed_url, {
            method: 'GET',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Usuarios seguidos encontrados:', data);
            return { success: true, followed: data };
        } else {
            console.log('Error al obtener usuarios seguidos:', data);
            return { success: false, message: data.detail || 'Error al obtener usuarios seguidos.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

