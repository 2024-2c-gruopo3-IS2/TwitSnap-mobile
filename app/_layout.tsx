// // app/_layout.tsx
// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Slot, usePathname } from 'expo-router';
// import Footer from '../components/footer'; // Asegúrate de que la ruta sea correcta

// const Layout: React.FC = () => {
//   const pathname = usePathname();

//   // Definir las rutas donde se mostrará el Footer
//   const rutasConFooter = ['/feed', '/search', '/notifications'];

//   // Determinar si el Footer debe mostrarse en la ruta actual
//   const showFooter = rutasConFooter.includes(pathname);

//   return (
//     <View style={styles.container}>
//       <View style={styles.content}>
//         <Slot /> {/* Renderiza el contenido de la página actual */}
//       </View>
//       {showFooter && <Footer />} {/* Renderiza el Footer si corresponde */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000', // Fondo de la aplicación
//   },
//   content: {
//     flex: 1,
//     // Asegura que el contenido no quede oculto detrás del Footer
//     paddingBottom: 60, // Altura del Footer
//   },
// });

// export default Layout;
