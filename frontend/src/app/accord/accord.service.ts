import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush } from '@angular/service-worker';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

interface SubscriptionObject {
  endpoint: string;
  expirationTime?: number;
  keys: {
    auth: string;
    p256dh: string;
  }
}

interface AddSubscriptionResponse {
  endpoint: string;
  auth_key: string;
  p_key: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccordService {

  /** Private variables */
  private readonly VAPID_PUBLIC_KEY = environment.vapid_public_key;

  /**
   * Constructor
   * @param swPush - service worker Push service
   */
  constructor(
    private swPush: SwPush,
    private snackBar: MatSnackBar,
    private http: HttpClient,
  ) { }

  /**
   * Subscribe to notifications.
   */
  subscribeToNotifications(): void {
    this.showSnackbar('Enabling push notifications...', 60000);
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => {
      console.log('9');
      // Stringify keys
      const subObject: SubscriptionObject = JSON.parse(JSON.stringify(sub));
      // Add data into datastore
      this._addKeysToStore(subObject);
    })
    .catch(err => this.showSnackbar(err));
  }

  /** */
  _addKeysToStore(sub: SubscriptionObject): Subscription {
    return this.http.post(
      `${environment.backend_endpoint}/push-subscription`,
      {
        endpoint: sub.endpoint,
        authKey: sub.keys.auth,
        p256dhKey: sub.keys.p256dh,
      }
    )
      .subscribe(
        (res: AddSubscriptionResponse) => {
          return this.showSnackbar('Push notifications are now enabled.');
        },
        (error) => {
          return this.showSnackbar('Error - already enabled with this browser or backend is down.');
        }
      );
  }


  /** Show snackbar */
  showSnackbar(message: string, duration: number = 3500): void {
    this.snackBar.open(message, 'OK', { duration });
  }


}
