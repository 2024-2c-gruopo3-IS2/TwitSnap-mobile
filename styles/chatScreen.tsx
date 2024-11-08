import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#000000',  // Fondo oscuro
  },
  backButton: {
    marginBottom: 10,
    color: '#fff',
  },
  chatTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',  // Título en blanco
    marginBottom: 15,
  },
  messageList: {
    paddingBottom: 20,
  },
  messageContainer: {
    padding: 12,
    marginBottom: 15,
    borderRadius: 20,  // Bordes redondeados
  },
  sentMessage: {
    backgroundColor: '#006AFF',  // Azul para los mensajes enviados
    alignSelf: 'flex-end',
    maxWidth: '80%',
    borderRadius: 20,
  },
  receivedMessage: {
    backgroundColor: '#333',  // Fondo oscuro para los mensajes recibidos
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderRadius: 20,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B0B0B0',  // Gris claro para el nombre del remitente
  },
  messageText: {
    fontSize: 16,
    color: '#fff',  // Mensaje en blanco
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#8A8D8F',  // Timestamps en gris
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',  // Borde superior oscuro
    padding: 15,
    backgroundColor: '#1C1C1C',  // Fondo oscuro para el área de entrada
  },
  textInput: {
    flex: 1,
    padding: 12,
    borderRadius: 30,  // Bordes más redondeados
    backgroundColor: '#333',  // Fondo gris oscuro para la caja de texto
    color: '#fff',  // Texto blanco
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#006AFF',  // Azul para el botón de envío
    borderRadius: 50,  // Botón redondeado
  },
});
