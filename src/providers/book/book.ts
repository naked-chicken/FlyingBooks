import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, Injector } from '@angular/core';

import firebase from 'firebase';
//import { PublicProfileProvider } from '../public-profile/public-profile';
import { Geolocation } from '@ionic-native/geolocation';
import { ToastController } from 'ionic-angular';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { GoogleMaps } from '@ionic-native/google-maps';
import { ProfileProvider } from '../profile/profile';
import { DiversProvider } from '../divers/divers';

@Injectable()
export class BookProvider {
  profileProvider: ProfileProvider; // probleme de circular import ionic
  valueTransf: { readerPseudo: any; imgUrl: any; pR: string; cR: string; cityR: string; ccR: string };

  timestamp: any;

  firestore = firebase.storage();


  constructor(public http: HttpClient,

    //public publicProfileProvider: PublicProfileProvider,
    public zone: NgZone,
    public geocoder: NativeGeocoder,
    public toaster: ToastController,
    public diversProvider: DiversProvider,

 /*public profileProvider: ProfileProvider,*/ injector: Injector) {         //correct bug cycle import
    setTimeout(() => this.profileProvider = injector.get(ProfileProvider));

    this.timestamp = firebase.database.ServerValue.TIMESTAMP;
    console.log('timestamp', this.timestamp);

    /* this.geolocation.getCurrentPosition()
       .then((position) => { //position
         this.geocoder.reverseGeocode(position.coords.latitude, position.coords.longitude).then((res) => {
           this.location = res.locality + ', ' + res.administrativeArea;
           this.country = res.countryName;
         })
       })*/
  }

  //--------------------------get-----------------------------------------

  //-----------------------get book info-------------------------------------
  getBookProfile(bookId): firebase.database.Reference {
    return firebase.database().ref(`/books/${bookId}`);
    // console.log(this.bookProfile)
    //return bookProfile;
  }
  //----------------------------------------------------------------

  //------------------------- get info des readers d'un book-----------------
  async getBookReadersIdTab(bookId) {
    let tabFinal = [];
    let bookReadersTab = [];                           //promise tab
    await firebase.database().ref(`/books/${bookId}/readers`).once('value', (snapshot) => {   /////once
      // this.bookReadersTab = [];
      let i = 0;
      snapshot.forEach(snap => {
        bookReadersTab.push(snap.val());
        bookReadersTab[i].readerId = snap.key;        //ajout de la key du reader dans le tab
        console.log('key', snap.key)
        i++;
        return false;
      })
    });
    console.log('bookReadersTab', bookReadersTab)
    await this.getbookReadersDataTab(bookReadersTab).then(tab => {
      tabFinal = tab;
    })
    return await tabFinal.sort((n1, n2) => n2.dateReading - n1.dateReading);           //plus recent au plus vieux
  }


  async getbookReadersDataTab(tabTEST) {   //sort
    console.log('tabTEST1', tabTEST)

    for (var k = 0; tabTEST.length > k; k++) {
      console.log('tabTEST 2', tabTEST)

      await this.modifElBookReaders(tabTEST[k]).then(value => {
        console.log('tabTEST[i] 3', value)
        this.valueTransf = value;
        // })
        // this.bookReadersDataTab0[i].dateReading = await this.valueTransf.date;
        tabTEST[k].readerPseudo = this.valueTransf.readerPseudo;

        if (this.valueTransf.imgUrl !== undefined) {  // if no img
          tabTEST[k].imgUrl = this.valueTransf.imgUrl;
        }
        else {
          tabTEST[k].imgUrl = "assets/imgs/avatar.png";
        }

        tabTEST[k].cityReading = this.valueTransf.cityR;
        tabTEST[k].placeReading = this.valueTransf.pR;
        tabTEST[k].countryReading = this.valueTransf.cR;
        tabTEST[k].flag = "assets/flag-icon-css/flags/4x3/" + this.valueTransf.ccR + ".svg";
      })
    }

    console.log(' tabTEST to sent', tabTEST)
    return await tabTEST;
  }

  //--------modif d'1 element du tableau
  async modifElBookReaders(el) {
    console.log('enter the modifEl', el)
    let readerPseudo = "";
    let imgUrl = "";
    let pR = "";
    let cR = "", cityR = "", ccR = "";
    await this.profileProvider.getUserProfile(el.readerId).once("value", dudeProfileSnapshot => {     //el.readerId
      console.log('that bitchy el.readerId: ', el.readerId)
      console.log('dudeProfileSnapshot.val()', dudeProfileSnapshot.val())
      if (dudeProfileSnapshot.val() !== null) {      //delete ou non
        readerPseudo = dudeProfileSnapshot.val().pseudo;
        console.log('reader pseudo', readerPseudo)
        imgUrl = dudeProfileSnapshot.val().imgUrl;
      }
    })

    await this.geocoder.reverseGeocode(el.latReading, el.lngReading).then((res) => {
      console.log('res.locality ...', res)
      cityR = res.locality;
      pR = res.administrativeArea;
      cR = res.countryName;
      ccR = res.countryCode.toLowerCase();
    })

  
    return await ({
      readerPseudo: readerPseudo,
      imgUrl: imgUrl,
      pR: pR,
      cR: cR,
      cityR: cityR,
      ccR: ccR,
    })

  }


