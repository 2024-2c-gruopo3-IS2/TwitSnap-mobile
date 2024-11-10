import React, { useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
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
  const { notifications, markAsRead, deleteNotification } = useContext(NotificationContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNotificationPress = (item: NotificationItem) => {
    if (item.type === 'message' && item.messageId) {
      navigation.navigate('ChatScreen', { messageId: item.messageId });
      markAsRead(item.id);
    }
  };

  const handleDeleteNotification = (id: string) => {
    Alert.alert('Eliminar notificación', '¿Estás seguro de que quieres eliminar esta notificación?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', onPress: () => deleteNotification(id) },
    ]);
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationItem}>
      <TouchableOpacity onPress={() => handleNotificationPress(item)} style={styles.notificationContent}>
        <Text style={[styles.notificationMessage, !item.read && styles.unreadNotification]}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteNotification(item.id)} style={styles.deleteButton}>
        <Icon name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificaciones</Text>
      </View>

      <View style={styles.content}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications.slice().reverse()}
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
          />
        ) : (
          <Text style={styles.noNotifications}>No tienes nuevas notificaciones</Text>
        )}
      </View>

      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </View>
  );
};

export default NotificationsScreen;
