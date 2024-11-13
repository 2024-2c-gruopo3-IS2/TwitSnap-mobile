import React, { useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Footer from '../components/footer';
import { NotificationContext } from '../context/notificationContext';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';


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
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNotificationPress = (item: NotificationItem) => {
    if (item.type === 'message' && item.messageId) {
      router.push(`/chat/${item.messageId}`);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={notifications.slice().reverse()}
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
        marginLeft: -40,
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
      padding: 15,
      borderRadius: 8,
      backgroundColor: '#1f1f1f',
      marginBottom: 10,
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
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
      },
      notificationContent: {
        flex: 1,
      },
      deleteButton: {
        padding: 5,
      },
  });

export default NotificationsScreen;