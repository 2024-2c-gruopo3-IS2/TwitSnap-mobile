// styles/userData.tsx

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // Título en blanco
  },
  label: {
    fontSize: 16,
    color: '#fff', // Títulos de los campos en blanco
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333', // Cajas en gris oscuro
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    color: '#fff', // Texto dentro de los inputs en blanco
  },
  submitButton: {
    backgroundColor: '#1DA1F2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff', // Texto del botón en blanco
    fontSize: 16,
    fontWeight: 'bold',
  },
});
