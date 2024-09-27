import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Footer from '../components/footer'; 
import styles from '../styles/notifications'; 

interface Notification {
  id: string;
  message: string;
  time: string;
}

const notifications: Notification[] = [
  { id: '1', message: 'Nuevo comentario en tu publicación', time: 'Hace 2 horas' },
  { id: '2', message: 'Te han dado like', time: 'Hace 5 horas' },
  { id: '3', message: 'Nuevo seguidor: @usuario123', time: 'Ayer' },
];

const Notifications: React.FC = () => {
  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  );

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

export default Notifications;
