// handlers/postHandler.tsx

import { getToken } from './authTokenHandler';

interface Snap {
    id: string;
    username: string;
    time: string;
    message: string;
    isPrivate: boolean;
    likes: number;
    likedByUser: boolean;
    canViewLikes: boolean;
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
            },
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, snaps: data.data };
        } else {
            return { success: false, message: data.detail || 'Error al obtener snaps.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}


/*
* Obtiene los snaps de los usuarios que sigue el usuario autenticado.
*/
export async function getFeedSnaps(): Promise<{ success: boolean; snaps?: Snap[]; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    console.log('Token:', token);
    const followed_snaps_url = `${API_URL}/snaps/feed/`;

    try {
        const response = await fetch(followed_snaps_url, {
            method: 'GET',
            headers: {
                'token': `${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, snaps: data.data };
        } else {
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

        if (response.ok) {
            return { success: true, snaps: data.data };
        } else {
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
    console.log('delete_snap_url:', delete_snap_url);

    try {
        const response = await fetch(delete_snap_url, {
            method: 'DELETE',
            headers: {
                'token': `${token}`,
            },
        });
        console.log('Response DELETE:', response);
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


/**
 * Obtiene los snaps por username
 *
 */
export async function getSnapsByUsername(username: string): Promise<{ success: boolean; snaps?: Snap[]; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    // const token = await getToken();
    // if (!token) {
    //     console.error('Token de autenticación no encontrado.');
    //     return { success: false, message: 'Token de autenticación no encontrado.' };
    // }

    const snaps_url = `${API_URL}/snaps/by-username/${username}`;
    console.log('snaps_url:', snaps_url);

    try {
        const response = await fetch(snaps_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, snaps: data.data };
        } else {
            return { success: false, message: data.detail || 'Error al obtener snaps.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}






/**
 * Busca TwitSnaps por hashtag.
 * @param hashtag El hashtag a buscar (sin el #).
 */
export async function searchSnapsByHashtag(hashtag: string): Promise<{ success: boolean; snaps?: Snap[]; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const search_url = `${API_URL}/snaps/by-hashtag?hashtag=${encodeURIComponent(hashtag)}`;

    try {
        const response = await fetch(search_url, {
            method: 'GET',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, snaps: data.data };
        } else {
            return { success: false, message: data.detail || `Error al buscar snaps con el hashtag #${hashtag}.` };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}


/**
 * Obtiene los Snaps que el usuario ha marcado como favoritos.
 */
export async function getLikedSnaps(): Promise<{ success: boolean; snaps?: Snap[]; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const favourite_snaps_url = `${API_URL}/snaps/liked/`;

    try {
        const response = await fetch(favourite_snaps_url, {
            method: 'GET',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Snaps favoritos obtenidos:', data.data);
            return { success: true, snaps: data.data };
        } else {
            console.log('Error al obtener snaps favoritos:', data);
            return { success: false, message: data.detail || 'Error al obtener snaps favoritos.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}


/**
 * Da like a un Snap.
 * @param snapId ID del Snap a dar like.
 */
export async function likeSnap(snapId: string): Promise<{ success: boolean; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const like_url = `${API_URL}/snaps/like?snap_id=${encodeURIComponent(snapId)}`;

    try {
        const response = await fetch(like_url, {
            method: 'POST',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Snap dado like exitosamente');
            return { success: true, message: 'Snap dado like exitosamente' };
        } else {
            console.log('Error al dar like al snap:', data);
            return { success: false, message: data.detail || 'Error al dar like al snap.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Quita el like de un Snap.
 * @param snapId ID del Snap a quitar like.
 */
export async function unlikeSnap(snapId: string): Promise<{ success: boolean; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const unlike_url = `${API_URL}/snaps/unlike?snap_id=${encodeURIComponent(snapId)}`;

    try {
        const response = await fetch(unlike_url, {
            method: 'POST',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Snap quitado de like exitosamente');
            return { success: true, message: 'Snap quitado de like exitosamente' };
        } else {
            console.log('Error al quitar like al snap:', data);
            return { success: false, message: data.detail || 'Error al quitar like al snap.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Marca un Snap como favorito.
 * @param snapId ID del Snap a favoritar.
 */
export async function favouriteSnap(snapId: string): Promise<{ success: boolean; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const favourite_url = `${API_URL}/snaps/favourite?snap_id=${encodeURIComponent(snapId)}`;

    try {
        const response = await fetch(favourite_url, {
            method: 'POST',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Snap marcado como favorito exitosamente');
            return { success: true, message: 'Snap marcado como favorito exitosamente' };
        } else {
            console.log('Error al marcar como favorito el snap:', data);
            return { success: false, message: data.detail || 'Error al marcar como favorito el snap.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Quita el favorito de un Snap.
 * @param snapId ID del Snap a quitar favorito.
 */
export async function unfavouriteSnap(snapId: string): Promise<{ success: boolean; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const unfavourite_url = `${API_URL}/snaps/unfavourite?snap_id=${encodeURIComponent(snapId)}`;

    try {
        const response = await fetch(unfavourite_url, {
            method: 'POST',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Snap quitado de favoritos exitosamente');
            return { success: true, message: 'Snap quitado de favoritos exitosamente' };
        } else {
            console.log('Error al quitar de favoritos el snap:', data);
            return { success: false, message: data.detail || 'Error al quitar de favoritos el snap.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Obtiene los Snaps que el usuario ha marcado como favoritos.
 */
export async function getFavouriteSnaps(): Promise<{ success: boolean; snaps?: Snap[]; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const favourite_snaps_url = `${API_URL}/snaps/favourites/`;

    try {
        const response = await fetch(favourite_snaps_url, {
            method: 'GET',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Snaps favoritos obtenidos:', data.data);
            return { success: true, snaps: data.data };
        } else {
            console.log('Error al obtener snaps favoritos:', data);
            return { success: false, message: data.detail || 'Error al obtener snaps favoritos.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}

/**
 * Obtiene un Snap por su ID.
 * @param snapId ID del Snap a obtener.
 */
export async function getSnapById(snapId: string): Promise<{ success: boolean; snap?: Snap; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const get_snap_url = `${API_URL}/snaps/${encodeURIComponent(snapId)}`;

    try {
        const response = await fetch(get_snap_url, {
            method: 'GET',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Snap obtenido:', data.data);
            return { success: true, snap: data.data };
        } else {
            console.log('Error al obtener el snap:', data);
            return { success: false, message: data.detail || 'Error al obtener el snap.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}


/**
 * Obtiene los snaps no bloqueados.
 */

 export async function getUnblockedSnaps(): Promise<{ success: boolean; snaps?: Snap[]; message?: string }> {
    const API_URL = 'https://post-microservice.onrender.com';

    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const unblocked_snaps_url = `${API_URL}/snaps/unblocked/`;

    try {
        const response = await fetch(unblocked_snaps_url, {
            method: 'GET',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Snaps no bloqueados obtenidos:', data.data);
            return { success: true, snaps: data.data };
        } else {
            console.log('Error al obtener snaps no bloqueados:', data);
            return { success: false, message: data.detail || 'Error al obtener snaps no bloqueados.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
 }