// forgotPassword.ts

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Centra verticalmente el contenido
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center', // Centra horizontalmente el logo
    marginBottom: 30,
  },
  logo: {
    width: 150,  // Ajusta el tamaño según tus necesidades
    height: 150, // Ajusta el tamaño según tus necesidades
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1A1A1A',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#1DA1F2AA', // Opacidad para indicar que está deshabilitado
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backText: {
    color: '#1DA1F2',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
