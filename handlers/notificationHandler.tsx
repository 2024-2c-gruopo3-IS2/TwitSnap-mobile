import { db } from '../firebaseConfig';
import { get, ref, update } from 'firebase/database';
import * as Notifications from 'expo-notifications';

// Función para enviar notificación de mención
export const sendMentionNotification = async (mentionedUser, currentUser, postId) => {
  try {
    // Obtén el token de notificación del usuario mencionado desde Firebase
    const tokenRef = ref(db, `users/${mentionedUser}/expoPushToken`);
    const tokenSnapshot = await get(tokenRef);
    const expoPushToken = tokenSnapshot.exists() ? tokenSnapshot.val().token : null;

    if (!expoPushToken) {
      console.log(`Token de notificación no encontrado para el usuario: ${mentionedUser}`);
      return;
    }

    // Crea la notificación
    const notification = {
      to: expoPushToken,
      sound: 'default',
      title: 'Nueva Mención',
      body: `${currentUser} te mencionó en un TwitSnap.`,
      data: { postId },
    };

    // Enviar la notificación utilizando Expo Push API
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    const data = await response.json();
    if (data?.data?.status === 'ok') {
      console.log(`Notificación de mención enviada a ${mentionedUser}`);
    } else {
      console.error('Error enviando la notificación de mención:', data);
    }
  } catch (error) {
    console.error("Error en sendMentionNotification:", error);
  }
};


export const sendShareNotification = async (originalUser, currentUser, snapId) => {
  try {
    // Obtener el token de notificación del usuario original
    const tokenRef = ref(db, `users/${originalUser}/expoPushToken`);
    const tokenSnapshot = await get(tokenRef);
    const expoPushToken = tokenSnapshot.exists() ? tokenSnapshot.val().token : null;

    if (!expoPushToken) {
      console.log(`Token de notificación no encontrado para el usuario: ${originalUser}`);
      return;
    }

    // Crear la notificación
    const notification = {
      to: expoPushToken,
      sound: 'default',
      title: 'Snap Compartido',
      body: `${currentUser} ha compartido tu TwitSnap.`,
      data: { snapId },
    };

    // Enviar la notificación utilizando Expo Push API
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    const data = await response.json();
    if (data?.data?.status === 'ok') {
      console.log(`Notificación de compartición enviada a ${originalUser}`);
    } else {
      console.error('Error enviando la notificación de compartición:', data);
    }
  } catch (error) {
    console.error("Error en sendShareNotification:", error);
  }
};
