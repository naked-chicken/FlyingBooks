import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import firebase from 'firebase';
import { DiversProvider } from '../../providers/divers/divers';
import { AuthProvider } from './../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  reportTab = null;

  shownGroup = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    // public alertCtrl: AlertController,
    public diversProvider: DiversProvider,
    public alertCtrl: AlertController,

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  //--------------------------test----------------------


  //--------------------------accordeon--------------------
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };
  //-----------------------------goto--------------------------------------
  gotobook(bookId): void {
    this.navCtrl.push("BookPage", { bookId: bookId });
  }

  goToDudeProfil(dudeId): void {
    this.navCtrl.push("PublicProfilePage", { dudeId: dudeId });
  }
  //---------------------------------------------------------------------------

  //--------------------------------------Report tab-------------------------------------
  async getReportTab() {                //1
    console.log('getReportTab')
    if (this.reportTab !== null) {
      console.log('delete ReportTab')
      this.reportTab = null; //////////// pour ouvrir / refermer le tableau
    }
    else {
      console.log('create ReportTab')
      await this.getReportIdTab().then(tab => {
        this.reportTab = tab;
        for (let i = 0; i < this.reportTab.length; i++) {
          firebase.database().ref(`/userProfile/${tab[i].userId}/pseudo`).once("value", snapshot => {
            this.reportTab[i].pseudo = snapshot.val();
          })
        }
        for (let j = 0; j < this.reportTab.length; j++) {
          this.getBookSortedTab(this.reportTab[j].booksId).then(tab => {
            this.reportTab[j].booksId = tab;
          })
        }
      })
    }
  }

  async getReportIdTab() {                     //2
    let tabUserId = [];
    await firebase.database().ref(`/userProfile`).once("value", snapshot => {
      snapshot.forEach(snap => {
        tabUserId.push({userId: snap.key, nbRep:0, booksId: []});
        return false;
      })
    })
    for (let i = 0; i < tabUserId.length; i++) {
      await firebase.database().ref(`/userProfile/${tabUserId[i].userId}/reports`).once("value", snapshot => {
        tabUserId[i].nbRep = snapshot.numChildren();
        snapshot.forEach(snap => {
          if (snap.val()) {
            tabUserId[i].booksId.push({bookId: snap.val().bookId, nb:1});
          }
          return false;
        })
      })
    }
    console.log('tabUserId not sorted', tabUserId)
    return await tabUserId.sort((n1, n2) => (n2.nbRep - n1.nbRep));             //rangé mais pas dans l'ordre alphab, à cause des majuscules ..
  }

  async getBookSortedTab(tab) {                       //3
    let tabSorted = await tab.sort((n1, n2) => 0 - (n2.bookId < n1.bookId ? 1 : -1));           //rangé mais pas dans l'ordre alphab
    let tabLight =[tabSorted[0]];
    for (let i = 1; i < tabSorted.length; i++) {
      if (tabSorted[i].bookId == tabLight[tabLight.length - 1].bookId) {
        tabLight[tabLight.length - 1].nb++;
      }
      else {
        tabLight.push(tabSorted[i]);
      }
    }
    return tabLight.sort((n1, n2) => (n2.nb - n1.nb));
  }

  //--------------------------------------Report tab2-------------------------------------
  // async getReportIdTab() {                     //3
  //   let reportIdTab = [];
  //   let tabUserId = [];
  //   await firebase.database().ref(`/userProfile`).once("value", snapshot => {
  //     snapshot.forEach(snap => {
  //       tabUserId.push(snap.key);
  //       return false;
  //     })
  //   })
  //   for (let i = 0; i < tabUserId.length; i++) {
  //     await firebase.database().ref(`/userProfile/${tabUserId[i]}/reports`).once("value", snapshot => {
  //       snapshot.forEach(snap => {
  //         reportIdTab.push({ userId: snap.key, bookId: [{ bookId: snap.child('bookId').val(), nb: 1 }], nb: 1 });
  //         return false;
  //       })
  //     })
  //   }
  //   return await reportIdTab.sort((n1, n2) => 0 - (n2.userId < n1.userId ? 1 : -1));           //rangé mais pas dans l'ordre alphab, à cause des majuscules ..
  // }

  // async getReportSortedTab() {            //2
  //   let tabLight = [{ userId: "", bookId: [], nb: 0 }];
  //   await this.getReportIdTab().then(tab => {
  //     for (let i = 0; i < tab.length; i++) {
  //       if (tab[i].userId == tabLight[tabLight.length - 1].userId) {
  //         tabLight[tabLight.length - 1].nb++;
  //         tabLight[tabLight.length - 1].bookId.push(tab[i].bookId[0])
  //       }
  //       else {
  //         tabLight.push(tab[i]);
  //       }
  //     }
  //   })
  //   return await tabLight.sort((n1, n2) => n2.nb - n1.nb);           //plus grand au plus petit;
  // }


  // async getReportTab() {                //1
  //   console.log('getReportTab')
  //   if (this.reportTab !== null) {
  //     console.log('delete ReportTab')
  //     this.reportTab = null; //////////// pour ouvrir / refermer le tableau
  //   }
  //   else {
  //     console.log('create ReportTab')
  //     await this.getReportSortedTab().then(tab => {
  //       this.reportTab = tab;
  //       for (let i = 0; i < this.reportTab.length; i++) {
  //         firebase.database().ref(`/userProfile/${tab[i].userId}/pseudo`).once("value", snapshot => {
  //           this.reportTab[i].pseudo = snapshot.val();
  //         })
  //       }

  //       for (let j = 0; j < this.reportTab.length; j++) {
  //         this.getBookSortedTab(this.reportTab[j].bookId).then(tab => {
  //           this.reportTab[j].bookId = tab;
  //         })
  //       }
  //     })
  //   }
  // }


  // async getBookSortedTab(tab) {                       //4
  //   let tabSorted = await tab.sort((n1, n2) => 0 - (n2.bookId < n1.bookId ? 1 : -1));           //rangé mais pas dans l'ordre alphab
  //   let tabLight = [{ bookId: "", nb: 0 }];
  //   for (let i = 0; i < tabSorted.length; i++) {
  //     if (tabSorted[i].bookId == tabLight[tabLight.length - 1].bookId) {
  //       tabLight[tabLight.length - 1].nb++;
  //     }
  //     else {
  //       tabLight.push(tabSorted[i]);
  //     }
  //   }
  //   return tabLight.sort((n1, n2) => (n2.nb - n1.nb));
  // }

  //--------------------------------------------------------------------------------------

  //-------------------------------------delete user---------------------------------------

  deleteReportsComments(Pseudo) {
    let loading = this.diversProvider.loadingOpen();
    let alert = this.alertCtrl.create({
      // title: "title",
      subTitle: "delete your profile for sure ?",
      cssClass: "alertcss",
      buttons: [{ text: 'Cancel', },
      {
        text: "ok",
        cssClass: "buttoncss",
        handler: data => {
          loading.present();
          this.diversProvider.deleteReportsComments(Pseudo).then(() => {
            loading.dismiss();
          })
        }
      }]
    });
    alert.present();
  }

}
