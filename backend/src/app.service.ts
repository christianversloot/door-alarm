import { Injectable, InternalServerErrorException, Logger, LoggerService } from '@nestjs/common';
import * as webpush from 'web-push';
import * as mqtt from 'mqtt';
import config from './config';
import NotificationPayload from './interfaces/notification-payload';
import DatabasePushSubscription from './interfaces/database-push-subscription';
import * as sqlite from 'sqlite3';
import * as fs from 'fs';
import { PushSubscriptionDto } from './dtos/push-subscription.dto';
import Utils from './utils';

@Injectable()
export class AppService {

  /** Private variables */
  private db: any;
  private mqttClient: mqtt.MqttClient;
  private readonly logger = new Logger();
  private readonly className = Utils.getClassName(this.constructor);


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
    // Subscribe to configured topic
    this.mqttClient.on('connect', () => {
      this.mqttClient.subscribe(config.mqtt.topic, (err) => {
        if (!err) {
          this.logger.log(`Subscribed to '${config.mqtt.topic}' topic at '${config.mqtt.brokerEndpoint}' - ready for sending notifications.`, this.className);
          return true;
        }
        this.logger.error(`Error subscribing to '${config.mqtt.topic}' topic: ${err}`, this.className);
      });
    });
    // Act on message in configured topic
    this.mqttClient.on('message', () => this._sendPushNotifications());
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
  _addSubscriptionToDatabase(subscription: PushSubscriptionDto): Promise<PushSubscriptionDto> {
    // Check if db is init properly
    if (!this.db) {
      this.logger.error(`Database initialized improperly, cannot add subscription.`, this.className);
      throw new InternalServerErrorException('Database initialization error.');
    }
    // Add endpoint into table
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Run prepared statement
        this.db.run('INSERT INTO endpoints VALUES (?, ?, ?);', [subscription.endpoint, subscription.authKey, subscription.p256dhKey], (error) => {
          if (!!error) {
            this.logger.error(`Error when adding subscription: ${error}`, this.className);
            reject(error);
            return false;
          }
          this.logger.log(`Successfully added subscription.`, this.className);
          resolve(true);
        });
      });
    })
      // Return subscription in POST response.
      .then(() => subscription)
      // Graceful response on error in database Promise
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });
  }


  /**
   * Get all Push Subscriptions from database.
   */
  _getPushSubscriptionsFromDatabase() {
    // Check if db is init properly
    if (!this.db) {
      this.logger.error(`Database initialized improperly, cannot retrieve subscriptions.`, this.className);
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
      db.run('CREATE TABLE IF NOT EXISTS endpoints (endpoint TEXT NOT NULL PRIMARY KEY, auth_key TEXT, p_key TEXT);');
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
   * Send notification to registered Push Subscribers
   */
  _sendPushNotifications(): void {
    this.logger.log(`Sending push notifications to subscribers.`, this.className);
    // Get registered push subscribers
    this._getPushSubscriptionsFromDatabase()
      .then((subscriptions: DatabasePushSubscription[]) => {
        this.logger.log(`Retrieved push subscriptions. Sending notification to each.`, this.className);
        const promises = [];
        // Iterate over every subscription
        for (const subscription of subscriptions) {
          // Push and resolve Promise that sends a notification
          promises.push(new Promise((resolve) => {
            this._sendPushNotification(subscription)
              .then(() => resolve(true));
          }));
        }
        // Continue when all Promises are in end state (success/fail)
        Promise.all(promises).then(() => this.logger.log(`Completed sending push notifications.`, this.className));
      })
      .catch((error) => this.logger.error(`Error sending push notifications: ${error}`, this.className));
  }


  /**
   * Send notification to registered Push Subscriber
   */
  _sendPushNotification(subscription: DatabasePushSubscription): Promise<void> {
    // Get notification payload
    const notificationPayload = this._getNotificationPayload();
    // Define Push Service payload
    const pushServicePayload = {
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.auth_key,
        p256dh: subscription.p_key
      }
    };
    // Send notification to Push Service
    return webpush.sendNotification(pushServicePayload, JSON.stringify(notificationPayload))
      .then((r) => this.logger.log(`Sent push notification.`, this.className))
      .catch((error) => this.logger.error(`Error sending push notification: ${error}`, this.className));
  }


}
