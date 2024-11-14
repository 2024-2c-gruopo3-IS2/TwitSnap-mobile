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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={notifications.slice().reverse()} // Mostrar las notificaciones más recientes primero
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
        />
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#000',
    },
    header: {
        marginTop:60,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#333',
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginLeft: -10,
        },
    backButton: {
      marginRight: 15,
      marginLeft: 10,
    },
    title: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center', // Centrar el título
      marginLeft: -30,
    },
    content: {
      flex: 1,
      padding: 10,
    },
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#1f1f1f', // Opcional: Fondo oscuro para las notificaciones
    },
    notificationMessage: {
      color: '#fff',
      fontSize: 16,
    },
    unreadNotification: {
      fontWeight: 'bold',
    },
    notificationTime: {
      color: '#bbb',
      fontSize: 12,
      marginTop: 5,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noNotifications: {
      color: '#ccc',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
    },
    footerContainer: {
      borderTopWidth: 1,
      borderTopColor: '#333',
    },
    notificationContent: {
      flex: 1,
    },
    deleteButton: {
      padding: 5,
    },
});

export default NotificationsScreen;
