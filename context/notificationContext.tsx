// notificationContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { AuthContext } from './authContext';
import { ref, onValue, update, remove, get } from 'firebase/database';
import { useRouter } from 'expo-router'; // Usar useRouter de expo-router
import { db } from '../firebaseConfig';
import Toast from 'react-native-toast-message';

interface NotificationItem {
  id: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
  senderId?: string;
  messageId?: string;
  topic?: string;
  followUsername?: string;
}

interface NotificationContextProps {
  notifications: NotificationItem[];
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  markAsRead: async () => {},
  deleteNotification: async () => {},
});

// Configuración de manejo de notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationProvider: React.FC = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const router = useRouter(); // Usar useRouter
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    if (!user || !user.username) {
      console.log("No hay usuario autenticado o username no definido.");
      return;
    }

    console.log("[NOTIS] Escuchando notificaciones para el usuario:", user.username);

    // Obtener y registrar el token de notificaciones push
    registerForPushNotificationsAsync()
      .then(token => {
        if (token) {
          setExpoPushToken(token);
          console.log("[TOKEN NOTIS]", token);

          // Guarda el token en Firebase en la colección de cada usuario
          if (user && user.username) {
            const tokenRef = ref(db, `users/${user.username}/expoPushToken`);
            update(tokenRef, { token })
              .then(() => console.log('Token de notificación guardado en Firebase'))
              .catch(error => console.log('Error al guardar el token en Firebase:', error));
          }
        } else {
          console.log("[ERROR] Token no recibido");
        }
      })
      .catch(error => console.log("[ERROR REGISTRO]", error));

    // Listener para manejar notificaciones recibidas en primer plano
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      try {
        const data = notification.request.content.data || {};
        const newNotification: NotificationItem = {
          id: data.id || new Date().getTime().toString(),
          message: notification.request.content.body || 'Nueva notificación',
          time: new Date().toLocaleString(),
          type: data.type || 'general',
          read: false,
          senderId: data.senderId || null,
          messageId: data.messageId || null,
          topic: data.topic || null,
          followUsername: data.followUsername || null,
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Guardar la notificación en Firebase para persistencia
        const notificationRef = ref(db, `notifications/${user.username}/userNotifications/${newNotification.id}`);
        update(notificationRef, newNotification)
          .then(() => console.log('Notificación guardada en Firebase'))
          .catch(error => console.log('Error al guardar la notificación en Firebase:', error));

        // Mostrar visualmente la notificación si es de tipo 'trending'
        if (newNotification.type === 'trending' && newNotification.topic) {
          Toast.show({
            type: 'info',
            text1: 'TwitSnap Trending',
            text2: `Se ha publicado un TwitSnap sobre "${newNotification.topic}".`,
            onPress: () => handleNotificationPress(newNotification),
          });
        }

        if (newNotification.type === 'follow' && newNotification.followerUsername) {
              Toast.show({
                type: 'info',
                text1: 'Nuevo Seguidor',
                text2: `${newNotification.followerUsername} te ha seguido.`,
                onPress: () => handleNotificationPress(newNotification),
              });
          }

      } catch (error) {
        console.log("Error al procesar la notificación:", error);
      }
    });

    // Listener para manejar respuestas a notificaciones (cuando el usuario las toca)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
          const data = response.notification.request.content.data || {};
          const type = data.type || 'general';
          if (type === 'trending' && data.topic) {
            router.push({
              pathname: 'topicDetail',
              params: { topic: data.topic },
            });
          } else if (type === 'message' && data.messageId) {
            router.push(`/chat/${data.messageId}`);
          } else if (type === 'follow' && data.followerUsername) {
            router.push({
              pathname: 'profileView',
              params: { username: data.followerUsername },
            });
          }
        });

    // Cargar notificaciones existentes desde Firebase al iniciar
    const notificationsRef = ref(db, `notifications/${user.username}/userNotifications`);
    const unsubscribe = onValue(notificationsRef, snapshot => {
      const notif: NotificationItem[] = [];
      snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();
        notif.push({
          id: childSnapshot.key || '',
          message: data.message || 'Mensaje sin contenido',
          time: data.time || 'Fecha no disponible',
          type: data.type || 'general',
          read: data.read ?? true,
          senderId: data.senderId,
          messageId: data.messageId,
          topic: data.topic || null, // Añadido
          followUsername: data.followUsername || null, // Añadido
        });
      });
      setNotifications(notif);
    }, error => {
      console.log('Error al cargar notificaciones:', error);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
      unsubscribe();
    };
  }, [user]);

  // Función para solicitar permisos de notificaciones y obtener el token
  async function registerForPushNotificationsAsync() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permiso de notificación denegado');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token);
      return token;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  // Función para manejar el clic en una notificación y marcarla como leída
  const handleNotificationPress = async (item: NotificationItem) => {
      if (item.type === 'message' && item.messageId) {
        router.push(`/chat/${item.messageId}`);
      } else if (item.type === 'trending' && item.topic) {
        router.push({
          pathname: 'topicDetail',
          params: { topic: item.topic },
        });
      } else if (item.type === 'follow' && item.followerUsername) {
        router.push({
          pathname: 'profile', // Asumir que 'profile' es la pantalla del perfil
          params: { username: item.followerUsername },
        });
      }

    try {
      const notificationRef = ref(db, `notifications/${user.username}/userNotifications/${item.id}`);
      await update(notificationRef, { read: true });
      console.log('Notificación marcada como leída');
    } catch (error) {
      console.log('Error al marcar la notificación como leída:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!user || !user.username) return;

    try {
      const notificationRef = ref(db, `notifications/${user.username}/userNotifications/${id}`);
      await remove(notificationRef); // Elimina la notificación de Firebase
      setNotifications(prev => prev.filter(notif => notif.id !== id)); // Elimina la notificación del estado local
      console.log('Notificación eliminada');
    } catch (error) {
      console.log('Error al eliminar la notificación:', error);
    }
  };

  // Función para marcar una notificación específica como leída
  const markAsRead = async (id: string) => {
    if (!user || !user.username) return;

    try {
      const notificationRef = ref(db, `notifications/${user.username}/userNotifications/${id}`);
      await update(notificationRef, { read: true });
      setNotifications(prev =>
        prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
      );
      console.log('Notificación marcada como leída');
    } catch (error) {
      console.log('Error al marcar la notificación como leída:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
