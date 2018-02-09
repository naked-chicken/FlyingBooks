import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, AlertController, ModalController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { BookProvider } from '../../providers/book/book';

import { ProfileProvider } from "../../providers/profile/profile";
import { AuthProvider } from "../../providers/auth/auth";
import { ModalModifPage } from '../modal-modif/modal-modif';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { DiversProvider } from '../../providers/divers/divers';
//import { DiversProvider } from '../../providers/divers/divers';



@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  loading : Loading;
  flag: string = "";
  nation: any;
  age: string;
  today: string;
  //test

  bookList: string = "released";           //necessaire pour toolbar

  //userBookReleasedDataTab: any[];
  userBookReleasedDataTab = [];
    // {
    //   bookImgUrl: "assets/imgs/mobydick.jpg",
    //   title: "a poil les poules ta mere la pute",
    //   author: "bob dylan",
    //   //cityReleasing: "Paris",
    //   placeReleasing: "Iles de France",
    //   countryReleasing: "France",
    //   flagReleasing: "assets/flag-icon-css/flags/4x3/gr.svg",
    //   dateReleasing: 1512931179040,
    //   like: 10,
    //   nbComments: 21,
    //   nbReaders: 17,
    //   dist: 88882,
    //   bookId: 515454564
    // },
    // {
    //   bookImgUrl: "assets/imgs/mobydick.jpg",
    //   title: "a poil les poules",
    //   author: "bob dylan",
    //   cityReleasing: "Paris",
    //   placeReleasing: "Iles de France",
    //   countryReleasing: "France",
    //   flagReleasing: "assets/flag-icon-css/flags/4x3/es.svg",
    //   dateReleasing: 1517234179040,
    //   like: 10,
    //   nbComments: 21,
    //   nbReaders: 17,
    //   dist: 888,
    //   bookId: 515454564
    // },
    // {
    //   bookImgUrl: "assets/imgs/mobydick.jpg",
    //   title: "a poil les poules",
    //   author: "bob dylan",
    //   cityReleasing: "Paris",
    //   placeReleasing: "Iles de France",
    //   countryReleasing: "France",
    //   flagReleasing: "assets/flag-icon-css/flags/4x3/br.svg",
    //   dateReleasing: 1517234179040,
    //   like: 10,
    //   nbComments: 21,
    //   nbReaders: 17,
    //   dist: 888,
    //   bookId: 515454564
    // }];

  userBookReadDataTab = [];
  // {
  //   bookImgUrl: "assets/imgs/mobydick.jpg",
  //   title: "a poil les poules",
  //   author: "bob dylan",
  //   cityReleasing: "Paris",
  //   placeReleasing: "Iles de France",
  //   countryReleasing: "France",
  //   flagReleasing: "assets/flag-icon-css/flags/4x3/fr.svg",
  //   dateReleasing: 1517234179040,
  //   like: 10,
  //   nbComments: 21,
  //   nbReaders: 17,
  //   dist: 888,
  //   bookId: 515454564
  // },
  // {
  //   bookImgUrl: "assets/imgs/mobydick.jpg",
  //   title: "a poil les poules",
  //   author: "bob dylan",
  //   cityReleasing: "Paris",
  //   placeReleasing: "Iles de France",
  //   countryReleasing: "France",
  //   flagReleasing: "fr",
  //   dateReleasing: 1517234179040,
  //   like: 10,
  //   nbComments: 21,
  //   nbReaders: 17,
  //   dist: 888,
  //   bookId: 515454564
  // },
  // {
  //   bookImgUrl: "assets/imgs/mobydick.jpg",
  //   title: "a poil les poules",
  //   author: "bob dylan",
  //   cityReleasing: "Paris",
  //   placeReleasing: "Iles de France",
  //   countryReleasing: "France",
  //   flagReleasing: "assets/flag-icon-css/flags/4x3/fr.svg",
  //   dateReleasing: 1517234179040,
  //   like: 10,
  //   nbComments: 21,
  //   nbReaders: 17,
  //   dist: 888,
  //   bookId: 515454564
  // }];

  dateCreation: Date;
  birthDate: any;
  imgUrl = "assets/imgs/avatar.png";
  public pseudo: any;
  public email: any;
  public userId: any;

  showNation = false;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider,
    public bookProvider: BookProvider,
    public diversProvider: DiversProvider,
    public toaster: ToastController,
    public loadingCtrl: LoadingController,
    private barcodeScanner: BarcodeScanner,
    private toast: Toast,


    //test
    //public diversProvider: DiversProvider,


  ) {
    this.loading = navParams.get('loading');

  }


  //----------------------go vers modal de modif--------------------
  openModal() {
    let user = {
      pseudo: this.pseudo,
      dob: this.birthDate,
      userId: this.userId,
      imgUrl: this.imgUrl,
      nation: this.nation,
      email: this.email
    }
    let myModal = this.modalCtrl.create(ModalModifPage, { user: user });
    myModal.present();
  }
  //------------------------fin-------------------------

  ionViewDidLoad() {

    if (!this.loading) {
      console.log('!this.loading', !this.loading)
      this.loading = this.diversProvider.loadingOpen();

      this.loading.present();
    }

    //this.loading.dismiss();
    // setTimeout(fonction => {
    //   this.loading.dismiss();
    // }, 7000)

    //test


    //-----------------recup de l'Id
    this.userId = this.profileProvider.getUserId();

    

    //---------------recuperation du profil    --- !!!!!! loading
    this.getProfile().then(() => {
      // recup des livres relaché
      this.profileProvider.getUserBookReleasedDataTab(this.userId).then(value => {
        this.userBookReleasedDataTab = value;
        console.log('breleasedtab with DATA', this.userBookReleasedDataTab)

        // recup des livres lus
        this.profileProvider.getUserBookReadDataTab(this.userId).then(value => {
          this.userBookReadDataTab = value;
          console.log("userBookReadDataTab", this.userBookReadDataTab)
          setTimeout(fonction => {
            this.loading.dismiss();
          }, 1000)
        })
      })
    })
  }  //------------------ fin on view--------------------------------------------------

  //-------------------------récup du profile--------------------------
  async getProfile() {
    let fdr = await this.profileProvider.getUserProfile(this.userId);
    console.log('fdr', fdr)
    await fdr.on("value", userProfileSnapshot => {                    // on better than once car mise a jours des données
      let userProfile = userProfileSnapshot.val();
      if (userProfile) {
        console.log('userProfile 00', userProfile)
        if (userProfile.birthDate) {
          this.birthDate = userProfile.birthDate;
        }
        this.pseudo = userProfile.pseudo;  //recup du pseudo
        this.email = userProfile.email;    //recup de l'email
        console.log('img1', this.imgUrl)
        if (userProfile.imgUrl) {
          this.imgUrl = userProfile.imgUrl;  //      img
        }
        console.log('img2', this.imgUrl)

        this.dateCreation = userProfile.dateCreation;
        if (userProfile.nation) {
          this.nation = userProfile.nation;   //pour le modal
          this.flag = "assets/flag-icon-css/flags/4x3/" + userProfile.nation.toLowerCase() + ".svg";
        }
      }
    })

  }
  //----------------------------------------------------------------------
  //---------------------------nation---------------------------------
  nationOnOff() {
    if (this.showNation) {
      this.showNation = false;
    }
    else {
      this.showNation = true;
    }
  }
  //-------------------------------test nbBook ----------------------
  testNb(nb) {
    return nb == 0;
  }

  //--------------------------------scan--------------------------------
  scan() {
    this.navCtrl.push("ScanPage", {userId: this.userId});


    // let bookProfile = null;

    // let options: BarcodeScannerOptions = {
    //   prompt: 'Scan me !!',
    //   showTorchButton: true,
    // }

    // this.barcodeScanner.scan(options).then((barcodeData) => {
    //   this.loading.present();
    //   this.bookProvider.getBookProfile(barcodeData.text).on("value", bookProfileSnapshot => {
    //     bookProfile = bookProfileSnapshot.val();
    //     console.log(bookProfile);

    //     if (bookProfile !== null) {
    //       this.loading.dismiss();
    //       this.navCtrl.push('BookPage', { bookId: barcodeData.text, fromScan: true });
    //     }
    //     else {
    //       this.loading.dismiss();
    //       this.toast.show('Product not found', '5000', 'center').subscribe(
    //         toast => {
    //           console.log(toast);
    //         }
    //       );
    //     }
    //   }
    //   )
    // },
    //   (err) => {
    //     this.toast.show(err, '5000', 'center').subscribe(
    //       toast => {
    //         console.log(toast);
    //       }
    //     );
    //   });
  }

  /// rechByInput(id) {  ...............................

  //-----------------------------------------------------------------------

  //---------------------------------changement de page-----------------

  gotoresearch(): void {
    this.navCtrl.push("ResearchBookPage", { id: this.userId });
  }

  // gotoscan(): void {
  //   this.navCtrl.push("ScanPage", { userId: this.userId });

  // }

  gotobook(bookId): void {
    this.loading.present;
    this.navCtrl.push("BookPage", { bookId: bookId });
  }

  gotoTrophy(): void {
    this.navCtrl.push("ClassementPage", { userId: this.userId });
  }

  gotoMap(): void {
    let user = { userId: this.userId, pseudo: this.pseudo, imgUrl: this.imgUrl, }
    this.navCtrl.push("MapUserPage", { user: user, readTab: this.userBookReadDataTab, releasedTab: this.userBookReleasedDataTab });
  }

}
