import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    username: {
        fontSize: 14,
        color: '#555',
    },
    noResultsContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    noResultsText: {
        fontSize: 16,
        color: '#555',
    },
    noPermissionContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    noPermissionText: {
        fontSize: 16,
        color: '#555',
    },
});