  //------------------------------recup info d'1 reader du book-------------------
  getBookReaderById(bookId, userId): firebase.database.Reference {
    return firebase.database().ref(`/books/${bookId}/readers/${userId}`);
  }
  //---------------------------------------------------------------

  //-----------------------------Création et ajout---------------------------
  //------------coté Book

  CreateBook(title, author, bookImg, releaserId, lat, lng): firebase.database.ThenableReference {  //////OK

    //save data in database
    //let books = firebase.database().ref(`/books`);
    return firebase.database().ref(`/books`).push({
      title: title,
      author: author,
      dateReleasing: this.timestamp,
      latReleasing: lat,
      lngReleasing: lng,
      releaserId: releaserId,
      //like: 0,
      // nbComments: 0,
      dist: 0,
      // latLastRead: lat,
      // lngLastRead: lng,
      bookImgUrl: bookImg,          //image 
    })
  }



  addReaderOnBook(bookId, readerId, lat, lng) {         //////////////////////////  !!!!!!!!!!!!! PUSH
    /* let bookLastCoord = firebase.database().ref(`/books/${bookId}`);
     bookLastCoord.update({
       latLastRead: lat,
       lngLastRead: lng
     })*/

    let bookReader = firebase.database().ref(`/books/${bookId}/readers/${readerId}`);
    return bookReader.set({
      //  readerId: readerId,             !!useless  maybe
      latReading: lat,
      lngReading: lng,
      dateReading: this.timestamp,
      //likeBool: false,

    });
  }

  //-----------------coté User

  addReleasedBook(userId, bookId) {  ///////OK              / !!!!!!!!!!!!!!!!!!!!! let
    let booksReleasedByUser = firebase.database().ref(`/userProfile/${userId}/released`);
    return booksReleasedByUser.push(bookId)
  }

  addReadBookOnUser(userId, bookId) {
    let readBookOnUser = firebase.database().ref(`/userProfile/${userId}/read`);
    return readBookOnUser.push(bookId)

  }

  //--------------------------------fin--------------------------

  //---------------------------REMOVE Comment--------------------------------------
  removeComment(bookId, commentId) {
    firebase.database().ref(`/books/${bookId}/comments/${commentId}`).remove();
  }
  //---------------------------------------------------------------


  //----------------------------ajout Comments pour CHAT----------------------
  async addComment(comment, userId, bookId) {     // !!!!!!!! BUG !!!!!!!
    if (comment != "") {
      let pseudo, imgUrl
      let fdr = await firebase.database().ref(`/books/${bookId}/comments`).push({
        commenterId: userId,
        date: this.timestamp,
        comment: comment,
      });                           //   ajout de la key    //  !!!!!!!!!!!!!!!!!!!!  profile provider !!!!!
      await this.profileProvider.getUserProfile(userId).once("value", dudeProfileSnapshot => {
        pseudo = dudeProfileSnapshot.val().pseudo;

        if (dudeProfileSnapshot.val().imgUrl !== undefined) {
          imgUrl = dudeProfileSnapshot.val().imgUrl;
        }
        else {
          imgUrl = "assets/imgs/avatar.png";
        }
      });

      return await {    // pour l'actualisation du tab comment sans faire appel a la grosse fct
        commentId: fdr.key, chrono: "à l'instant", comment: comment, pseudo: pseudo, imgUrl: imgUrl, commenterId: userId
      };
    }
    else {
      return 'nochange';
    }
  }

  //-----------------------------fin--------------

  //-----------------------------récupération info pour CHAT ---------------------

  async getBookCommentsIdTab(bookId) {   // fct appelée
    let bookCommentsTab = [];
    let tabFinal = [];
    await firebase.database().ref(`/books/${bookId}/comments`).once('value', (snapshot) => {   /////once
      //this.bookCommentsTab = [];
      console.log('value', snapshot)
      let i = 0;
      snapshot.forEach(snap => {
        bookCommentsTab.push(snap.val());
        bookCommentsTab[i].commentId = snap.key;
        i++;
        return false;
      })
    });
    console.log("bookCommentsTab", bookCommentsTab)
    await this.getBookCommentsDataTab(bookCommentsTab).then(tab => {
      tabFinal = tab;
    })
    console.log('tab final', tabFinal)
    return await tabFinal.sort((n1, n2) => n2.date - n1.date);
  }


  async getBookCommentsDataTab(tab) {                 // async
    console.log('tab', tab)
    for (var i = 0; tab.length > i; i++) {
      await this.profileProvider.getUserProfile(tab[i].commenterId).once("value", dudeProfileSnapshot => {
        console.log('tab[i]: ', tab[i])
        tab[i].pseudo = dudeProfileSnapshot.val().pseudo;

        if (dudeProfileSnapshot.val().imgUrl !== undefined) {
          tab[i].imgUrl = dudeProfileSnapshot.val().imgUrl;
        }
        else {
          tab[i].imgUrl = "assets/imgs/avatar.png";
        }
      });
    }
    console.log('tab sent', tab)
    return tab;
  }


