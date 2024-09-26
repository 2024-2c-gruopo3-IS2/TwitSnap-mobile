// followHandler.ts
import axios from 'axios';
const API_BASE_URL = 'https://auth-microservice-vvr6.onrender.com';

export const followUser = async (userId: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/follow`, { userId }, {
            headers: {
                'Authorization': `Bearer ${await getAuthToken()}`, // Implementa getAuthToken para obtener el token de autenticación
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al seguir al usuario:', error);
        return { success: false, message: 'No se pudo seguir al usuario.' };
    }
};

export const unfollowUser = async (userId: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/unfollow`, { userId }, {
            headers: {
                'Authorization': `Bearer ${await getAuthToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al dejar de seguir al usuario:', error);
        return { success: false, message: 'No se pudo dejar de seguir al usuario.' };
    }
};

export const checkIfFollowing = async (userId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/isFollowing/${userId}`, {
            headers: {
                'Authorization': `Bearer ${await getAuthToken()}`,
            },
        });
        return response.data; // Suponiendo que devuelve { isFollowing: boolean }
    } catch (error) {
        console.error('Error al verificar si se está siguiendo al usuario:', error);
        return { isFollowing: false };
    }
};

// Dentro de getFollowers y getFollowing
export const getFollowers = async (username: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${username}/followers`, {
            headers: {
                'Authorization': `Bearer ${await getAuthToken()}`,
            },
        });
        // Verificar si el usuario actual está siendo seguido por los seguidores (mutual)
        // Esto depende de cómo esté implementado tu backend
        return response.data;
    } catch (error) {
        console.error('Error al obtener los seguidores:', error);
        return { success: false, message: 'No se pudieron obtener los seguidores.' };
    }
};

export const getFollowing = async (username: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${username}/following`, {
            headers: {
                'Authorization': `Bearer ${await getAuthToken()}`,
            },
        });
        // Similarmente, manejar la lógica de privacidad
        return response.data;
    } catch (error) {
        console.error('Error al obtener los seguidos:', error);
        return { success: false, message: 'No se pudieron obtener los seguidos.' };
    }
};


// Implementa getAuthToken según tu lógica de manejo de tokens
const getAuthToken = async (): Promise<string> => {
    // Implementa la lógica para obtener el token almacenado
    // Por ejemplo, desde AsyncStorage:
    // return await AsyncStorage.getItem('authToken') || '';
    return ''; // Reemplaza esto con tu implementación real
};
