// profileView.ts (actualizado)
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: -10,
        justifyContent: 'space-between',
    },
    headerContainer: {
        position: 'absolute',
        top: 40,
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
    snapTitle:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        flex: 1,
        marginTop: 20,
    },
    rightSpace: {
        width: 40,
    },
    coverPhoto: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    }, 
    name: {
        marginTop: 50,
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
    favouriteSnapsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFA500',
        paddingVertical: 8,  // Reducir el tamaño del botón
        paddingHorizontal: 15,  // Ajustar horizontalmente para mejor tamaño
        borderRadius: 5,
        marginHorizontal: 5,  // Espacio uniforme entre botones
        justifyContent: 'center',
        minWidth: 90,  // Fijar un tamaño mínimo para uniformidad
        flex: 1,
    },
    favouriteSnapsButtonText: {
        color: '#fff',
        fontSize: 16,
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
        flex: 1, // Deja que el contenido ocupe el espacio disponible
        justifyContent: 'center', // Centra el texto en el contenido
        alignItems: 'center',
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
        paddingTop: 10,
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
    profileActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', // Centrar los botones en la fila
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d11a2a',
        paddingVertical: 8,  // Reducir el tamaño del botón
        paddingHorizontal: 15,  // Ajustar horizontalmente para mejor tamaño
        borderRadius: 5,
        marginHorizontal: 5,  // Espacio uniforme entre botones
        justifyContent: 'center',
        minWidth: 90,  // Fijar un tamaño mínimo para uniformidad
        flex:1,
    },
    logoutButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontSize: 16,
        justifyContent: 'center',
    },
    followButton: {
        alignSelf: 'center',
        marginVertical: 10,
    },
    followButtonStyle: {
        backgroundColor: '#1DA1F2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    unfollowButton: {
        backgroundColor: '#E0245E',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    followButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#127fa4',
        paddingVertical: 8,  // Reducir el tamaño del botón
        paddingHorizontal: 15,  // Ajustar horizontalmente para mejor tamaño
        borderRadius: 5,
        marginHorizontal: 5,  // Espacio uniforme entre botones
        justifyContent: 'center',
        minWidth: 90,  // Fijar un tamaño mínimo para uniformidad
        flex: 1,
    },
    editProfileButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    description: {
        fontSize: 16,
        color: '#aaa', 
        textAlign: 'center',
        marginTop: 10, 
        paddingHorizontal: 20, 
    },
    errorTextLarge: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        marginBottom: 20,
    },
    headerGradient: {
        padding: 20,
        alignItems: 'center',
      },
      profilePictureContainer: {
        position: 'absolute',
        top: 100,
        left: '50%',
        transform: [{ translateX: -65 }],
        borderWidth: 3,
        borderColor: '#fff',
        borderRadius: 75,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    profilePicture: {
        width: 130,
        height: 130,
        borderRadius: 65,
    },
    accessoryContainer: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        zIndex: 10, // Asegura que el accesorio esté al frente de todo
    },

    chatButton: {
        backgroundColor: '#1DA1F2',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 50,
        maxWidth: 50,
        minHeight: 50,
        maxHeight: 50,
        marginHorizontal:30,
      },

    chatButtonText: {
        color: '#fff',
        fontSize: 16,
    },

    actionContainer: {
        flexDirection: 'row', // Organiza los botones en una fila
        alignItems: 'center', // Alinea los botones verticalmente en el centro
        justifyContent: 'center', // Centra los botones horizontalmente
        marginTop: 20, // Espacio superior para el contenedor
      },
      
    
});
