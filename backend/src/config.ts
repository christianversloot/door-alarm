
require('dotenv').config();

export default {
  vapid: {
    mailto: process.env.MAILTO,
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
  },
  notif: {
    message: {
      title: process.env.NOTIF_MESSAGE_TITLE,
      body: process.env.NOTIF_MESSAGE_BODY,
    }
  },
  mqtt: {
    brokerEndpoint: process.env.MQTT_BROKER,
    topic: process.env.MQTT_TOPIC,
  },
  db: {
    folder: process.env.DB_FOLDER,
    path: process.env.DB_PATH,
  },
  port: process.env.PORT,
  authToken: process.env.AUTH_TOKEN,
}