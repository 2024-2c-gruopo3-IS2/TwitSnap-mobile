// app/_layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { PostProvider } from '@/context/postContext'; // Importa tu PostProvider

export default function Layout() {
  return (
      <PostProvider>
        {/* Slot renderiza la página actual bajo este layout */}
        <Slot />
      </PostProvider>
  );
}
