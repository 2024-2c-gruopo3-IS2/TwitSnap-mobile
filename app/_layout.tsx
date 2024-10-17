// app/_layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { PostProvider } from '@/context/postContext'; // Importa tu PostProvider
import { AuthProvider} from '@/context/authContext';

export default function Layout() {
  return (
    <AuthProvider>
      <PostProvider>
        {/* Slot renderiza la página actual bajo este layout */}
        <Slot />
      </PostProvider>
    </AuthProvider>
  );
}
