import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Fondo negro
        alignItems: 'center',
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
});
