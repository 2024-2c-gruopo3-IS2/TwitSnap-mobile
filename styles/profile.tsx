
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Fondo negro
        padding: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff', // Título en blanco
    },
    label: {
        fontSize: 16,
        color: '#fff', // Labels en blanco
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#333', // Cajas en gris oscuro
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
        color: '#fff', // Texto en blanco
    },
    readOnlyInput: {
        backgroundColor: '#555', // Cajas más claras en modo lectura
    },
    multilineInput: {
        height: 100, // Mayor altura para texto multiline
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#1DA1F2',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff', // Texto del botón en blanco
        fontSize: 16,
        fontWeight: 'bold',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1DA1F2',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Asegura que los elementos estén distribuidos
      paddingHorizontal: 10,
      marginBottom: 20,
      },  
});
