// styles/search.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro para la pantalla completa
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 55, // Espacio desde la parte superior
    marginBottom: 20,
    marginRight: 30,
  },
  sectionHeader: { // Nuevo estilo para el encabezado de la sección
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: { // Estilo para el ícono de la sección
    marginRight: 8, // Espacio entre el ícono y el texto
    marginBottom: 8,
    marginLeft: 10,
  },  
  backButton: {
    position: 'absolute',
    left: 10,
    top: 0,
    zIndex: 1, // Asegura que el botón esté por encima de otros elementos
    marginTop: 60,
  },
  searchContainer: { // Nuevo estilo para el contenedor de búsqueda
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1, // Ocupa el resto del espacio disponible
    backgroundColor: '#333', // Fondo gris oscuro para el campo de búsqueda
    color: '#fff', // Texto blanco
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25, // Bordes más redondeados para un aspecto moderno
    fontSize: 16,
    marginLeft: 80,
    marginTop: 16,
  },
  searchButton: { // Nuevo estilo para el botón de búsqueda
    marginLeft: 10, // Espacio entre el campo de búsqueda y el botón
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  content: {
    flex: 1,
    paddingBottom: 20, // Espacio inferior para evitar solapamiento con el footer
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Fondo negro mientras carga
  },
  noResultsText: {
    color: '#aaa', // Texto gris claro para mensajes de no resultados
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  section: {
    marginBottom: 20, // Espacio entre secciones
  },
  noSnapsContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noSnapsText: {
    fontSize: 16,
    color: '#888',
  },
  sectionTitle: {
    color: 'white', 
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 2,
  },
    sectionHeaderPressable: { // Nuevo estilo para el Pressable del encabezado
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Línea divisoria gris oscuro
  },
  username: {
    color: '#1DA1F2', // Color azul para los nombres de usuario
    fontSize: 16,
  },
  twitSnapContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Línea divisoria gris oscuro
  },
  twitSnapContent: {
    color: '#fff', // Texto blanco para el contenido de TwitSnap
    fontSize: 16,
  },
  sectionTitleTwitSnap: {
    color: '#1DA1F2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noHashtagsText: {
    color: '#aaa', // Texto gris claro
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  
});

export default styles;
