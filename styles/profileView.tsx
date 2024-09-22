import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Fondo negro
        paddingTop: 20,
    },
    headerContainer: {
        position: 'absolute',
        top: 20, // Ajusta según tus necesidades
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        zIndex: 2, // Asegura que el header esté por encima de la foto de portada
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        flex: 1,
    },
    rightSpace: {
        width: 40, // Igual al tamaño del BackButton para balancear
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
        backgroundColor: '#000', // Para asegurar que el borde se vea bien
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
    },
    username: {
        fontSize: 18,
        color: '#aaa',
    },
    followContainer: {
        flexDirection: 'row',
        marginTop: 20,
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
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1DA1F2',
        padding: 10,
        borderRadius: 5,
        marginTop: 30,
    },
    editButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontSize: 16,
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
        paddingVertical: 15, // Solo padding vertical para mantener la separación arriba y abajo
        paddingHorizontal: 0, // Elimina el padding horizontal
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        width: '100%', // Asegura que el contenedor del snap ocupe todo el ancho
        alignItems: 'baseline',
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
        flexGrow: 1, // Permite que FlatList ocupe el espacio restante
        paddingHorizontal:0,
        width:'100%',
        alignSelf:'stretch',
    },
    noResultsContainer: {
        flex: 1, // Ocupa el espacio restante
        justifyContent: 'center', // Centra verticalmente
        alignItems: 'center', // Centra horizontalmente
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
        alignItems: 'center', // Aquí
        justifyContent: 'flex-start', // Aquí
        padding: 16,
        flex: 1,
        backgroundColor: '#000', // Fondo negro
        paddingTop: 20,
    },
});
