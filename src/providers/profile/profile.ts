import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import firebase from 'firebase';
import { BookProvider } from '../book/book';
import { NativeGeocoder } from '@ionic-native/native-geocoder';


@Injectable()
export class ProfileProvider {

  public userProfile: firebase.database.Reference;
  public currentUser: firebase.User;
  public userId: string;

  constructor(public http: HttpClient,
    public bookProvider: BookProvider,
    public geocoder: NativeGeocoder,
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        console.log(this.currentUser);
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
        console.log(this.userProfile);

        // userBookReleased sous forme d'une REF
        // this.userBookReleasedRef = firebase.database().ref(`/userProfile/${user.uid}/released`);

        // userBookRead sous forme d'une REF
        // this.userBookReadRef = firebase.database().ref(`/userProfile/${user.uid}/read`);

        this.userId = user.uid;
      }
    });
  }

  //---------------------------------------PROFILE----------------------------
  getUserProfile(userId) {
    console.log("getUserprofile")
    return firebase.database().ref(`/userProfile/${userId}`);
  }


  getUserId() {
    return this.userId;
  };

  //-------------------------------------RELEASED------------------------------
  async getUserBookReleasedIdTab(userId) {
    let userBookReleasedIdTab = [];
    await firebase.database().ref(`/userProfile/${userId}/released`).once('value', (snapshot) => {  //////////once
      console.log('snapshot first released', snapshot)
      // userBookReleasedIdTab = [];
      snapshot.forEach(snap => {
        userBookReleasedIdTab.push(snap.val());
        return false;
      })
    });
    return (userBookReleasedIdTab);
  }

  async getUserBookReleasedDataTab(userId) {
    let userBookReleasedIdTab = [];
    let userBookReleasedDataTab = [];
    let userBookReleasedData, img, nbLike, nbreaders, dist, dateReleasing, cityReleasing, latReleasing, lngReleasing, bookId, nbComments, placeReleasing, countryReleasing, ccReleasing;

    //recup des book released Id Tab
    await this.getUserBookReleasedIdTab(userId).then(tab => {
      userBookReleasedIdTab = tab;
    })

    for (var i = 0; userBookReleasedIdTab.length > i; i++) {

      await this.bookProvider.getBookProfile(userBookReleasedIdTab[i]).once("value", (snapshot) => {
        userBookReleasedData = snapshot.val();

        latReleasing = userBookReleasedData.latReleasing;
        lngReleasing = userBookReleasedData.lngReleasing;
        bookId = snapshot.key;                      //feinte !!!
        nbComments = snapshot.child('comments').numChildren();
        nbreaders = snapshot.child('readers').numChildren();
        nbLike = snapshot.child('likers').numChildren();

        if (userBookReleasedData.bookImgUrl !== undefined) {   //img
          img = userBookReleasedData.bookImgUrl;
        }
        else {
          img = "assets/imgs/book-cover.png";
        }
      })

      await this.geocoder.reverseGeocode(latReleasing, lngReleasing)
        .then((res) => {
          cityReleasing = res.locality;
          placeReleasing = res.administrativeArea;
          countryReleasing = res.countryName;
          ccReleasing = res.countryCode.toLowerCase();
        });

      await userBookReleasedDataTab.push({
        latReleasing: latReleasing,
        lngReleasing: lngReleasing,
        bookId: bookId,
        title: userBookReleasedData.title,
        author: userBookReleasedData.author,
        like: nbLike,
        nbComments: nbComments,
        cityReleasing: cityReleasing,
        placeReleasing: placeReleasing,
        countryReleasing: countryReleasing,
        flagReleasing: "assets/flag-icon-css/flags/4x3/" + ccReleasing + ".svg",
        dateReleasing: userBookReleasedData.dateReleasing,
        bookImgUrl: img, //img
        dist: userBookReleasedData.dist,
        nbReaders: nbreaders,

      });
    }
    console.log('userBookReleasedDataTab to sent', userBookReleasedDataTab)

    return await userBookReleasedDataTab.sort((n1, n2) => n2.dateReleasing - n1.dateReleasing);           //plus recent au plus vieux
  }



  //----------------------------------------------READ------------------------------------
  async getUserBookReadIdTab(userId) {   //récup de la listes des id book read et transf en tableau
    let userBookReadIdTab = [];
    console.log('userId', userId)
    await firebase.database().ref(`/userProfile/${userId}/read`).once('value', (snapshot) => {
      console.log('value first', snapshot)
      // this.userBookReadIdTab = [];
      snapshot.forEach(snap => {
        userBookReadIdTab.push(snap.val());
        return false;
      })
    });
    console.log('userBookReadIdTab first', userBookReadIdTab)
    return (userBookReadIdTab);                //reverse() impossible pas le temsp de se charger !!
  }

  async getUserBookReadDataTab(userId): Promise<any[]> {
    let userBookReadTab = [];
    let userBookReadDataTab = [];
    let userBookReadData, img, nbLike, nbreaders, cityRead, latReading, lngReading, dateReading, bookId, nbComments, placeRead, countryRead, ccRead;


    //this.userBookReadIdTab = await this.getUserBookReadIdTab();
    await this.getUserBookReadIdTab(userId).then(tab => {
      console.log("tab1", tab)
      userBookReadTab = tab;
      console.log('userBookReadTab', userBookReadTab)
    })

    //recup des book read data à partir de l'Id, transformation des timestamp en dates valides et geocode pour locality et country
    for (var j = 0; userBookReadTab.length > j; j++) {

      await this.bookProvider.getBookProfile(userBookReadTab[j]).once("value", (snapshot1) => {
        userBookReadData = snapshot1.val();

        //let userId = this.userId;
        latReading = snapshot1.child('readers').child(userId).val().latReading; 
        lngReading = snapshot1.child('readers').child(userId).val().lngReading;
        dateReading = snapshot1.child('readers').child(userId).val().dateReading;
        bookId = snapshot1.key;                      //feinte !!!
        nbComments = snapshot1.child('comments').numChildren();
        nbreaders = snapshot1.child('readers').numChildren();
        nbLike = snapshot1.child('likers').numChildren();

        if (userBookReadData.bookImgUrl !== undefined) {   //img
          img = userBookReadData.bookImgUrl;
        }
        else {
          img = "assets/imgs/book-cover.png";
        }
      })

      await this.geocoder.reverseGeocode(latReading, lngReading)
        .then((res) => {
          cityRead = res.locality;
          placeRead = res.administrativeArea;
          countryRead = res.countryName;
          ccRead = res.countryCode.toLowerCase();
        });

      await userBookReadDataTab.push({
        latReading: latReading,
        lngReading: lngReading,
        cityReading: cityRead,
        placeReading: placeRead,
        countryReading: countryRead,
        flagReading: "assets/flag-icon-css/flags/4x3/" + ccRead + ".svg",
        dateReading: dateReading,
        title: userBookReadData.title,
        author: userBookReadData.author,
        like: nbLike,
        nbComments: nbComments,
        bookImgUrl: img,
        bookId: bookId,                        //feinte !!!
        dist: userBookReadData.dist,
        nbReaders: nbreaders,
      })
    }
    console.log('userBookReadDataTab to sent', userBookReadDataTab)

    return userBookReadDataTab.sort((n1, n2) => n2.dateReading - n1.dateReading);           //plus recent au plus vieux
  }


  //----------------------------------------Modification-----------------------------------

  updatePseudo(newPseudo: string): Promise<any> {
    return this.userProfile.update({ pseudo: newPseudo })
  }

  updateNation(nation) {
    return this.userProfile.update({ nation: nation});
  }

  updateDOB(birthDate: string): Promise<any> {
    return this.userProfile.update({ birthDate });      // ?? no param ?
  }

  updateIMG(imgUrl) {
    return this.userProfile.update({ imgUrl });
  }
  //--------------------------------------------------------------------------------------


}
