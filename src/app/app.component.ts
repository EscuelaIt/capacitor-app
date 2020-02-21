import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import {
  Plugins,
  NetworkStatus,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';

const { Network, PushNotifications } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private toastCtrl: ToastController
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.listenerNetwork();
    this.applyPushNotifications();
    const status = await Network.getStatus();
    await this.presentToast(`currently: ${status.connectionType}`);
  }

  initializeApp() { }

  listenerNetwork() {
    Network.addListener('networkStatusChange', (status: NetworkStatus) => {
      this.presentToast(`Network status changed: ${status.connectionType}`);
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  private async applyPushNotifications() {
    const rta = await PushNotifications.register();
    console.log(rta);

    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        console.log(token);
      }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.error(error);
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log(notification);
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log(notification);
      }
    );

  }
}
