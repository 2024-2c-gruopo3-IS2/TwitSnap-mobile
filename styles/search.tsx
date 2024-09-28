import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
    paddingHorizontal: 10,
    justifyContent: 'space-between', // Asegura que el footer esté al final
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 20,
    marginTop: 60,

  },
  backButtonContainer: {
    marginRight: 10, // Espacio entre el botón de volver y el campo de búsqueda
  },
  searchInput: {
    flex: 1, // Ocupa el resto del espacio disponible
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  userContainer: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#444',
  },
  username: {
      color: '#1DA1F2',
      fontSize: 16,
  },
  noResultsText: {
      color: '#aaa',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
  },
  loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
  },
  content: {
    flex: 1, // Ocupa el espacio disponible entre el header y el footer
    justifyContent: 'center', // Centra el contenido cuando no hay resultados
  },
});

export default styles;
