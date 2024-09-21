import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  pickerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  picker: {
    backgroundColor: '#333', // Fondo oscuro para el picker
    color: '#fff', // Texto claro en el picker
    width: '100%', // Ancho del picker
    padding: 10, // Padding interno del picker
    marginVertical: 10, // Espaciado vertical
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },
  countryButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCountry: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

