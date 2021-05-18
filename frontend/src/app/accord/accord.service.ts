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
    .then(sub => console.log(sub))
    .catch(err => this.showSnackbar(err));
  }

  /** Show snackbar */
  showSnackbar(message: string) {
    this.snackBar.open(message, 'OK', { duration: 3500 });
  }

}
