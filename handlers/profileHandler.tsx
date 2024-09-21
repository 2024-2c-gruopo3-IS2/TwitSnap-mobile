// handlers/profileHandler.tsx
import {getToken, saveToken} from './authTokenHandler';
const API_URL = 'https://profile-microservice.onrender.com';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    try {
        const response = await fetch(API_URL);

        if (response.status === 404) {
            // El nombre de usuario no existe, está disponible
            console.log('Nombre de usuario disponible:', username);
            return true;
        } else {
            // El nombre de usuario existe
            console.log('Nombre de usuario no disponible:', username);
            return false;
        }
    } catch (error) {
        console.error(error);
        return false; // Asumimos que no está disponible en caso de error
    }
}

export async function createProfile(profileData: any): Promise<{ success: boolean; message?: string }> {
    const token = await getToken();
    const users_url = `${API_URL}/profiles?token=${token}`

    try {

        const response = await fetch(users_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

export async function getProfile(): Promise<{ success: boolean; profile?: any; message?: string }> {
    const token = await getToken();
    const users_url = `${API_URL}/profiles?token=${token}`
    
    try {
        const response = await fetch(users_url);

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

export async function updateProfile(profileData: any): Promise<{ success: boolean; message?: string }> {
    const token = await getToken();
    const users_url = `${API_URL}/profiles/${profileData.username}?token=${token}`

    try {
        const response = await fetch(users_url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
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

export async function getUserProfile(username: string): Promise<{ success: boolean; profile?: any; message?: string }> {
    const users_url = `${API_URL}/profiles/${username}`
    
    try {
        const response = await fetch(API_URL);

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