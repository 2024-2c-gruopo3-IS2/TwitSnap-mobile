import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    listContainer: {
        padding: 16,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333', // Línea sutil en tema oscuro
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF', // Texto claro para contraste
    },
    username: {
        fontSize: 14,
        color: '#blue', // Texto más claro para nombres de usuario
    },
});
