// app/tabs.tsx

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Image, StyleSheet, Text } from 'react-native';
import Feed from './feed';
import TrendingTopics from './trendingTopics';
import Footer from '@/components/footer';
const Tab = createMaterialTopTabNavigator();

function MainTabs() {
  return (
    <View style={styles.container}>
      {/* Logo en la parte superior */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/twitsnap_logo.png')}
          style={styles.logo}
        />
      </View>

      {/* Navegación de pestañas debajo del logo */}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#1DA1F2',
          tabBarInactiveTintColor: 'gray',
          tabBarIndicatorStyle: { backgroundColor: '#1DA1F2' },
          tabBarStyle: { backgroundColor: '#000' },
        }}
      >
        <Tab.Screen name="Feed" component={Feed} />
        <Tab.Screen name="Trending Topics" component={TrendingTopics} />
      </Tab.Navigator>
      {/* Footer */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop:50,
  },
  logo: {
    width: 50, // Ajusta el tamaño del logo según sea necesario
    height: 50,
    resizeMode: 'contain',
  },
});

export default MainTabs;
