import { db } from '../firebaseConfig';
import { get, ref, update, push } from 'firebase/database';
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

export const followUserNotify = async (followedUser, currentUser) => {
  try {
    // Obtén el token de notificación del usuario seguido desde Firebase
    const tokenRef = ref(db, `users/${followedUser}/expoPushToken`);
    const tokenSnapshot = await get(tokenRef);
    const expoPushToken = tokenSnapshot.exists() ? tokenSnapshot.val().token : null;

    if (!expoPushToken) {
      console.log(`Token de notificación no encontrado para el usuario: ${followedUser}`);
      return;
    }

    // Crea la notificación con datos adicionales
    const notification = {
      to: expoPushToken,
      sound: 'default',
      title: 'Nuevo Seguidor',
      body: `${currentUser} te ha seguido.`,
      data: { type: 'follow', followerUsername: currentUser },
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
      console.log(`Notificación de seguidor enviada a ${followedUser}`);
    } else {
      console.error('Error enviando la notificación de seguidor:', data);
    }
  } catch (error) {
    console.error("Error en followUserNotify:", error);
  }
};

export const sendMessageNotification = async (chatID, senderEmail, receiverEmail, message) => {
  try {
    // Obtén el token de notificación del usuario receptor desde Firebase
    const tokenRef = ref(db, `users/${receiverEmail}/expoPushToken`);
    const tokenSnapshot = await get(tokenRef);
    const expoPushToken = tokenSnapshot.exists() ? tokenSnapshot.val().token : null;

    if (!expoPushToken) {
      console.log(`Token de notificación no encontrado para el usuario: ${receiverEmail}`);
      return;
    }

    // Crea la notificación push
    const notification = {
      to: expoPushToken,
      sound: 'default',
      title: 'Nuevo Mensaje',
      body: `${senderEmail} te ha enviado un mensaje`,
      data: { chatID },
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
      console.log(`Notificación de mensaje enviada a ${receiverEmail}`);
    } else {
      console.error('Error enviando la notificación de mensaje:', data);
    }

    // Almacenar la notificación en Firebase bajo la ruta correcta
    const notificationsRef = ref(db, `notifications/${receiverEmail}/userNotifications`);
    const newNotificationRef = push(notificationsRef);
    await update(newNotificationRef, {
      id: newNotificationRef.key,
      type: 'message',
      message: `${senderEmail} te ha enviado un mensaje`,
      time: new Date().toLocaleString(),
      read: false,
      senderId: senderEmail,
      messageId: chatID,
    });

    console.log(`Notificación de mensaje almacenada para ${receiverEmail}`);
  } catch (error) {
    console.error("Error en sendMessageNotification:", error);
  }
};



export const sendTrendingNotification = async (currentUsername: string, twitSnapId: string | null, topic: string) => {
    try {
        // Obtén el token de notificación del usuario desde Firebase
        const tokenRef = ref(db, `users/${currentUsername}/expoPushToken`);
        const tokenSnapshot = await get(tokenRef);
        const expoPushToken = tokenSnapshot.exists() ? tokenSnapshot.val().token : null;

        if (!expoPushToken) {
            console.log(`Token de notificación no encontrado para el usuario: ${currentUsername}`);
            return;
        }

        // Crea la notificación
        const notification = {
            to: expoPushToken,
            sound: 'default',
            title: 'Nuevo Trending Topic',
            body: `Se ha generado un nuevo trending topic: "${topic}".`,
            data: { twitSnapId, type: 'trending', topic },
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
            console.log(`Notificación de trending topic enviada a ${currentUsername}`);
        } else {
            console.error('Error enviando la notificación de trending topic:', data);
        }
    } catch (error) {
        console.error("Error en sendTrendingNotification:", error);
    }
};