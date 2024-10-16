// handlers/postHandler.tsx

import { getToken } from './authTokenHandler';

interface Snap {
  id: number;
  username: string;
  time: string;
  content: string;
  isPrivate: boolean;
}

/**
 * Obtiene todos los TwitSnaps de un usuario específico.
 * 
 */
export async function getSnaps(): Promise<{ success: boolean; snaps?: Snap[]; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';
    
    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const snaps_url = `${API_URL}/snaps/`;
    
    try {
        const response = await fetch(snaps_url, {
        method: 'GET',
        headers: {
            'token': `${token}`,
            'Authorization': `Bearer ${token}`,
        },
        });
    
        const data = await response.json();
        console.log('Data:', data);
    
        if (response.ok) {
        console.log('Snaps encontrados:', data.data);
        return { success: true, snaps: data.data };
        } else {
        console.log('Error al obtener snaps:', data);
        return { success: false, message: data.detail || 'Error al obtener snaps.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
    }


/**
 * Obtiene todos los TwitSnaps del usuario autenticado, incluyendo los de los usuarios que sigue.
 * @returns Una lista de TwitSnaps.
 */
export async function getAllSnaps(): Promise<{ success: boolean; snaps?: Snap[]; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const snaps_url = `${API_URL}/snaps/all-snaps`;

    try {
        const response = await fetch(snaps_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`,
            },
        });

        const data = await response.json();
        console.log('Data:', data);

        if (response.ok) {
            console.log('Snaps encontrados:', data.data);
            return { success: true, snaps: data.data };
        } else {
            console.log('Error al obtener snaps:', data);
            return { success: false, message: data.detail || 'Error al obtener snaps.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Crea un nuevo TwitSnap para el usuario autenticado.
 * @param message Contenido del TwitSnap.
 * @param isPrivate Indica si el TwitSnap es privado.
 * @returns El TwitSnap creado.
 */
export async function createSnap(message: string, isPrivate: boolean): Promise<{ success: boolean; snap?: Snap; message?: string }> {
    console.log('Creando snap:', message, isPrivate);
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }

    console.log('Token:', token);

    const create_snap_url = `${API_URL}/snaps/`;

    try {
        const response = await fetch(create_snap_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`,
            },
            body: JSON.stringify({
                message,         // Usar 'message' para el contenido del Snap
                is_private: isPrivate, // Asegurarse de usar 'is_private'
            }),
        });

        const data = await response.json();
        console.log('Data Crear Snap:', data);

        if (response.ok) {
            console.log('Snap creado:', data.data);
            return { success: true, snap: data.data };
        } else {
            console.log('Error al crear snap:', data);
            return { success: false, message: data.detail || 'Error al crear snap.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Elimina un TwitSnap existente para el usuario autenticado.
 * @param snapId ID del TwitSnap a eliminar.
 * @returns Un mensaje de éxito o error.
 */
export async function deleteSnap(snapId: number): Promise<{ success: boolean; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const delete_snap_url = `${API_URL}/snaps/${snapId}`;

    try {
        const response = await fetch(delete_snap_url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        console.log('Data:', data);

        if (response.ok) {
            console.log('Snap eliminado exitosamente');
            return { success: true, message: 'Snap eliminado exitosamente' };
        } else {
            console.log('Error al eliminar el snap:', data);
            return { success: false, message: data.detail || 'Error al eliminar el snap.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Actualiza un TwitSnap existente para el usuario autenticado.
 * @param snapId ID del TwitSnap a editar.
 * @param message Nuevo contenido del TwitSnap.
 * @param isPrivate Indica si el TwitSnap es privado.
 * @returns Un mensaje de éxito o error.
 */
export async function updateSnap(snapId: string, message: string, isPrivate: boolean): Promise<{ success: boolean; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const update_snap_url = `${API_URL}/snaps/${snapId}`;

    try {
        const response = await fetch(update_snap_url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`,
            },
            body: JSON.stringify({
                message,         // Usar 'message' en lugar de 'content'
                is_private: isPrivate, // Asegurarse de usar 'is_private'
            }),
        });

        const data = await response.json();
        console.log('Data:', data);

        if (response.ok) {
            console.log('Snap actualizado:', data.data);
            return { success: true, message: 'Snap actualizado exitosamente' };
        } else {
            console.log('Error al actualizar el snap:', data);
            return { success: false, message: data.detail || 'Error al actualizar el snap.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}
