// app/notifications.tsx

import React, { useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Footer from '../components/footer';
import styles from '../styles/notifications';
import { NotificationContext } from '../context/notificationContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNotificationPress = (item: NotificationItem) => {
    if (item.type === 'message' && item.messageId) {
      navigation.navigate('ChatScreen', { messageId: item.messageId });
      markAsRead(item.id);
    }
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
      {/* Contenedor del botón de retroceso y título */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificaciones</Text>
      </View>

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
