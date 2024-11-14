import { db } from '../firebaseConfig';
import { get, ref, update, push } from 'firebase/database';
import * as Notifications from 'expo-notifications';

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

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

export const sendMessageNotification = async (
  chatID: string,
  senderUsername: string, // Cambiado de senderEmail a senderUsername
  receiverUsername: string, // Cambiado de receiverEmail a receiverUsername
  message: string
) => {
  try {
    // Obtener el token de notificación del usuario receptor desde Firebase
    const tokenRef = ref(db, `users/${receiverUsername}/expoPushToken`);
    const tokenSnapshot = await get(tokenRef);
    const expoPushToken = tokenSnapshot.exists() ? tokenSnapshot.val().token : null;

    if (!expoPushToken) {
      console.log(`Token de notificación no encontrado para el usuario: ${receiverUsername}`);
      return;
    }

    console.log("[NOT] CHAT ID: ", chatID);
    console.log("[NOT] SENDER: ", senderUsername);
    console.log("[NOT] RECEIVER: ", receiverUsername);
    console.log("[NOT] MESSAGE: ", message);

    // Crear la notificación push
    const notification = {
      to: expoPushToken,
      sound: 'default',
      title: 'Nuevo Mensaje',
      body: `${senderUsername} te ha enviado un mensaje`,
      data: {
        type: 'message', // Establecer el tipo a 'message'
        messageId: chatID,
        senderUsername // Incluir senderUsername en los datos de la notificación
      },
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
      console.log(`Notificación de mensaje enviada a ${receiverUsername}`);
    } else {
      console.error('Error enviando la notificación de mensaje:', data);
    }

    // Almacenar la notificación en Firebase bajo la ruta correcta
    const notificationsRef = ref(db, `notifications/${receiverUsername}/userNotifications`);
    const newNotificationRef = push(notificationsRef);
    await update(newNotificationRef, {
      id: newNotificationRef.key,
      type: 'message',
      message: `${senderUsername} te ha enviado un mensaje`,
      time: new Date().toLocaleString(),
      read: false,
      senderUsername, // Incluir senderUsername en la notificación almacenada
      messageId: chatID,
    });

    console.log(`Notificación de mensaje almacenada para ${receiverUsername}`);
  } catch (error) {
    console.error("Error en sendMessageNotification:", error);
  }
};

export const sendTrendingNotification = async (topic: string) => {
  try {
    // Obtén la referencia a todos los usuarios en Firebase
    const usersRef = ref(db, 'users');
    const usersSnapshot = await get(usersRef);

    if (!usersSnapshot.exists()) {
      console.log('No se encontraron usuarios.');
      return;
    }
    console.log("SNAPSHOT DE USUARIOS", usersSnapshot.val());
    console.log("TOPIC: ", topic);

    // Itera sobre cada usuario y envía la notificación
    for (const userSnapshot of Object.values(usersSnapshot.val())) {
      const userData = userSnapshot;
      const expoPushToken = userData.expoPushToken?.token;

      if (!expoPushToken) {
        console.log(`Token de notificación no encontrado para el usuario: ${userSnapshot.key}`);
        continue;
      }

      // Crea la notificación
      const notification = {
        to: expoPushToken,
        sound: 'default',
        title: 'Nuevo Trending Topic',
        body: `Se ha generado un nuevo trending topic: "${topic}".`,
        data: { type: 'trending', topic },
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
        console.log(`Notificación de trending topic enviada a ${userSnapshot.key}`);
      } else {
        console.error('Error enviando la notificación de trending topic:', data);
      }

      // Pausa de 500 ms entre notificaciones
      await sleep(500);
    }
  } catch (error) {
    console.error("Error en sendTrendingNotification:", error);
  }
};