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
  GoogleMapsAnimation
} from '@ionic-native/google-maps';

import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import { BookProvider } from '../../providers/book/book';
import { ProfileProvider } from '../../providers/profile/profile';


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  // bookImgUrl: any;
  // bookId: any;
  // title: any;
  // releaserPseudoR: any;
  // cityReleasing: any;
  // lngReleasing: any;
  // latReleasing: any;
  //imgUrl: "assets/imgs/avatar.png";      //releaser
  // releaserPseudo: "";

 // bookReadersDataTab: any;
  bookProfile: any;
  // image: { url: string; size: any; origin: any; anchor: any; };
  cityStart: LatLng;
  bookPlacesTab: any;

  dateReleasing: Date;
  ReleasedCity: LatLng;

  map: GoogleMap;

  book: any;

  //StMalo = new LatLng(48.65, -2.0167);

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private googleMaps: GoogleMaps,
    private geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    public bookProvider: BookProvider,
    public profileProvider: ProfileProvider,

  ) {
    this.book = navParams.get('book');

    this.bookPlacesTab = navParams.get('bookReadersDataTab').reverse();
    //this.bookReadersDataTab = navParams.get('bookReadersDataTab');
    // this.releaserPseudoR = navParams.get('releaserPseudo');
    // this.imgUrl = navParams.get('imgUrl');
    // this.title = navParams.get('title');
    // this.latReleasing = navParams.get('latReleasing');
    // this.lngReleasing = navParams.get('lngReleasing');
    // this.cityReleasing = navParams.get('cityReleasing');
    // this.bookImgUrl = navParams.get('bookImgUrl');

    //from scan
    this.bookProfile = navParams.get('bookProfile');
    //this.bookId = navParams.get('bookId');


  }

  ionViewDidLoad() {
    this.dateReleasing = new Date(this.book.dateReleasing);


    if (this.bookProfile) {   //from scan
      this.book.releaserPseudo = "";
      this.book.imgUrl = "assets/imgs/avatar.png";      //releaser

      this.profileProvider.getUserProfile(this.bookProfile.releaserId).on("value", dudeProfileSnapshot => {
        let releaserProfile = dudeProfileSnapshot.val();
        //this.releaserPseudo = releaserProfile.pseudo;
        if (releaserProfile.pseudo !== "delete") {
          this.book.releaserPseudo = releaserProfile.pseudo;
        }
        console.log('this.releaserPseudo', this.book.releaserPseudo)

        if (releaserProfile.imgUrl !== undefined) {
          this.book.imgUrl = releaserProfile.imgUrl;  //      img
          console.log('this.book.imgUrl', this.book.imgUrl)
        }
      }
      );

      this.bookPlacesTab = this.bookProvider.getBookReadersIdTab(this.book.bookId);      //  !!!!! ORDRE !!!
      this.bookProvider.getBookReadersIdTab(this.book.bookId).then(value => {
        this.bookPlacesTab = value.reverse();    //du plus vieux au plus recent
        console.log('this.bookPlacesTab from scan', this.bookPlacesTab)
      });
    }

    else {    //from book
      if (this.book.releaserPseudo === "delete") {
        this.book.releaserPseudo = "";
      }

      //this.bookPlacesTab = this.bookReadersDataTab.reverse();    //du plus vieux au plus recent
      console.log('this.bookPlacesTab', this.bookPlacesTab)

    }
    //------------------recup du profilBook------------------------
    // this.bookProvider.getBookProfile(this.bookId).on("value", bookProfileSnapshot => {
    //   let bookProfile = bookProfileSnapshot.val();

    // this.title = bookProfileSnapshot.val().title;

    // this.dateReleasing = new Date(bookProfileSnapshot.val().dateReleasing);


    // let latReleased = bookProfileSnapshot.val().latReleasing;
    // let lngReleased = bookProfileSnapshot.val().lngReleasing;
    // this.ReleasedCity = new LatLng(latReleased, lngReleased);


    // this.geocoder.reverseGeocode(latReleased, lngReleased)
    //   .then((res) => {
    //     this.placeReleasing = res.locality;
    //   })

    // this.title = this.bookProfile.title;

    //this.dateReleasing = new Date(this.bookProfile.dateReleasing);


    // let latReleased = this.bookProfile.latReleasing;
    // let lngReleased = this.bookProfile.lngReleasing;


    // this.geocoder.reverseGeocode(latReleasing, lngReleasing)
    //   .then((res) => {
    //     this.placeReleasing = res.locality;
    //   })


    // })

    //--------------------recup des place reading---------------------
    //this.bookPlacesTab = this.bookProvider.getBookReadersIdTab(this.bookId);      //  !!!!! ORDRE !!!
    // this.bookProvider.getBookReadersIdTab(this.bookId).then(value => {
    // });



    this.ReleasedCity = new LatLng(this.book.latReleasing, this.book.lngReleasing);

    this.loadMap();

  }


  loadMap() {


    /* this.geolocation.getCurrentPosition()
       .then((position) => { //position*/

    let mapOptions: GoogleMapOptions = {


      camera: {
        target: this.ReleasedCity,    //latlng
        zoom: 0,    // zoom -> 0 all world, +1 -> *2 width
        tilt: 0,     // angle from the nadir (directly facing the earth)
      }
    };

    this.map = GoogleMaps.create("map", mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // releaseing Place
        this.map.addMarker({
          title: this.book.cityReleasing,
          snippet: this.book.releaserPseudo + " " + this.dateReleasing.toDateString(),
          icon: 'green',                       //change this.book.imgUrl
          animation: 'DROP',
          position: this.ReleasedCity,
          label: "a",

        })
          .then(marker => {
            // marker.on(GoogleMapsEvent.MARKER_CLICK)
            //   .subscribe(() => {
            //     alert(this.placeReleasing + ', the' + new Date(this.dateReleasing));     // !!!!!     moche !!!!!!!!!
            //   });
          });

        this.cityStart = this.ReleasedCity;

        // BOUCLE readers
        for (var i = 0; this.bookPlacesTab.length > i; i++) {
          let date = new Date(this.bookPlacesTab[i].dateReading);     // ????
          let lat = this.bookPlacesTab[i].latReading;
          let lng = this.bookPlacesTab[i].lngReading;
          let cityReading = this.bookPlacesTab[i].cityReading;
          let readerPseudo = "";
          if (this.bookPlacesTab[i].readerPseudo !== "delete") {
            readerPseudo = this.bookPlacesTab[i].readerPseudo;
          }
          let imgUrl;
          if (this.bookPlacesTab[i].imgUrl == "") {
            imgUrl = "assets/imgs/deleted.png";
          }
          else {
            imgUrl = this.bookPlacesTab[i].imgUrl;
          }


          // let img, pseudo;

          // if (this.bookPlacesTab[i].pseudo) {       //delete ou non
          //   console.log('this.bookPlacesTab[i]', this.bookPlacesTab[i])
          //   let pseudo = this.bookPlacesTab[i].readerPseudo;
          //   let img = this.bookPlacesTab[i].imgUrl;          //image pour marker
          // }

          // else {
          //   let pseudo = "";
          //   let img = "assets/imgs/deleted.png";
          // }

          // let info = 'à poil les poules';
          // this.map.                      //info windows

          // this.geocoder.reverseGeocode(lat, lng).then((res) => {
          //   let placeReading = res.locality;

          this.map.addMarker({
            title: cityReading + " " + readerPseudo,                   //  ????
            // subTitle: pseudo,
            snippet: date.toDateString(),              //   !!!!!!!!!!
            icon: {
              url: imgUrl,
              size: {
                width: 40,
                height: 40
              },

            },
            label: 'lab test',
            animation: 'DROP',
            position: { lat, lng },


          })
            .then(marker => {
              // marker.on(GoogleMapsEvent.MARKER_CLICK)
              //   .subscribe(() => {
              //     'test info';
              //     alert(placeReading);              //alert a ameliorer
              //   });
            });




          //    tracé
          let newCity = new LatLng(lat, lng);
          this.map.addPolyline({
            points: [this.cityStart, newCity],
            color: '#ff0094',
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

          });
          this.cityStart = newCity;


          /*   //saint malo
             this.map.addMarker({
               title: 'St-Malo',
               icon: 'blue',
               animation: 'DROP',
               position: this.StMalo,
             })
               .then(marker => {
                 marker.on(GoogleMapsEvent.MARKER_CLICK)
                   .subscribe(() => {
                     alert('à poil les poules');
                   });
               });
      */
        }
      });

  }


}


