import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Plugins, CameraResultType, ShareOptions } from '@capacitor/core';

const { Camera, Share, Network } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  photos: SafeResourceUrl[] = [];

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    const finalImg = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
    this.photos.push(finalImg);
  }

  async share() {
    try {
      const options: ShareOptions = {
        title: 'Curso de Ionic Capacitor',
        url: 'https://escuela.it/cursos/curso-ionic-capacitor',
        dialogTitle:  'Curso de Ionic Capacitor',
        text: 'Crear increljdhfkldjfl'
      };
      await Share.share(options);
    } catch (error) {
      console.error(error);
    }
  }

}
