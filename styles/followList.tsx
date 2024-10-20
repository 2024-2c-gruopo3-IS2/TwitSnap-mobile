import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#000000', // Fondo completamente negro
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 90,
        color: '#B0E0E6', // Texto blanco
        marginTop: 90,
    },
    subtitle: {
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 145,
                color: '#FFFFFF', // Texto blanco
                marginTop: 90,
        },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444444', // Gris oscuro para bordes
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#444444', // Borde claro alrededor del avatar
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // Texto blanco
    },
    username: {
        fontSize: 24,
        color: '#1DA1F2', // Gris claro para username
    },
    noResultsContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    noResultsText: {
        fontSize: 16,
        color: '#CCCCCC', // Texto gris claro
    },
    noPermissionContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    noPermissionText: {
        fontSize: 16,
        color: '#CCCCCC', // Texto gris claro
    },
    rightSpace: {
        flex: 1, // Para empujar el contenido a la izquierda
    },
});
