import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as webpush from 'web-push';
import * as mqtt from 'mqtt';
import config from './config';
import NotificationPayload from './interfaces/notification-payload';
import PushSubscription from './interfaces/push-subscription';
import * as sqlite from 'sqlite3';
import * as fs from 'fs';

@Injectable()
export class AppService {

  /** Private variables */
  private db: any;
  private mqttClient: mqtt.MqttClient;


  /**
   * Perform actions on service initialization.
   */
  onModuleInit() {
    // Start sqlite database
    this.db = this._provideDatabase();
    // Set webpush VAPID details
    webpush.setVapidDetails(
        config.vapid.mailto,
        config.vapid.publicKey,
        config.vapid.privateKey
    );
    // Connect to MQTT broker
    this.mqttClient  = mqtt.connect(config.mqtt.brokerEndpoint);
    // Subscribe to 'doorbell' topic
    this.mqttClient.on('connect', () => {
      this.mqttClient.subscribe('doorbell', (err) => {
        if (!err) {
          // client.publish('doorbell', 'Hello mqtt')
        }
      });
    });
    // Act on message in 'doorbell' topic
    this.mqttClient.on('message', () => this._sendPushNotification());
  }

  
  /**
   * Perform actions on module destroy.
   */
  onModuleDestroy() {
    // Close connection to mqtt client
    if (!!this.mqttClient) {
      this.mqttClient.end();
    }
    // Close connection to sqlite database
    if (!!this.db) {
      this.db.close();
    }
  }


  /**
   * Add a subscription into the database.
   */
  _addSubscriptionToDatabase(subscription: PushSubscription) {
    // Check if db is init properly
    if (!this.db) {
      throw new InternalServerErrorException('Database initialization error.');
    }
    // Add endpoint into table
    this.db.serialize(() => {
      // Run prepared statement
      this.db.run('INSERT INTO endpoints VALUES (?, ?, ?);', ['a', 'b', 'c']);
    });
  }


  /**
   * Get all Push endpoints from database.
   */
  _getPushEndpointsFromDatabase() {
    // Check if db is init properly
    if (!this.db) {
      throw new InternalServerErrorException('Database initialization error.');
    }
    // Get all endpoints from table
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all('SELECT * FROM endpoints;', (err, rows) => {
          if (!err) {
            resolve(rows);
          }
          reject(err);
        });
      })
    })
      .then((result) => result);
  }


  /**
   * Provide and populate database, if necessary.
   */
  _provideDatabase(): any {
    // Check if folder exists - make if not.
    if (!fs.existsSync(config.db.folder)) {
      fs.mkdirSync(config.db.folder);
    }
    // Load database
    const path = `${config.db.folder}/${config.db.path}`;
    const db = new sqlite.Database(path);
    // Add table if necessary
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS endpoints (endpoint TEXT, auth_key TEXT, p_key TEXT);');
    });
    // Return database
    return db;
  }


  /*
   * Get notification payload.
   */
  _getNotificationPayload(): NotificationPayload {
    return {
      notification: {
        title: config.notif.message.title,
        body: config.notif.message.body
      }
    };
  }


  /**
   * Send a push notification.
   */
  _sendPushNotification(ep: string = undefined): void {
    // Get notification payload
    const notificationPayload = this._getNotificationPayload();
    // Define subscription
    const subscription = {
      endpoint: ep,
      keys: {
        auth: config.notif.keys.auth,
        p256dh: config.notif.keys.p256dh
      }
    };
    // Send notification to Push Service
    webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
      .then((r) => r);
  }


}
