// styles/search.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,  // Ajusta para que haya un espacio desde la parte superior
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 0,
    zIndex: 1, // Asegura que el botón esté por encima de otros elementos
    marginTop: 60,
  },
  searchInput: {
    flex: 1, // Ocupa el resto del espacio disponible
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginTop: 80,
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
    flex: 1,
    justifyContent: 'center',
  },
});

export default styles;
