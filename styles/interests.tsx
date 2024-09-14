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
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888', // Texto gris
    marginBottom: 20,
    textAlign: 'center',
  },
  interesesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  interesButton: {
    backgroundColor: '#333',
    padding: 10,
    margin: 5,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  interesButtonSelected: {
    backgroundColor: '#1DA1F2', // Color azul para selección
  },
  interesButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#1DA1F2',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
