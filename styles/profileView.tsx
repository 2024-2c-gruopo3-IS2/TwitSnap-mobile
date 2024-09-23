// profileView.ts (actualizado)
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 20,
    },
    headerContainer: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        zIndex: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        flex: 1,
    },
    rightSpace: {
        width: 40,
    },
    coverPhoto: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    profilePictureContainer: {
        position: 'absolute',
        top: 150,
        left: '50%',
        transform: [{ translateX: -50 }],
        borderWidth: 3,
        borderColor: '#fff',
        borderRadius: 75,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        marginTop: 60,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    username: {
        fontSize: 18,
        color: '#aaa',
        textAlign: 'center',
    },
    followContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
    },
    followSection: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    followNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    followLabel: {
        fontSize: 16,
        color: '#aaa',
    },
    editButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontSize: 16,
        justifyContent: 'center',
    },
    actionText: {
        color: '#fff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    snapContainer: {
        flexDirection: 'row', // Organiza contenido y botones en una fila
        justifyContent: 'space-between', // Espacia el contenido y los botones
        alignItems: 'flex-start', // Alinea los elementos al inicio verticalmente
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        width: '100%',
    },
    snapContent: {
        flex: 1, // Toma el espacio restante
        paddingRight: 10, // Espacio para los botones
    },
    snapHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    content: {
        color: '#fff',
        fontSize: 16,
    },
    time: {
        color: '#aaa',
        fontSize: 12,
    },
    flatListContent: {
        flexGrow: 1,
        paddingHorizontal: 0,
        width: '100%',
        alignSelf: 'stretch',
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultsText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    tweetsTitle: {
        paddingVertical: 15,
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
        width: '100%',
    },
    snapsList: {
        flexGrow: 1,
        width: '100%',
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 20,
    },
    actionButtons: {
        flexDirection: 'column', // Organiza botones en una columna
        alignItems: 'flex-end', // Alinea los botones al final (derecha)
    },
    icon: {
        textAlign: 'center', // Centra el icono dentro del botón
        justifyContent: 'center',
        alignSelf: 'center',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1DA1F2', // Color del botón de editar
        padding: 10,
        borderRadius: 5,
        minWidth: 45,
        minHeight: 45,
        justifyContent: 'center', // Centra el contenido horizontalmente
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center', // Alinea el icono verticalmente
        backgroundColor: '#d11a2a', 
        borderRadius: 5,
        minWidth: 45,
        minHeight: 45,
        justifyContent: 'center', // Centra el contenido horizontalmente
    },
    profileActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d11a2a', // Rojo para indicar peligro/acción destructiva
        padding: 10,
        borderRadius: 5,
        marginLeft: 10, // Espacio entre el botón de editar y cerrar sesión
        minWidth: 45,
        minHeight: 45,
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontSize: 16,
        justifyContent: 'center',
    },
});
