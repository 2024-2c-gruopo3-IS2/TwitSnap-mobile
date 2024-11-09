// styles/notifications.tsx

import { StyleSheet } from 'react-native';

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
  backButton: {
    marginRight: 15,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center', // Centrar el título
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
});

export default styles;
