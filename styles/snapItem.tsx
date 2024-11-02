// snapItem.tsx (Estilos)

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  snapContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: 'black',
    position: 'relative',
  },
  snapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1DA1F2',
  },
  time: {
    color: '#aaa',
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
    color: 'white',
  },
  actionButtonsTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#127fa4',
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Distribuye los botones de "favorito" y "me gusta" en extremos opuestos
    alignItems: 'center',
    marginTop: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    marginRight: 8,
  },
  likeCount: {
    fontSize: 14,
    color: '#ccc',  // Color para el contador de likes
  },
  favouriteContainer: {
    flex: 1,  // Ocupa el espacio disponible para centrar el botón
    alignItems: 'center',  // Centra horizontalmente el botón de favorito
  },
  favouriteButton: {
    marginLeft: 200,
  },
  shareButton: {
    marginLeft: 10,
  },
});
