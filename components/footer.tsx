import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import styles from '../styles/footer'; // Asegúrate de tener el estilo en un archivo CSS adecuado

const Footer = () => {
  return (
    <View style={styles.footer}>
      {/* Home Icon */}
      <Link href="/feed" asChild>
        <Pressable>
          <Image
            source={{ uri: 'https://img.icons8.com/?size=100&id=O4uwtuMQi925&format=png&color=FFFFFF' }}
            style={styles.footerIcon}
          />
        </Pressable>
      </Link>

      {/* Search Icon */}
      <Link href="/search" asChild>
        <Pressable>
          <Image
            source={{ uri: 'https://img.icons8.com/?size=100&id=2sWrwEXiaegS&format=png&color=FFFFFF' }}
            style={styles.footerIcon}
          />
        </Pressable>
      </Link>

      {/* Profile Icon */}
      <Link href="/profile" asChild>
        <Pressable>
          <Image
            source={{ uri: 'https://img.icons8.com/?size=100&id=59719&format=png&color=FFFFFF' }}
            style={styles.footerIcon}
          />
        </Pressable>
      </Link>
    </View>
  );
};

export default Footer;
