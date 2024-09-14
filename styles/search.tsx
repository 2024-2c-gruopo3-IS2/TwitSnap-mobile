import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
  },
  resultsContainer: {
    flex: 1,
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  backButtonContainer: {
    position: 'absolute',  
    bottom: 0,             
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#000000',  
  },
  backButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default styles;
