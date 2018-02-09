import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  LatLng,
  GoogleMapsAnimation,
  Polyline
} from '@ionic-native/google-maps';

import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-map-user',
  templateUrl: 'map-user.html',
})
export class MapUserPage {
  markerTabRead=[];
  markerTabReleased= [];
  lineTabRead = [];
  lineTabReleased = [];
  releasedTab: any;
  readTab: any;
  user: any;

  releasedOn = true;
  readOn = true;

  map: GoogleMap;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private googleMaps: GoogleMaps,
    private geolocation: Geolocation,
    public geocoder: NativeGeocoder,
  ) {

    this.user = navParams.get('user');
    this.readTab = navParams.get('readTab').reverse();
    this.releasedTab = navParams.get('releasedTab').reverse();


  }

  ionViewDidLoad() {

    this.loadMap();
  }

  releasedOnOff() {
    if (this.releasedOn) {
      this.releasedOn = false;  
      for (let i = 0; i < this.markerTabReleased.length; i++) {
        this.markerTabReleased[i].setVisible(false);
      }
      for (let i = 0; i < this.lineTabReleased.length; i++) {
        this.lineTabReleased[i].setVisible(false);
      }
    }
    else {
      this.releasedOn = true;
      for (let i = 0; i < this.markerTabReleased.length; i++) {
        this.markerTabReleased[i].setVisible(true);
      }
      for (let i = 0; i < this.lineTabReleased.length; i++) {
        this.lineTabReleased[i].setVisible(true);
      }
    }
  }

  readOnOff() {
    if (this.readOn) {
      this.readOn = false;
      for (let i = 0; i < this.markerTabRead.length; i++) {
        this.markerTabRead[i].setVisible(false);
      }
      for (let i = 0; i < this.lineTabRead.length; i++) {
        this.lineTabRead[i].setVisible(false);
      }
    }
    else {
      this.readOn = true;
      for (let i = 0; i < this.markerTabRead.length; i++) {
        this.markerTabRead[i].setVisible(true);
      }
      for (let i = 0; i < this.lineTabRead.length; i++) {
        this.lineTabRead[i].setVisible(true);
      }
    }
  }


  loadMap() {
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: new LatLng(48.65, -2.0167),    //latlng    st malo  .............
        zoom: 0,    // zoom -> 0 all world, +1 -> *2 width
        tilt: 0,     // angle from the nadir (directly facing the earth)
      }
    };

    this.map = GoogleMaps.create("map", mapOptions);

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        this.getReleasedMarkers();
        this.getReadMarker()
      })
  }


  // BOUCLE released
  getReleasedMarkers() {
    let cityStartReleased = new LatLng(this.releasedTab[0].latReleasing, this.releasedTab[0].lngReleasing);  //tracé de 0 à 0 pour commencer..
    console.log('releasedTab', this.releasedTab)

    for (var i = 0; this.releasedTab.length > i; i++) {
      let date = new Date(this.releasedTab[i].dateReleasing);     // ????
      let lat = this.releasedTab[i].latReleasing;
      let lng = this.releasedTab[i].lngReleasing;
      let city = this.releasedTab[i].cityReleasing;
      let title = this.releasedTab[i].title;
      let imgUrl = this.releasedTab[i].bookImgUrl;


      this.map.addMarker({
        title: title,                   //  ????
        snippet: city + " - " + date.toDateString(),              //   !!!!!!!!!!
        icon: {
          url: imgUrl,
          size: {
            width: 30,
            height: 40
          },
        },
        label: 'lab test',
        animation: 'DROP',
        position: { lat, lng },
      })
        .then(marker => {
          this.markerTabReleased.push(marker);
        });

      //    tracé
      let newCity = new LatLng(lat, lng);
      this.map.addPolyline({
        points: [cityStartReleased, newCity],
        color: 'blue',
        width: 10,
        geodesic: true,
        icons: [{
          offset: '10%',
          repeat: '10%',
          icon: {
            fillColor: 'yellow',
            path: 'FORWARD_CLOSED_ARROW	',
          }
        }]

      }).then(value => {
        console.log('value', value);
        this.lineTabReleased.push(value);
      });
      cityStartReleased = newCity;
    }
  }
  //------------------------------------------------------------------------------------

  // BOUCLE read
  getReadMarker() {
    let cityStartRead = new LatLng(this.readTab[0].latReading, this.readTab[0].lngReading);  //tracé de 0 à 0 pour commencer..
    console.log('releasedTab', this.readTab)
    for (var j = 0; this.readTab.length > j; j++) {
      let date = new Date(this.readTab[j].dateReading);     // ????
      let lat = this.readTab[j].latReading;
      let lng = this.readTab[j].lngReading;
      let city = this.readTab[j].cityReading;
      let title = this.readTab[j].title;
      let imgUrl = this.readTab[j].bookImgUrl;

      this.map.addMarker({
        title: title,                   //  ????
        snippet: city + " - " + date.toDateString(),              //   !!!!!!!!!!
        icon: {
          url: imgUrl,
          size: {
            width: 30,
            height: 40
          },
        },
        label: 'lab test',
        animation: 'DROP',
        position: { lat, lng },
      })
        .then(marker => {
          this.markerTabRead.push(marker);
        });

      //    tracé
      let newCity = new LatLng(lat, lng);
      this.map.addPolyline({
        points: [cityStartRead, newCity],
        color: 'red',
        width: 10,
        geodesic: true,
        icons: [{
          offset: '10%',
          repeat: '10%',
          icon: {
            fillColor: 'yellow',
            path: 'FORWARD_CLOSED_ARROW	',
          }
        }]
      }).then(value => {
        this.lineTabRead.push(value);
      });
      cityStartRead = newCity;
    }
  }




}
