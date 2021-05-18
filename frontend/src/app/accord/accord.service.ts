import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../environments/environment';

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
  ) { }

  /**
   * Subscribe to notifications.
   */
  subscribeToNotifications(): void {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => {
      console.log(sub)
      const pkey = sub.getKey('p256dh');
      const akey = sub.getKey('auth');
      //{"endpoint":"https://fcm.googleapis.com/fcm/send/d7Y_91EjI1M:APA91bGcRoJQjoWbxL_VmYDN45m6bBKD_-NOhXBQ700g9qzmmC1366fpylfYY0B4HLYG2uz7MYeeWwm5AtXHw1fxxGsOG3r-fvk-Ftgqq5LJvkKjaBzay9037dVwvFAZOHuoJw7JGS04","expirationTime":null,"keys":{"p256dh":"","auth":""}}
      console.log('keys',pkey,akey);
      return this.showSnackbar('Push notifications are now enabled.');
    })
    .catch(err => this.showSnackbar(err));
  }

  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

  /** Show snackbar */
  showSnackbar(message: string) {
    this.snackBar.open(message, 'OK', { duration: 3500 });
  }

}
