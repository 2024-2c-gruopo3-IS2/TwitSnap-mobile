import React from 'react';
import { View, Pressable } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import styles from '../styles/footer';

const Footer = () => {
  const pathname = usePathname();

  return (
    <View style={styles.footer}>
      {/* Home Icon */}
      <Link href="/feed" asChild>
        <Pressable>
          <MaterialIcons
            name="home"
            size={30}
            color={pathname === '/feed' ? '#808080' : '#FFFFFF'}
          />
        </Pressable>
      </Link>

      {/* Search Icon */}
      <Link href="/search" asChild>
        <Pressable>
          <Ionicons
            name="search"
            size={30}
            color={pathname === '/search' ? '#808080' : '#FFFFFF'}
          />
        </Pressable>
      </Link>

      {/* Profile Icon */}
      <Link href="/profile" asChild>
        <Pressable>
          <FontAwesome
            name="user"
            size={30}
            color={pathname.startsWith('/profile') ? '#808080' : '#FFFFFF'}
          />
        </Pressable>
      </Link>
    </View>
  );
};

export default Footer;
