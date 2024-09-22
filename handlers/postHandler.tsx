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
    const snaps_url = `${API_URL}/snaps/?token=${token}`;

    try {
        const response = await fetch(snaps_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
 * Crea un nuevo TwitSnap para el usuario autenticado.
 * @param message Contenido del TwitSnap.
 * @param isPrivate Indica si el TwitSnap es privado.
 * @returns El TwitSnap creado.
 */
export async function createSnap(message: string, isPrivate: boolean): Promise<{ success: boolean; snap?: Snap; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const create_snap_url = `${API_URL}/snaps/?token=${token}`;

    try {
        const response = await fetch(create_snap_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                message,         // Cambiado de 'content' a 'message'
                is_private: isPrivate, // Cambiado de 'isPrivate' a 'is_private'
            }),
        });

        const data = await response.json();
        console.log('Data:', data);

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
