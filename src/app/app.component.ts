import { Component } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import firebase from 'firebase';

import { Unsubscribe } from 'firebase';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage: any;



  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
  ) {
    firebase.initializeApp({
      apiKey: "AIzaSyBXDEPQ8OfM25s8u5MeaDndn5MiRhc4L3I",
      authDomain: "flyingbooks-70923.firebaseapp.com",
      databaseURL: "https://flyingbooks-70923.firebaseio.com",
      projectId: "flyingbooks-70923",
      storageBucket: "flyingbooks-70923.appspot.com",
      messagingSenderId: "892344003299"
    });


    const unsubscribe: Unsubscribe = firebase
      .auth()
      .onAuthStateChanged(user => {
        if (!user) {
          this.rootPage = 'LoginPage';   //LoginPage     AdminPage  ScanPage
          unsubscribe();
        } else {
          this.rootPage = 'ProfilePage';     //ProfilePage   ResearchBookPage   ClassementPage
          unsubscribe();
        }
      });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });



  }
}

