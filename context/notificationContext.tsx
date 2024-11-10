import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { AuthContext } from './authContext';
import { ref, onValue, update, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';

interface NotificationItem {
  id: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
  senderId?: string;
  messageId?: string;
}

interface NotificationContextProps {
  notifications: NotificationItem[];
  markAsRead: (id: string) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  markAsRead: async () => {},
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
  const navigation = useNavigation();
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
          id: data.messageId || new Date().getTime().toString(),
          message: notification.request.content.body || 'Nuevo mensaje',
          time: new Date().toLocaleString(),
          type: 'message',
          read: false,
          senderId: data.senderId || null, // Usa null si senderId está undefined
          messageId: data.messageId || null, // Usa null si messageId está undefined
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Guardar la notificación en Firebase para persistencia
        const notificationRef = ref(db, `notifications/${user.username}/userNotifications/${newNotification.id}`);
        update(notificationRef, newNotification)
          .then(() => console.log('Notificación guardada en Firebase'))
          .catch(error => console.log('Error al guardar la notificación en Firebase:', error));
      } catch (error) {
        console.log("Error al procesar la notificación:", error);
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
        });
      });
      setNotifications(notif);
    }, error => {
      console.log('Error al cargar notificaciones:', error);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      unsubscribe();
    };
  }, [user]);

  // Función para solicitar permisos de notificaciones y obtener el token
  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso de notificación denegado');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
    return token;
  }

  // Función para manejar el clic en una notificación y marcarla como leída
  const handleNotificationPress = async (item: NotificationItem) => {
    if (item.type === 'message' && item.messageId) {
      navigation.navigate('ChatScreen', { messageId: item.messageId });

      try {
        const notificationRef = ref(db, `notifications/${user.username}/userNotifications/${item.id}`);
        await update(notificationRef, { read: true });
        console.log('Notificación marcada como leída');
      } catch (error) {
        console.log('Error al marcar la notificación como leída:', error);
      }
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
