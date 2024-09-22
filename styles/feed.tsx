import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    fontSize: 16,
  },
  snapContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  snapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    color: '#1DA1F2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    color: '#aaa',
    fontSize: 12,
  },
  content: {
    color: '#fff',
    fontSize: 16,
  },
  noResultsText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50, // Ajusta el tamaño del logo
    height: 50,
    resizeMode: 'contain',
  },
});

