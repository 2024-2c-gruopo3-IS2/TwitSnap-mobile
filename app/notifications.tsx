// app/notifications.tsx

import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import Footer from '../components/footer';
import styles from '../styles/notifications';
import { AuthContext } from '@/context/authContext';
import { firestore } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

interface NotificationItem {
  id: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
  senderId?: string;
  messageId?: string;
}

const NotificationsScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const subscriber = firestore()
      .collection('notifications')
      .doc(user.uid)
      .collection('userNotifications')
      .orderBy('time', 'desc')
      .onSnapshot(querySnapshot => {
        const notif: NotificationItem[] = [];
        querySnapshot.forEach(documentSnapshot => {
          notif.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          } as NotificationItem);
        });
        setNotifications(notif);
        setIsLoading(false);
      }, error => {
        console.log('Error fetching notifications:', error);
        setIsLoading(false);
      });

    return () => subscriber();
  }, [user]);

  // Escuchar notificaciones recibidas cuando la app está en primer plano
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { message, messageId, senderId } = notification.request.content.data;
      const time = new Date().toLocaleString();
      const newNotification: NotificationItem = {
        id: messageId || new Date().getTime().toString(),
        message: message || 'Tienes un nuevo mensaje',
        time,
        type: 'message',
        read: false,
        senderId,
        messageId,
      };
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleNotificationPress = (item: NotificationItem) => {
    if (item.type === 'message' && item.messageId) {
      // Navegar a la pantalla de chat correspondiente
      navigation.navigate('ChatScreen', { messageId: item.messageId });

      // Opcional: Marcar la notificación como leída
      firestore()
        .collection('notifications')
        .doc(user?.uid)
        .collection('userNotifications')
        .doc(item.id)
        .update({ read: true });
    }
    // Maneja otros tipos de notificaciones según sea necesario
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <View style={styles.notificationItem}>
        <Text style={[styles.notificationMessage, !item.read && styles.unreadNotification]}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      <View style={styles.content}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
          />
        ) : (
          <Text style={styles.noNotifications}>No tienes nuevas notificaciones</Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </View>
  );
};

export default NotificationsScreen;
