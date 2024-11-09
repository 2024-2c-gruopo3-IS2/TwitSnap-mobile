// styles/chat.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro
  },
  header: {
      marginTop:50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1f1f1f', // Color del encabezado
    borderBottomWidth: 1,
    borderColor: '#333', // Línea divisoria
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#555', // Color de fondo para el marcador de posición
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 80,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff', // Texto blanco para el nombre
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  currentUser: {
    backgroundColor: '#1DA1F2', // Azul para mensajes del usuario actual
    alignSelf: 'flex-end',
  },
  otherUser: {
    backgroundColor: '#333', // Gris oscuro para mensajes del otro usuario
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff', // Texto blanco para los mensajes
  },
  messageTimestamp: {
    color: '#bbb', // Texto gris para las marcas de tiempo
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
  },
  input: {
    flex: 1,
    backgroundColor: '#2c2c2c', // Fondo más oscuro para el campo de entrada
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: '#fff', // Texto blanco en el campo de entrada
  },
  sendButton: {
    backgroundColor: '#1DA1F2',
    padding: 10,
    borderRadius: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Fondo oscuro durante la carga
  },
});
