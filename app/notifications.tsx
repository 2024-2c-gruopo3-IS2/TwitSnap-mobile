import React, { useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Footer from '../components/footer';
import styles from '../styles/notifications';
import { NotificationContext } from '../context/notificationContext';
import { useNavigation } from '@react-navigation/native';

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
  const { notifications, markAsRead } = useContext(NotificationContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false); // Para el indicador de carga

  console.log("Lista de notificaciones:", notifications); // Log para verificar datos

  const handleNotificationPress = (item: NotificationItem) => {
    if (item.type === 'message' && item.messageId) {
      navigation.navigate('ChatScreen', { messageId: item.messageId });
      markAsRead(item.id); // Marcar como leída
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <View style={styles.notificationItem}>
        {/* Mensaje de la notificación, con estilo para no leídas */}
        <Text style={[styles.notificationMessage, !item.read && styles.unreadNotification]}>
          {item.message}
        </Text>
        {/* Fecha y hora de la notificación */}
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
