import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import firebase from 'firebase';
import { AlertController, LoadingController } from 'ionic-angular';
import { AuthProvider } from './../auth/auth';


@Injectable()
export class DiversProvider {

  constructor(public http: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
  ) {
    console.log('Hello DiversProvider Provider');
  }

  //----------------------------alert-------------------------------
  alertM(mess) {
    let alert = this.alertCtrl.create({
      // title: "title",
      subTitle: mess,
      cssClass: "alertcss",
      buttons: [{ text: 'Back', cssClass: "buttoncss"}]
    });
    alert.present();
  }
  alertMM(mess1, mess2) {
    let alert = this.alertCtrl.create({
      title: mess1,
      message: mess2,
      cssClass: "alertcss",
      buttons: [{ text: 'Back', cssClass: "buttoncss"}]
    });
    alert.present();
  }

  alertMF(mess, fct) {
    return this.alertCtrl.create({
      // title: "title",
      subTitle: mess,
      cssClass: "alertcss",
      buttons: [{ text: 'Cancel', },
      {
        text: "ok",
        cssClass: "buttoncss",
        handler: data => { fct }
      }]
    });
    //alert.present();
  }

  alertMFF(mess, fct1, fct2) {
    let alert = this.alertCtrl.create({
      // title: "title",
      subTitle: mess,
      cssClass: "alertcss",
      buttons: [{ text: 'Cancel', cssClass: "buttoncss"},
      {
        text: "ok",
        cssClass: "buttoncss",
        handler: data => { fct1; fct2 }
      }]
    });
    alert.present();
  }

  //--------------------------loading-----------------------------------
  loadingOpen() {
    return this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/Ripple0.gif"/>`,
      cssClass: 'loadingOpen',
    });
  }

 

  //-----------------------------report-------------------------------
  alreadyReport(commenterId, userId): boolean {
    let test: boolean;
    firebase.database().ref(`/userProfile/${commenterId}/reports/${userId}`).once("value", snapshot => {
      test = (snapshot.val() !== null);               //à vérifier
      console.log('diver', snapshot.val())
    })
    console.log('test dans divers', test)
    return test;
  }

  reportUser(commenterId, userId, bookId) {
    return firebase.database().ref(`/userProfile/${commenterId}/reports/${userId}`).set({
      bookId: bookId
    })
  }
  //-----------------------------------------------------------------------------

  //-----------------------------delete----------------------------------------

  async getIdOfPseudo(tabIdPseudo, Pseudo) { //2
    let i = 0;
    while (i < tabIdPseudo.length) {
      if (tabIdPseudo[i].pseudo == Pseudo) {
        return tabIdPseudo[i].userId;
      }
      else {
        if (i == tabIdPseudo.length - 1) {
          return "false";
        }
        else { i++; }
      }
    }
  }

  async deleteReportsComments(Pseudo) {  //1

    let tabIdBook = [];
    await firebase.database().ref(`/books`).once("value", snapshot => {
      snapshot.forEach(snap => {
        tabIdBook.push(snap.key);
        return false;
      })
    })

    let tabIdPseudo = [];
    await firebase.database().ref(`/userProfile`).once("value", snapshot => {
      snapshot.forEach(snap => {
        tabIdPseudo.push({ userId: snap.key, pseudo: snap.val().pseudo });
        return false;
      })
    })

    let badUserId;
    await this.getIdOfPseudo(tabIdPseudo, Pseudo).then(res => {
      badUserId = res;
    })

    await firebase.database().ref(`/userProfile/${badUserId}`).remove();
    await this.authProvider.deleteUser();


    // for (let j = 0; j < tabIdBook.length; j++) {

    await this.deleteDataOn1Book(tabIdBook, badUserId);

    // firebase.database().ref(`/books/${tabIdBook[j]}/comments`).once("value", snapshot => {
    //   snapshot.forEach(snap => {
    //     if (snap.val().commenterId == badUserId) {
    //       firebase.database().ref(`/books/${tabIdBook[j]}/comments/${snap.key}`).remove();
    //     }
    //     return false;

    //   })
    // })
    //}

    // for (let i = 0; i < tabIdPseudo.length; i++) {
    //   await firebase.database().ref(`/userProfile/${tabIdPseudo[i].userId}/reports/${badUserId}`).remove();
    // }
    //})
  }


  async deleteDataOn1Book(tabIdBook, badUserId) {
    for (let j = 0; j < tabIdBook.length; j++) {
      let bookId = await tabIdBook[j];
      console.log('bookId', bookId)

      await firebase.database().ref(`/books/${bookId}/comments`).once("value", snapshot => {
        snapshot.forEach(snap => {
          if (snap.val().commenterId == badUserId) {
            firebase.database().ref(`/books/${bookId}/comments/${snap.key}`).remove();
          }
          return false;
        })
      })

      let fdrReleaser = await firebase.database().ref(`/books/${bookId}`);
      await fdrReleaser.once("value", book => {
        console.log('book test', book.val())
        if (book.val().releaserId == badUserId) {
          fdrReleaser.update({ releaserId: "RpS41LP4WJN7C5OxTiUgHZuA9jU2" })        //id special du delete
        }
      })

      await firebase.database().ref(`/books/${bookId}/readers/${badUserId}`).once("value", snapshot => {
        console.log('reader test', snapshot.val())
        if (snapshot.val()) {
          this.update1Reader(bookId, badUserId, snapshot.val());
        }
        // firebase.database().ref(`/books/${bookId}/readers`).push(    //avec un id bidon
        //   {
        //     dateReading: snapshot.val().dateReading,
        //     latReading: snapshot.val().latReading,
        //     lngReading: snapshot.val().lngReading,
        //   }
        // )
        // firebase.database().ref(`/books/${bookId}/readers/${badUserId}`).remove()             // !!!!!! danger zone
      })
    }

  }
  //----------------------------------------------------------------------------

  async update1Reader(bookId, badUserId, val) {
    await firebase.database().ref(`/books/${bookId}/readers`).push(    //avec un id bidon
      {
        dateReading: val.dateReading,
        latReading: val.latReading,
        lngReading: val.lngReading,
      }
    )
    await firebase.database().ref(`/books/${bookId}/readers/${badUserId}`).remove()             // !!!!!! danger zone

  }
}
