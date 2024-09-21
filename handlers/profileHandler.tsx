// handlers/profileHandler.tsx
import {getToken, saveToken} from './authTokenHandler';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    const API_URL = `https://profile-microservice.onrender.com/profiles/username/${username}`;

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
    const API_URL = 'https://profile-microservice.onrender.com';

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
