import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'firebase/firestore';

const { Geolocation } = Plugins;

import BackgroundGeolocation, {
  Location,
  State,
  MotionChangeEvent,
  MotionActivityEvent,
  GeofenceEvent,
  Geofence,
  HttpEvent,
  ConnectivityChangeEvent
} from 'cordova-background-geolocation-lt';

declare var google;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  map;
  state: State;
  icon = 'play';
  private itemsCollection: AngularFirestoreCollection<Location>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.itemsCollection = afs.collection<Location>('locations');
  }

  ngOnInit() {
    this.getPosition();
    this.configGeolocation();
  }

  async getPosition() {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 1000
    });
    // Geolocation.watchPosition({
    //   enableHighAccuracy: true,
    //   timeout: 1000,
    // }, (location) => {
    //   console.log(location);
    // });
    this.loadMap(position.coords.latitude, position.coords.longitude);
  }

  loadMap(lat: number, lng: number) {
    const mapEle: HTMLElement = document.getElementById('map');

    this.map = new google.maps.Map(mapEle, {
      center: {lat, lng},
      zoom: 12
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.addMarker(lat, lng);
    });
  }

  addMarker(lat: number, lng: number) {
    return new google.maps.Marker({
      position: {lat, lng},
      map: this.map,
      title: 'Mi marker'
    });
  }

  private configGeolocation() {
    console.log('configGeolocation');

    BackgroundGeolocation.onLocation((location) => {
      console.log(location);
      this.itemsCollection.add(location);
    });

    BackgroundGeolocation.ready({
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 1,
      stopOnTerminate: false,
      startOnBoot: true,
      autoSync: true,
    }, (state) => {
      this.state = state;
      console.log('BackgroundGeolocation');
      console.log(this.state);
    });
  }

  toggleBackgroundGeolocation() {
    BackgroundGeolocation.start();
    // if (this.state.enabled) {
    //   BackgroundGeolocation.start();
    //   this.icon = 'stop';
    // } else {
    //   BackgroundGeolocation.stop();
    //   this.icon = 'start';
    // }
  }
}
