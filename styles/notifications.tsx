import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 60, // Espacio para el footer
    backgroundColor: '#000', // Fondo negro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff', // Texto blanco
    marginTop:50,
  },
  content: {
    flex: 1,
    color: '#fff', // Texto blanco para el contenido general
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  notificationMessage: {
    color: '#fff',
    fontSize: 16,
  },
  notificationTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  noNotifications: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
