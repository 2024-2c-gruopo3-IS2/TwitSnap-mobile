<div align="center">
  <img src="assets/images/twitsnap_logo.png" alt="TwitSnap Logo" width="200">
</div>

# TwitSnap: La nueva forma de compartir pensamientos

Esta plataforma digital permitirá a los usuarios compartir ideas, noticias y pensamientos en mensajes cortos, establecer conexiones con otros usuarios y seguir su progreso a lo largo del tiempo. El objetivo principal de TwitSnap es brindar una comunidad interactiva en la cual los usuarios puedan conectarse entre sí, compartir contenido relevante y lograr sus objetivos individuales en un entorno social enriquecedor.

---

## 📱 Instalación y Configuración

### Requisitos
1. **Node.js**: Recomendado `>= 14.x`
2. **Expo CLI**: Instalado globalmente o mediante `npx`
3. **EAS CLI**: Instalado globalmente (`npm install -g eas-cli`)

### Pasos para Iniciar la Aplicación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/2024-2c-gruopo3-IS2/mobile-front
   cd twitsnap
2. Instalar las dependencias:
    ```bash
    npm install
    ```
3. Iniciar la aplicación en Expo Go:
    ```bash
    npx expo start --go
    ```
4. Iniciar en modo Development:
    ```bash
    npx expo start
    ```

### Compilación de la Aplicación

1. Para generar un archivo .aab (Android App Bundle):
    ```bash
    eas build
    ```
2. Para generar un archivo .apk (Android):
    ```bash
    eas build --platform android --profile production
    ```

# 🌟 TwitSnap: Características Principales

## Historias de Usuario Implementadas

### Registro y Login:
- Registro de usuarios y administradores.
- Login con email, contraseña y proveedores de identidad federada (Google, Apple).
- Notificación de PIN para confirmar registro.
- Recuperación de contraseña.

### Perfil:
- Edición y visualización de perfil.
- Certificación de perfiles reconocidos.

### Interacciones:
- Publicación de TwitSnaps.
- Me gusta (Likes), SnapShares, y menciones a otros usuarios.
- Gestión de favoritos.
- Seguimiento y visualización de seguidores/seguidos.

### Explorar y Descubrir Contenido:
- Búsqueda por texto, hashtags y usuarios.
- Trending Topics.
- Recomendación de cuentas.

### Mensajes y Directos:
- Mensajes directos entre usuarios.

### Notificaciones:
- Notificaciones por nuevos mensajes, trending TwitSnaps, directos, y logros de seguidores.


---


## 🚀 Guía de Usuario
### Registro
- Completa los campos de nombre, correo electrónico y contraseña.
Recibirás un PIN por correo para verificar tu cuenta.
- Crear y Publicar TwitSnaps
- En el feed, selecciona el botón "Crear TwitSnap".
- Escribe tu mensaje (máximo 280 caracteres).
- Publica tu TwitSnap como público o privado.
### Interacciones
- Me gusta: Presiona el ícono de corazón.
- SnapShare: Selecciona el botón de compartir.
- Menciones: Escribe @usuario para mencionar a alguien.
### Exploración
- Busca usuarios, hashtags o contenido mediante la barra de búsqueda.
- Consulta los Trending Topics para descubrir los temas más relevantes.
### Mensajes Directos
- Ve al perfil de un usuario.
- Haz clic en "Enviar mensaje".
- Inicia una conversación en tiempo real.


##  🧑‍💻 Tecnologías Utilizadas
- Frontend: React Native, Expo
- Backend: Firebase, MongoDB, PostgreSQL
- Estilo: react-native-paper, material UI
- Compilación: EAS Build


## 🖥️ Estructura del Proyecto

```plaintext
├── README.md
├── app
│   ├── _layout.tsx
│   ├── accountStatistics.tsx
│   ├── chat.tsx
│   ├── chatItem.tsx
│   ├── chatItemSearch.tsx
│   ├── chatMessage.tsx
│   ├── chats.tsx
│   ├── confirmPin.tsx
│   ├── customTextInput.tsx
│   ├── favouriteSnapsView.tsx
│   ├── feed.tsx
│   ├── followers.tsx
│   ├── following.tsx
│   ├── forgotPassword.tsx
│   ├── index.tsx
│   ├── interests.tsx
│   ├── location.tsx
│   ├── login.tsx
│   ├── newChat.tsx
│   ├── notifications.tsx
│   ├── profileCertificationRequest.tsx
│   ├── profileEdit.tsx
│   ├── profileView.tsx
│   ├── search.tsx
│   ├── searchBar.tsx
│   ├── setProfileImagePage.tsx
│   ├── signup.tsx
│   ├── specificChat.tsx
│   ├── tabs.tsx
│   ├── topicDetail.tsx
│   ├── trendingTopics.tsx
│   ├── twitSnapsStatistics.tsx
│   └── userRegisterData.tsx
├── app.json
├── assets
│   ├── fonts
│   │   └── SpaceMono-Regular.ttf
│   └── images
│       ├── favicon.png
│       ├── fiuba_sticker.png
│       ├── google.png
│       ├── icon.png
│       ├── placeholder_user.jpg
│       └── twitsnap_logo.png
├── babel.config.js
├── clear
├── components
│   ├── backButton.tsx
│   ├── createPostModal.tsx
│   ├── editPostModal.tsx
│   ├── editSnapModal.tsx
│   ├── footer.tsx
│   ├── snapItem.tsx
│   └── userList.tsx
├── context
│   ├── authContext.tsx
│   ├── notificationContext.tsx
│   └── postContext.tsx
├── eas.json
├── expo-env.d.ts
├── firebaseConfig.ts
├── functions
│   ├── countUnreadMessage.tsx
│   ├── generateUserEmailId.tsx
│   └── markMessagesAsRead.tsx
├── google-services.json
├── handlers
│   ├── authTokenHandler.tsx
│   ├── followHandler.tsx
│   ├── loginHandler.tsx
│   ├── notificationHandler.tsx
│   ├── postHandler.tsx
│   ├── profileHandler.tsx
│   └── signUpHandler.tsx
├── helper
│   └── registrationStorage.tsx
├── local.properties
├── metro.config.js
├── package-lock.json
├── package.json
├── refresh.py
├── release-key.keystore
├── scripts
│   └── reset-project.js
├── styles
│   ├── confirmPin.tsx
│   ├── createPostModal.tsx
│   ├── favouriteSnapsView.tsx
│   ├── feed.tsx
│   ├── followList.tsx
│   ├── footer.tsx
│   ├── forgotPassword.tsx
│   ├── interests.tsx
│   ├── location.tsx
│   ├── login.tsx
│   ├── modalStyles.tsx
│   ├── notifications.tsx
│   ├── profile.tsx
│   ├── profileEdit.tsx
│   ├── profileView.tsx
│   ├── search.tsx
│   ├── signup.ts
│   ├── snapItem.tsx
│   ├── userList.tsx
│   └── userRegisterData.tsx
└── tsconfig.json
```

##  🌐 GitHub Pages
La guía de usuario también está disponible en GitHub Pages.


##  📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.


