import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { BookProvider } from './../../providers/book/book';
import { ProfileProvider } from '../../providers/profile/profile';
import { ModalChatPage } from '../modal-chat/modal-chat';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { DiversProvider } from './../../providers/divers/divers';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LoadedModule } from 'ionic-angular/util/module-loader';
import { Loading } from 'ionic-angular/components/loading/loading';



@IonicPage()
@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {
  loading: Loading;
  fromScan: false;

  lngReleasing: any;
  latReleasing: any;
  cityReleasing: string;
  flagReleasing: string;
  bookProfile: any;
  dist: any;
  countryReleasing: any;
  bookImgUrl = "assets/imgs/book-cover.png";  //book
  imgUrl = "assets/imgs/avatar.png";      //releaser
  nbComments: any;
  //  commentReleaser: any;
  nbLike: any;
  bookReadersDataTab: any;
  readerId: any;

  releaserPseudo: any;
  // releaserProfile: any;
  releaserId: any;

  placeReleasing: any;
  dateReleasing: Date;

  bookReadersTab: any[];

  place: any;
  pseudo: any;
  author: any;
  title: any;
  bookId: string;
  userId: any;

  //public bookProfile: any;  //???

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public bookProvider: BookProvider,
    public profileProvider: ProfileProvider,
    public geocoder: NativeGeocoder,
    private geolocation: Geolocation,
    public diversProvider: DiversProvider,
  ) {

    this.bookId = navParams.get('bookId');
    this.fromScan = navParams.get('fromScan');

    this.loading = navParams.get('loading');


    this.userId = this.profileProvider.getUserId();
  }

  //-------------------go vers modal de chat------------------------------
  openModal() {
    let myModal = this.modalCtrl.create(ModalChatPage, {
      //info necessaire
      bookId: this.bookId,
      userId: this.userId,
      title: this.title,
      bookImgUrl: this.bookImgUrl,
    });
    myModal.present();
  }
  //----------------------------fin-------------

  ionViewDidLoad() {
    if (!this.loading) {
      console.log('!this.loading', !this.loading)
      this.loading = this.diversProvider.loadingOpen();

      this.loading.present();
    }


    //this.loading.dismiss();   ///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    this.getProfil().then(() => {

      // //-----------------recup du releaser profile-----------------------
      // this.profileProvider.getUserProfile(this.releaserId).on("value", dudeProfileSnapshot => {
      //   let releaserProfile = dudeProfileSnapshot.val();
      //   console.log("releaserProfile", releaserProfile)
      //   // if (releaserProfile === null) {         //releaser a un id special
      //   //   this.releaserPseudo = "deleted";
      //   //   this.imgUrl = "assets/imgs/deleted.png";
      //   // }
      //   //else {
      //   this.releaserPseudo = releaserProfile.pseudo;
      //   if (releaserProfile.imgUrl !== undefined) {
      //     this.imgUrl = releaserProfile.imgUrl;  //      img
      //     //  }
      //   }
      // }
      // );

      //----------------recup des readers profile--------      
      this.bookProvider.getBookReadersIdTab(this.bookId).then(value => {
        this.bookReadersDataTab = value;
        console.log('bookReadersDataTab final', this.bookReadersDataTab)


        //-----------------recup du releaser profile-----------------------
        this.profileProvider.getUserProfile(this.releaserId).once("value", dudeProfileSnapshot => {
          let releaserProfile = dudeProfileSnapshot.val();
          console.log("releaserProfile", releaserProfile)
          this.releaserPseudo = releaserProfile.pseudo;
          if (releaserProfile.imgUrl !== undefined) {
            this.imgUrl = releaserProfile.imgUrl;  //      img
          }
        }
        );

        setTimeout(fonction => {
          this.loading.dismiss();
        }, 1000)
      })
    })

    // //----------------recup des readers profile--------      
    // this.bookProvider.getBookReadersIdTab(this.bookId).then(value => {
    //   this.bookReadersDataTab = value;
    //   console.log('bookReadersDataTab final', this.bookReadersDataTab)
    // })


  }//------------------------------------fin ionViewDidLoad------------------

  //------------------recup du profilBook------------------------
  async getProfil() {
    this.bookProvider.getBookProfile(this.bookId).on("value", bookProfileSnapshot => {
      this.bookProfile = bookProfileSnapshot.val();
      if (this.bookProfile) {
        console.log("bookProfile", this.bookProfile);
        this.title = this.bookProfile.title;  //recup du titre
        this.author = this.bookProfile.author;    //recup de l'author
        this.dateReleasing = this.bookProfile.dateReleasing;
        this.releaserId = this.bookProfile.releaserId;
        this.dist = this.bookProfile.dist;

        this.nbLike = bookProfileSnapshot.child('likers').numChildren();
        this.nbComments = bookProfileSnapshot.child('comments').numChildren();
        if (this.bookProfile.bookImgUrl !== undefined) {
          this.bookImgUrl = this.bookProfile.bookImgUrl;
        }
        //   location
        this.latReleasing = this.bookProfile.latReleasing;
        this.lngReleasing = this.bookProfile.lngReleasing;
        this.geocoder.reverseGeocode(this.latReleasing, this.lngReleasing)
          .then((res) => {
            this.cityReleasing = res.locality;
            this.placeReleasing = res.administrativeArea;
            this.countryReleasing = res.countryName;
            this.flagReleasing = "assets/flag-icon-css/flags/4x3/" + res.countryCode.toLowerCase() + ".svg";
          })
      }
    })
  }




  //-------------like()---------------------------------------------------
  async like() {
    let dejaLu, dejaLike;
    await this.bookProvider.dejaLu(this.bookId, this.userId).then(res => {
      dejaLu = res;
    });

    if (dejaLu) {        //livre lu
      await this.bookProvider.dejaLike(this.bookId, this.userId).then(res2 => {
        dejaLike = res2;
      });
      if (dejaLike == false) {
        this.bookProvider.upLike(this.bookId, this.userId);
        //   !!!!!!!!!!!!!    STOP !!!!!!!!!!!!!!!!!!!!!!!!!!!

      }
      else {       // déjà liké
        let alert = this.alertCtrl.create({
          message: "already like",
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
      }
    }

    else {             // livre non lu
      let alert = this.alertCtrl.create({
        message: "you need to read the book to be able to like it",
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present();
    }
  }

  //-------------like()---------------------------------------------------
  // like2() {
  //   let reader = this.bookProvider.getBookReaderById(this.bookId, this.userId);

  //   reader.once("value", readerSnapshot => {       // user parmi les readers ?
  //     let readerTest = readerSnapshot.val();
  //     //console.log("user parmi les readers ?", readerTest)

  //     if (readerTest != null) {        //livre lu
  //       let likeBool = readerSnapshot.val().likeBool;

  //       if (likeBool == false) {
  //         this.bookProvider.upLike(this.bookId, this.userId);
  //         //   !!!!!!!!!!!!!    STOP !!!!!!!!!!!!!!!!!!!!!!!!!!!

  //       }
  //       else {       // déjà liké
  //         let alert = this.alertCtrl.create({
  //           message: "already like",
  //           buttons: [
  //             {
  //               text: "Ok",
  //               role: 'cancel'
  //             }
  //           ]
  //         });
  //         alert.present();
  //       }
  //     }
  //     else {             // livre non lu
  //       let alert = this.alertCtrl.create({
  //         message: "you need to read the book to be able to like it",
  //         buttons: [
  //           {
  //             text: "Ok",
  //             role: 'cancel'
  //           }
  //         ]
  //       });
  //       alert.present();
  //     }
  //   })
  // }


  //-------------------------confirm et ajout des data AVEC GEOLOCATION-------------------------
  async confirmReadBook() {
    this.loading = this.diversProvider.loadingOpen();
    this.loading.present();

    let dejalu, testreleaser;

    await this.bookProvider.testReleaser(this.bookId, this.userId).then(res => {
      testreleaser = res;
    })
    console.log("test de testreleaser", testreleaser)
    if (!testreleaser) {             // pas le releaser, et seul car si positif, pas besoin de faire le test dejalu

      await this.bookProvider.dejaLu(this.bookId, this.userId).then(res => {
        dejalu = res;
      })
      console.log("test de dejaLu 3", dejalu)
      if (!dejalu) {  //               inverse !!  pas deja lu
        let position;
        //Geoloc
        await this.geolocation.getCurrentPosition()
          .then((positionR) => { //position
            position = positionR;
          })
        await this.bookProvider.upDist(this.bookId, position.coords.latitude, position.coords.longitude);

        let bookReader = await this.bookProvider.addReaderOnBook(
          this.bookId,
          this.userId,
          position.coords.latitude,
          position.coords.longitude,
        )
        let bookRead = await this.bookProvider.addReadBookOnUser(
          this.userId,
          this.bookId,
        );
        // loading.dismiss().then(() => {
        this.navCtrl.setRoot('BookPage', { loading: this.loading, bookId: this.bookId });     /// !!!!!!
        // })
      }

      else   // deja lu
      {               //      ugly  !!!!!!!!!!!!!!!!
        this.loading.dismiss();
        let prompt = this.alertCtrl.create({
          title: 'Oops',
          message: "livre déjà enregistré ...",
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
          ]
        });
        prompt.present();

      }
    }

    else {    //  user = releaser
      this.loading.dismiss();
      let prompt = this.alertCtrl.create({
        title: 'Oops',
        message: "the releaser can't confirm a read book ...",
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
        ]
      });
      prompt.present();
    }

  }
  //------------------fin AVEC geoloc-------------------------------

  //-------------changement de page---------------------------------
  goToDudeProfil(dudeId): void {
    this.navCtrl.push("PublicProfilePage", { dudeId: dudeId, userId: this.userId });  //PUBLIC profile et NO para
  }

  gotoprofile(): void {
    this.navCtrl.push("ProfilePage");
  }

  gotoMap() {
    console.log('move to map, bookReadersDataTab', this.bookReadersDataTab)
    let book = { bookImgUrl: this.bookImgUrl, title: this.title, cityReleasing: this.cityReleasing, latReleasing: this.latReleasing, lngReleasing: this.lngReleasing, dateReleasing: this.dateReleasing, releaserPseudo: this.releaserPseudo, imgUrl: this.imgUrl };
    this.navCtrl.push("MapPage", { book: book, bookReadersDataTab: this.bookReadersDataTab });
  }
}


