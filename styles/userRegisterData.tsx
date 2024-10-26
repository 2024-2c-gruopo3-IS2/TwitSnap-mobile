import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
    padding: 20,
    color: '#000'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // Título en blanco
    marginTop: 60,
  },
  logo: {
    width: 50, // Ajusta el tamaño del logo
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: -40,
  },
  label: {
    fontSize: 16,
    color: '#fff', // Títulos de los campos en blanco
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#333', // Cajas en gris oscuro
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#fff', // Texto dentro de los inputs en blanco
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  datePicker: {
    flex: 1,
    backgroundColor: '#333',
    color: 'black', // Texto blanco en los pickers
    fontWeight: 'bold',
    marginHorizontal: 5,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#1DA1F2', // Botón azul
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff', // Texto del botón en blanco
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  picker: {
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 15,
  },
  subLabel: {
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center', // Centra el texto horizontalmente
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateColumn: {
    flex: 1,
    marginHorizontal: 5,
    textAlign: 'center', // Asegura que el contenido dentro del picker esté centrado
    textAlignVertical: 'center',
  },
    scrollContainer: {
    flexGrow: 1, // Permite que el contenido se expanda
    backgroundColor: '#000', 
    color: '#000',
  },

});
