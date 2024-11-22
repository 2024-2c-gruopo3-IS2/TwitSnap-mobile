// NotificationsScreen.tsx

import React, { useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Footer from '../components/footer';
import { NotificationContext } from '../context/notificationContext';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';
import {AuthContext} from '../context/authContext';

interface NotificationItem {
  id: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
  senderId?: string;
  messageId?: string;
  topic?: string;
  followerUsername?: string; // Asegurarse de que este campo existe
}

const NotificationsScreen: React.FC = () => {
  const { notifications, markAsRead, deleteNotification } = useContext(NotificationContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const {user} = useContext(AuthContext);

  const handleNotificationPress = (item: NotificationItem) => {
      console.log('Notificación presionada:', item);
      console.log('Tipo de notificación:', item.type);
      console.log('ID de notificación:', item.id);
      console.log('msg ID: ', item.messageId);
    if (item.type === 'message' && item.messageId) {
        console.log("RUTA CHAT: ", `/chat/${item.messageId}`);
        router.push({
          pathname: '/specificChat',
          params: { chatID: item.messageId, email_sender: user.username, email_receiver: item.senderUsername, fromNotification: true },

        });
      markAsRead(item.id);
    } else if (item.type === 'trending' && item.topic) {
      router.push({
        pathname: 'topicDetail',
        params: { topic: item.topic },
      });
      markAsRead(item.id);
    } else if (item.type === 'follow' && item.followerUsername) {
      router.push({
        pathname: 'profileView',
        params: { username: item.followerUsername },
      });
      markAsRead(item.id);
    }
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
  };

  const handleClearAll = () => {
      if (notifications.length === 0) {
        Alert.alert('Info', 'No hay notificaciones para borrar.');
        return;
      }

      Alert.alert(
        'Confirmar',
        '¿Estás seguro de que deseas borrar todas las notificaciones?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Borrar Todo',
            style: 'destructive',
            onPress: () => {
              notifications.forEach((notification) => deleteNotification(notification.id));
            },
          },
        ]
      );
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
        <Icon name="delete" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
      <View style={styles.container}>
        {/* Encabezado con botón para borrar todas las notificaciones */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll}>
            <Icon name="delete-sweep" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={notifications.slice().reverse()} // Mostrar las notificaciones más recientes primero
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
        />
        <Footer />
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Fondo oscuro
  },
  header: {
      marginTop: 60,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 20,
      backgroundColor: 'black',
      borderBottomWidth: 1,
      borderBottomColor: '#333',
      justifyContent: 'space-between',
    },
   headerTitle: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 130,
    },
    clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearAllText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12, // Esquinas redondeadas
    backgroundColor: '#1E1E1E', // Fondo oscuro para la notificación
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Sombra para dispositivos Android
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  unreadNotification: {
    fontWeight: 'bold',
  },
  notificationTime: {
    color: '#BBBBBB',
    fontSize: 12,
    marginTop: 5,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#FF4444',
    borderRadius: 8, // Botón con esquinas redondeadas
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotifications: {
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});


export default NotificationsScreen;
