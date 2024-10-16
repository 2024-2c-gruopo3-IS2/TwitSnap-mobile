import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  snapContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',  // Color más oscuro para líneas divisorias en dark mode
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
    color: 'lightblue',  // Buen contraste para dark mode
  },
  email: {
    color: '#ccc',  // Gris claro para texto secundario en dark mode
    fontSize: 16,
  },
  time: {
    color: '#aaa',  // Ajustar gris para que sea más visible en dark mode
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
    color: 'white',  // Mantener blanco para texto principal
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
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',  // Asegúrate de que esté alineado correctamente
    alignItems: 'center',
    marginTop: -30,  // Asegúrate de que haya suficiente margen superior
    paddingBottom: 5,  // Añade algo de espacio en la parte inferior para que no se corte
  },
  likeButton: {
    marginRight: 8,
  },
  likeText: {
    color: '#ccc',  // Asegúrate de que el texto sea visible en el dark mode
    marginLeft: 5,
  },
  likeCount: {
    fontSize: 14,
    color: '#ccc',  // Mejorar la visibilidad del contador de likes
  },
});
