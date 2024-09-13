import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000', // Fondo negro
  },
  avatarContainer: {
    padding: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  srOnly: {
    color: '#FFF', // Texto blanco
  },
  newPostContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  newPostInput: {
    flex: 1,
    backgroundColor: '#222',
    color: '#FFF', // Texto blanco
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postButtonText: {
    color: '#FFF', // Texto blanco
    fontWeight: 'bold',
  },
  feed: {
    padding: 16,
  },
  card: {
    backgroundColor: '#111', // Fondo oscuro para las tarjetas
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: '#FFF', // Texto blanco
    fontWeight: 'bold',
  },
  time: {
    color: '#888', // Texto gris
  },
  cardContent: {
    marginBottom: 8,
  },
  contentText: {
    color: '#FFF', // Texto blanco
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerButton: {
    color: '#1DA1F2', // Texto azul para los botones
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#000', // Fondo negro
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
});
