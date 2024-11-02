// styles/login.tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    height: 120,
    width: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: 'black',
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#555',
  },
  orText: {
    color: 'white',
    marginHorizontal: 8,
  },
  input: {
    backgroundColor: 'black',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    color: 'white',
    padding: 12,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButton: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 8,
    borderWidth: 0.001,
    borderColor: 'white',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButtonText: {
    color: 'white',
  },
  signupContainer: {
    alignItems: 'center',
  },
  signupText: {
    color: '#aaa',
  },
  signupLink: {
    color: '#1DA1F2',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: 'white',
  },
  passwordVisibilityButton: {
    padding: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 16,

  },
  forgotPasswordText: {
    color: '#1DA1F2',
  },
});

export default styles;
