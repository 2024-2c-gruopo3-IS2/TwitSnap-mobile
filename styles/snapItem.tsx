// app/styles/snapItem.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  snapContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'black', 
    position: 'relative',  // Permitir que los botones superiores estén en la esquina
  },
  snapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'lightblue',
  },
  time: {
    color: 'gray',
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
    color: 'white',
  },
  actionButtonsTopRight: {
    position: 'absolute',  // Posiciona los botones en la esquina superior derecha
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#127fa4',  // Color para editar
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',  // Rojo para eliminar
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',  // Alinea el botón de like a la derecha
    alignItems: 'center',
    marginTop: 10,  // Ajusta el margen superior
  },
  likeButton: {
    marginRight: 8,
  },
  likeCount: {
    fontSize: 14,
    color: 'gray',
  },
});