  //-----------------------------fin------------------------------

  //---------------------vérificaton si le user est le releaser----------------------------
  async testReleaser(bookId, userId) {
    let test;
    await firebase.database().ref(`/books/${bookId}/releaserId`).once("value", (snap) => {
      test = (snap.val() == userId);
    })
    return await test;
  }
  //----------------------------vérification si le user a déjà lu le livre---------
  async dejaLu(bookId, userId) {             //pour like et scan
    let dejalu;
    await firebase.database().ref(`/books/${bookId}/readers/${userId}`).once("value", (snap) => {                           //on ?
      dejalu = (snap.val() !== null);
    })
    return await dejalu;
  }
  //---------------- pas de fusion car dejaLu est appelée une autre fois, et pas besoin 
  //-------------- de faire le travail de dejaLike pour rien--------------------------------

  //----------------------------vérification si le user a deja liké le livre--------
  async dejaLike(bookId, userId) {            //pour like
    let dejalike, testReleaser;
    await firebase.database().ref(`/books/${bookId}/likers/${userId}`).once("value", (snap) => {
      dejalike = (snap.val() == 'like');
    })
    return await dejalike;
  }


  //--------------------------------update like-----------------------------------------
  upLike(bookId, userId) {           //    !  !!!!!!
    firebase.database().ref(`/books/${bookId}/likers/${userId}`).set('like');
  }

  // //--------------------------------update like-----------------------------------------
  // upLike2(bookId, userId) {
  //   let nbLike;
  //   let bookLike = firebase.database().ref(`/books/${bookId}/like`);
  //   bookLike.on("value", (snapshot) => {
  //     nbLike = snapshot.val() + 1;
  //   })
  //   bookLike.set(nbLike);

  //   let likeBool = firebase.database().ref(`/books/${bookId}/readers/${userId}/likeBool`);
  //   likeBool.set(true);
  // }
  //----------------------------------------------------------------------

  async getBookReadersBasic(bookId) {   //pour classement
    let bookReadersTab = [];                           //promise tab
    await firebase.database().ref(`/books/${bookId}/readers`).once('value', (snapshot) => {   /////once
      snapshot.forEach(snap => {
        bookReadersTab.push(snap.val());
        return false;
      })
    });
    console.log('bookReadersTab pour dist', bookReadersTab)
    return await bookReadersTab.sort((n1, n2) => n2.dateReading - n1.dateReading);  //plus recent au plus vieux
  }

  //--------------------------up distance et test classement--------------------------------
  getBookDist(bookId): firebase.database.Reference {             //useless
    return firebase.database().ref(`/books/${bookId}/dist`);
  }

  async upDist(bookId, lat, lng) {
    // let lastBook = this.getBookReadersIdTab(bookId).reverse();
    //this.getBookReadersIdTab(bookId).then(tab => {

    //  let lastBook = tab;
    // console.log('last book', lastBook)
    let bookReadersDataTab;
    let lastLat, lastLng;
    await this.getBookReadersBasic(bookId).then(value => {
      bookReadersDataTab = value;
      console.log('bookReadersDataTab pour up dist', bookReadersDataTab)
      if (bookReadersDataTab.length == 0) {
        console.log('enter the if')
        firebase.database().ref(`/books/${bookId}`).on("value", bookProfileSnapshot => {   //on or once
          let bookProfile = bookProfileSnapshot.val();
          lastLat = bookProfileSnapshot.val().latReleasing;    //   BAD !!!!!!!!!!!!!!!!!!!
          lastLng = bookProfileSnapshot.val().lngReleasing;
        })
      }
      else {
        console.log('enter the else')
        lastLat = bookReadersDataTab[0].latReading;
        lastLng = bookReadersDataTab[0].lngReading;
      }
    })
    console.log('last lat', lastLat)
    let temp = await this.calculDist(lat, lng, lastLat, lastLng);
    await this.upD(bookId, temp);
    //})
  }

  calculDist(lat, lng, lastLat, lastLng) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };
    let R = earthRadius['km'];
    let lat1 = lat;
    let lon1 = lng;
    let lat2 = lastLat;
    let lon2 = lastLng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;
  }

  toRad(x) {
    return x * Math.PI / 180;
  }

  async upD(bookId, d) {
    console.log('d', d)
    let dist;
    let bookDist = await firebase.database().ref(`/books/${bookId}/dist`);
    await bookDist.once("value", (snapshot) => {
      let dd = snapshot.val() + d
      dist = parseFloat(dd.toFixed(0));
    })
    console.log('dist', dist);
    let bd = await dist;
    console.log('bd', bd);

    await bookDist.set(bd);

  }

  //-----------------------------------------------------------------------------------


}
