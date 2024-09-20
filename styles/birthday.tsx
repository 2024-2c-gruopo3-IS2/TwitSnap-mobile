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
  fieldTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff', // Fondo gris oscuro en lugar de blanco para los inputs
    color: '#000', // Texto blanco para visibilidad en el fondo negro
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 20, // Espacio entre inputs
  },
  dateContainer: {
    flexDirection: 'row', // Alinear los elementos en una fila
    justifyContent: 'space-between', // Espacio entre cada Picker
    marginBottom: 20,
  },
  picker: {
    backgroundColor: '#fff', // Fondo blanco del Picker
    color: '#000', // Texto negro del Picker
    borderRadius: 5,
    width: '30%', // Ajusta el ancho de cada Picker para que quepan en la misma fila
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  confirmButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1, // Permite que el contenido del ScrollView ocupe todo el espacio disponible
    paddingVertical: 20, // Añade un poco de padding vertical al contenido
  }
});
