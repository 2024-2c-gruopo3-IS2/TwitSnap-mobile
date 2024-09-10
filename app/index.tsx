import { View, StyleSheet } from "react-native";
import LoginPage from "../components/LoginPage";

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <LoginPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
