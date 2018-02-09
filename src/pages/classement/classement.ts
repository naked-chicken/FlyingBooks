import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { BookProvider } from '../../providers/book/book';


@IonicPage()
@Component({
  selector: 'page-classement',
  templateUrl: 'classement.html',
})
export class ClassementPage {
  class2: number;
  class1: number;
  userId: any;
  style= "distance";
  type = "books";
  tabUserReleasedNbReaders = [];
  tabUserReleasedDist = [];
  tabBookNbReaders = [];
  tabBookDist = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public bookProvider: BookProvider,
  ) {
    this.userId = navParams.get('userId');
    console.log('userId', this.userId)
  }

  ionViewDidLoad() {

    //-----------------books
    // this.getBookListByDist().then(tab => {
    //   this.tabBookDist = [tab[0], tab[1], tab[2]];
    //   console.log('tabBookDist', this.tabBookDist)
    // })

    // this.getBookListByNbReaders().then(tab2 => {
    //   this.tabBookNbReaders = [tab2[0], tab2[1], tab2[2]];
    //   console.log('tabBookNbReaders', this.tabBookNbReaders)
    // })

    this.getBooksTab().then(tab2 => {
      let tabDist = tab2.sort((n1, n2) => n2.dist - n1.dist);
      this.tabBookDist = [tabDist[0], tabDist[1], tabDist[2]];
      console.log('tabBookDist', this.tabBookDist)

      let tabNb = tab2.sort((n1, n2) => n2.NbReaders - n1.NbReaders);
      this.tabBookNbReaders = [tabNb[0], tabNb[1], tabNb[2]];
      console.log('tabBookNbReaders', this.tabBookNbReaders)
    })

    //-----------------users
    this.getUsersTab().then(tab3 => {
      let tabDist = tab3.sort((n1, n2) => n2.dist - n1.dist);
      this.tabUserReleasedDist = [tabDist[0], tabDist[1], tabDist[2]];
      console.log('tabUserReleasedDist', this.tabUserReleasedDist)
      let i = 0, test = false;
      while (test == false) {
        test = tabDist[i].userId == this.userId;
        i++;
      }
      console.log('positest', i)
      this.class1 = i;

      let tabNb = tab3.sort((n1, n2) => n2.nbReaders - n1.nbReaders);
      this.tabUserReleasedNbReaders = [tabNb[0], tabNb[1], tabNb[2]];
      console.log('tabUserReleasedDist', this.tabUserReleasedDist)
      let j = 0, test2 = false;
      while (test2 == false) {
        test2 = tabNb[j].userId == this.userId;
        j++;
      }
      console.log('positest', j)
      this.class2 = j;
    })


    // this.getUserTabByDist().then(tab3 => {
    //   this.tabUserReleasedDist = [tab3[0], tab3[1], tab3[2]];
    //   console.log('tabUserReleasedDist', this.tabUserReleasedDist)
    //   let i = 0, test = false;
    //   while (test == false) {
    //     test = tab3[i].userId == this.userId;
    //     i++;
    //   }
    //   console.log('positest', i)
    //   this.class1 = i;
    // })

    // this.getUserTabByNbReaders().then(tab4 => {
    //   this.tabUserReleasedNbReaders = [tab4[0], tab4[1], tab4[2]];
    //   console.log('tabUserReleasedNbReaders', this.tabUserReleasedNbReaders)
    //   let i = 0, test = false;
    //   while (test == false) {
    //     test = tab4[i].userId == this.userId;
    //     i++;
    //   }
    //   console.log('positest', i)
    //   this.class2 = i;
    // })
  }


  //-------------------------BOOKS---------------------------------------------
  //--------------------liste des livres rangée par leur dist-------------------------------
  // async getBookListByDist() {
  //   let tabBook = [];
  //   await firebase.database().ref(`/books`).once('value', (snapshot) => {
  //     let i = 0;
  //     snapshot.forEach(snap => {
  //       tabBook.push(snap.val());
  //       tabBook[i].bookId = snap.key;
  //       i++;
  //       return false;
  //     })
  //   })
  //   return await tabBook.sort((n1, n2) => n2.dist - n1.dist);           //plus grand au plus petit
  // }
  //---------------------------------------------------------------------

  //---------------------liste des livres rangée par leur Nb de lecteurs----------------------
  async getBooksTab() {
    let tabBook = [];
    await firebase.database().ref(`/books`).once('value', (snapshot) => {
      let i = 0;
      snapshot.forEach(snap => {
        tabBook.push(snap.val());
        tabBook[i].NbReaders = 0;
        tabBook[i].NbReaders = snap.child("readers").numChildren();  //ajout du nb de reader du reader dans le tab
        tabBook[i].bookId = snap.key;
        if (snap.val().bookImgUrl === undefined) {
          tabBook[i].bookImgUrl = "assets/imgs/book-cover.png"
        }
        i++;
        return false;
      })
    })
    // return await tabBook.sort((n1, n2) => n2.NbReaders - n1.NbReaders);           //plus grand au plus petit
    return await tabBook
  }
  //---------------------------------------------------------------------

  //---------------------USERS----------------------------------------------

  // //---------------------------getUserTabByDist user par dist ---------------------------
  // async getBookDist(bookId) {
  //   let d = 0;
  //   await firebase.database().ref(`/books/${bookId}/dist`).once('value', (snapshot) => {
  //     d = snapshot.val();
  //   })
  //   console.log('d', d)
  //   return await d;
  // }

  // async getUserTabBookDist(userId) {  //   --> getUserBookReleasedIdTab
  //   let tabBookId = [];
  //   let dTot = 0;
  //   await firebase.database().ref(`/userProfile/${userId}/released`).once('value', (snapshot) => {
  //     // userId.once('value', (snapshot) => {

  //     snapshot.forEach(bookId => {
  //       // console.log('bookId.val()', bookId.val())
  //       tabBookId.push(bookId.val());

  //       return false
  //     })
  //   })
  //   console.log('tabBookId', tabBookId)
  //   for (var i = 0; tabBookId.length > i; i++) {
  //     await this.getBookDist(tabBookId[i]).then(d => {
  //       dTot = dTot + d;
  //     })
  //   }
  //   console.log('dTot', dTot)
  //   return await dTot;
  // }

  // async getUserTabByDist() {
  //   let tabFinal = [];
  //   let i = 0;
  //   await firebase.database().ref(`/userProfile`).once('value', (snapshot) => {
  //     snapshot.forEach(user => {
  //       console.log('userId.val()', user.val())
  //       tabFinal.push(user.val());
  //       tabFinal[i].userId = user.key;
  //       i++;
  //       return false
  //     })
  //   })
  //   console.log('tab user + id', tabFinal)
  //   for (var j = 0; j < tabFinal.length; j++) {

  //     await this.getUserTabBookDist(tabFinal[j].userId).then(d => {
  //       tabFinal[j].dist = d;
  //       console.log("dist final d'un user", d)

  //     })
  //   }

  //   console.log('tab final sent', tabFinal)
  //   return await tabFinal.sort((n1, n2) => n2.dist - n1.dist);            //   order
  // }
  // //-------------------------------------------------------------------------------------

  // //---------------------------getBookNbReaders user par nb readers ---------------------------
  // async getBookNbReaders(bookId) {
  //   let nb = 0;
  //   await firebase.database().ref(`/books/${bookId}/readers`).once('value', (snapshot) => {
  //     nb = snapshot.numChildren();
  //   })
  //   console.log('nb', nb)
  //   return await nb;
  // }

  // async getUserTabNbReaders(userId) {  //   --> getUserBookReleasedIdTab
  //   let tabBookId = [];
  //   let NbTot = 0;
  //   await firebase.database().ref(`/userProfile/${userId}/released`).once('value', (snapshot) => {
  //     // userId.once('value', (snapshot) => {

  //     snapshot.forEach(bookId => {
  //       // console.log('bookId.val()', bookId.val())
  //       tabBookId.push(bookId.val());

  //       return false
  //     })
  //   })
  //   console.log('tabBookId2', tabBookId)
  //   for (var i = 0; tabBookId.length > i; i++) {
  //     await this.getBookNbReaders(tabBookId[i]).then(nb => {
  //       NbTot = NbTot + nb;
  //     })
  //   }
  //   console.log('NbTot', NbTot)
  //   return await NbTot;
  // }

  // async getUserTabByNbReaders() {
  //   let tabFinal = [];
  //   let i = 0;
  //   await firebase.database().ref(`/userProfile`).once('value', (snapshot) => {
  //     snapshot.forEach(user => {
  //       console.log('userId.val()2', user.val())
  //       tabFinal.push(user.val());
  //       tabFinal[i].userId = user.key;
  //       i++;
  //       return false
  //     })
  //   })
  //   console.log('tab user + id2', tabFinal)
  //   for (var j = 0; j < tabFinal.length; j++) {

  //     await this.getUserTabNbReaders(tabFinal[j].userId).then(nb => {
  //       tabFinal[j].nbReaders = nb;
  //       console.log("nb final d'un user", nb)

  //     })
  //   }

  //   console.log('tab final sent 22', tabFinal)
  //   return await tabFinal.sort((n1, n2) => n2.nbReaders - n1.nbReaders);              //   order
  // }


  //----------------FCT unique USERS  tab avec nb total de lecteurs et dist totale parcourue par ses livres relachés-----------------------------------------------

  async getBookNbReaders(bookId) {
    let nb = 0;
    await firebase.database().ref(`/books/${bookId}/readers`).once('value', (snapshot) => {
      nb = snapshot.numChildren();
    })
    console.log('nb', nb)
    return await nb;
  }

  async getBookDist(bookId) {
    let d = 0;
    await firebase.database().ref(`/books/${bookId}/dist`).once('value', (snapshot) => {
      d = snapshot.val();
    })
    console.log('d', d)
    return await d;
  }


  async getUserData(userId) {  //   calcule de la dist et du nb pour 1 user
    let tabBookId = [];
    let NbTot = 0;
    let dTot = 0;
    await firebase.database().ref(`/userProfile/${userId}/released`).once('value', (snapshot) => {
      snapshot.forEach(bookId => {
        tabBookId.push(bookId.val());
        return false
      })
    })
    console.log('tabBookId2', tabBookId)
    for (var i = 0; tabBookId.length > i; i++) {
      await this.getBookNbReaders(tabBookId[i]).then(nb => {
        NbTot = NbTot + nb;
      })
      await this.getBookDist(tabBookId[i]).then(d => {
        dTot = dTot + d;
      })
    }
    console.log('NbTot et dTot', NbTot, dTot)
    return await { NbTot: NbTot, dTot: dTot };
  }

  async getUsersTab() {       // on injecte le nb et la dist dans le tableau des users
    let tabFinal = [];
    let i = 0;
    await firebase.database().ref(`/userProfile`).once('value', (snapshot) => {
      snapshot.forEach(user => {
        console.log('userId.val()2', user.val())
        tabFinal.push(user.val());
        tabFinal[i].userId = user.key;
        if (user.val().imgUrl === undefined) {
          tabFinal[i].imgUrl = "assets/imgs/avatar.png";
        }
        i++;
        return false
      })
    })
    console.log('tab user + id2', tabFinal)
    for (var j = 0; j < tabFinal.length; j++) {

      await this.getUserData(tabFinal[j].userId).then(data => {
        tabFinal[j].nbReaders = data.NbTot;
        console.log("nb final d'un user", data.NbTot)
        tabFinal[j].dist = data.dTot;
        console.log("dist final d'un user", data.dTot)

      })
    }

    console.log('tab final sent 22', tabFinal)
    return await tabFinal;               //   non-order
  }




  //--------------------------------MOVE-----------------------------------
  goToDudeProfil(dudeId): void {
    this.navCtrl.push("PublicProfilePage", { dudeId: dudeId });  //PUBLIC profile et NO para
  }

  gotobook(bookId): void {
    this.navCtrl.push("BookPage", { bookId: bookId });
  }

}


