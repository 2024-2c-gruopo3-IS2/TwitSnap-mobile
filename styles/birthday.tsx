import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff', // Texto blanco
    fontWeight: 'bold',
    marginBottom: 30, // Margen inferior ajustado
    marginTop: 50,
    textAlign: 'center',
  },
  picker: {
    backgroundColor: '#fff', // Fondo blanco del Picker
    color: '#000', // Texto negro del Picker (esto puede no aplicarse directamente en algunos casos)
    borderRadius: 5, // Bordes más suaves
    marginVertical: 10, // Espacio vertical entre Pickers
    height: 100, // Altura ajustada
    width: '100%', // Ancho completo
  },
  buttonContainer: {
    justifyContent: 'center', // Centrar el botón
    alignItems: 'center',
    marginTop: 30, // Margen superior ajustado
  },
  confirmButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 10, // Ajustar padding vertical
    paddingHorizontal: 20, // Ajustar padding horizontal
    borderRadius: 25,
    alignItems: 'center',
    width: '100%', // Ancho completo
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16, // Tamaño de fuente ajustado
    fontWeight: 'bold',
  },
});
