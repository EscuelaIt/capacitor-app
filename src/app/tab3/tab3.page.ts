import { Component, OnInit } from '@angular/core';
import { Plugins, ToastShowOptions, KeyboardInfo, Capacitor, LocalNotification } from '@capacitor/core';

const { Toast, Keyboard, LocalNotifications } = Plugins;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  isOpenKeyboard = false;

  constructor() {}

  ngOnInit() {
    this.listenersKeyBoard();
  }

  async showKeyboard() {
    await Keyboard.show();
  }

  async hideKeyboard() {
    await Keyboard.hide();
  }

  async showBottom(text: string) {
    const options: ToastShowOptions = {
      text,
      duration: 'long',
      position: 'bottom'
    };
    await Toast.show(options);
  }

  async showTop(text: string) {
    const options: ToastShowOptions = {
      text,
      duration: 'long',
      position: 'top'
    };
    await Toast.show(options);
  }

  async showCenter(text: string) {
    const options: ToastShowOptions = {
      text,
      duration: 'long',
      position: 'center'
    };
    await Toast.show(options);
  }

  private listenersKeyBoard() {
    const isAvailable = Capacitor.isPluginAvailable('Keyboard');
    if (isAvailable) {
      Keyboard.addListener('keyboardDidShow', (info: KeyboardInfo) => {
        this.isOpenKeyboard = true;
        console.log(info);
        console.log('keyboard will show with height', info.keyboardHeight);
      });
      Keyboard.addListener('keyboardDidHide', () => {
        this.isOpenKeyboard = false;
      });
    }
  }

  async scheduleNotification(title: string) {
    const notifications: LocalNotification[] = [
      {
        title,
        body: 'Body',
        id: 1,
        schedule: { at: new Date(Date.now() + 1000 * 5) },
        sound: null,
        attachments: null,
        actionTypeId: '',
        extra: null
      }
    ];
    await LocalNotifications.schedule({notifications});
    // await LocalNotifications.cancel({notifications: [{id: '1'}]});
  }

}
