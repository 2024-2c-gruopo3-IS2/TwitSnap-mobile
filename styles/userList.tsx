import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    listContainer: {
        padding: 16,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,  // Aumentar el margen inferior
        paddingVertical: 12, // Aumentar el padding vertical
        borderBottomWidth: 1,
        borderBottomColor: '#333', // Línea sutil en tema oscuro
    },
    avatar: {
        width: 60, // Aumentar el tamaño del avatar
        height: 60,
        borderRadius: 30,
        marginRight: 16, // Aumentar el margen a la derecha
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 18, // Aumentar el tamaño de fuente
        fontWeight: 'bold',
        color: '#1DA1F2', // Texto claro para contraste
    },
    username: {
        fontSize: 16, // Aumentar el tamaño de fuente
        color: '#1DA1F2', // Texto más claro para nombres de usuario
    },
    profileImageOnFeed: {
        width: 50, // Aumentar el tamaño de la imagen de perfil en el feed
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
});