const admin = require('firebase-admin');

// Inicializa el SDK de Firebase Admin
const serviceAccount = require('./ruta/a/tu/archivo-de-clave.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://twitsnap-d3c22-default-rtdb.firebaseio.com",
});

const db = admin.database();

// Función para enviar una notificación de prueba
async function sendTestNotification(username) {
  const notificationRef = db.ref(`notifications/${username}/userNotifications`).push();

  const notificationData = {
    message: "Tienes un nuevo mensaje de prueba",
    time: Date.now(),
    type: "message",
    read: false,
    senderId: "test_sender",
    messageId: "test_msg_123",
  };

  try {
    await notificationRef.set(notificationData);
    console.log("Notificación de prueba enviada correctamente");
  } catch (error) {
    console.error("Error al enviar la notificación:", error);
  }
}

// Llamar a la función con el username de prueba
sendTestNotification("username_de_prueba");
