import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { BookProvider } from '../../providers/book/book';

import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { DiversProvider } from '../../providers/divers/divers';

@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {
  latReleasing: any;
  lngReleasing: any;
  nbReaders: number;
  nbLike: any;
  cityReleasing: string;
  flagReleasing: string;
  dist: any;
  position: Geoposition;
  dateReleasing: Date;
  bookImgUrl = "assets/imgs/book-cover.png";  //book
  nbComments: any;
  //like: any;
  countryReleasing: any;
  placeReleasing: any;
  loading: any;
  commentReleaser: any;
  bookRead: any;
  bookReader: any;
  // userPseudo: any;
  userId: any;
  bookId: any;
  // bookFound: boolean;
  // lg: any;
  author: any;
  title: any;
  bookProfile: any;

  options: BarcodeScannerOptions;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private toast: Toast,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public bookProvider: BookProvider,
    private geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    public diversProvider: DiversProvider,
  ) {

    this.userId = navParams.get('userId');
    // this.userPseudo = navParams.get('userPseudo');
  }

  //--------------------Recherche -----------------------------------

  ionViewDidLoad() {
    this.scan();

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

  scan() {
    this.bookProfile = null;

    this.options = {
      prompt: 'Scan me !!',
      showTorchButton: true,
    }

    this.barcodeScanner.scan(this.options).then((barcodeData) => {
      this.loading = this.diversProvider.loadingOpen();
          this.loading.present();

      this.bookProvider.getBookProfile(barcodeData.text).on("value", bookProfileSnapshot => {
        this.bookProfile = bookProfileSnapshot.val();
        console.log(this.bookProfile);

        if (this.bookProfile !== null) {
          this.navCtrl.push('BookPage', { bookId: barcodeData.text, fromScan: true, loading: this.loading });

        }
        else {
          this.loading.dismiss();
          this.toast.show('Product not found', '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        }
      }
      )
    },
      (err) => {
        this.toast.show(err, '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );
      });
  }


  rechByInput(id) {
    console.log("rechByInput id:", id);

    this.bookProfile = null;

    this.bookProvider.getBookProfile(id).on("value", bookProfileSnapshot => {
      this.bookProfile = bookProfileSnapshot.val();
      console.log(this.bookProfile);

      if (this.bookProfile !== null) {
        this.loading = this.diversProvider.loadingOpen();
        this.loading.present();
        this.navCtrl.push('BookPage', { bookId: id, fromScan: true, loading: this.loading });

      }
      else {
        this.toast.show('Product not found', '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );
      }
    }
    )
  }

  cancel() {
    this.bookProfile = undefined;   // just 1 ..
  }
  //------------------------------------------------------------

  //-------------------------confirm et ajout des data SANS GEOLOCATION-------------------------
  confirmReadBook2() {
    let confIf = this.bookProvider.dejaLu(this.bookId, this.userId);
    console.log("test de dejaLu 3", confIf)
    if (confIf) {
      this.bookReader = this.bookProvider.addReaderOnBook(
        this.bookId,
        this.userId,
        45.750000,                //Lyon
        4.850000);
      console.log('bookReader', this.bookReader)

      this.bookRead = this.bookProvider.addReadBookOnUser(
        this.userId,
        this.bookId,
      );
      console.log('bookRead', this.bookRead)

      //this.bookProvider.upNbBook(this.userId, 'nbBookRead');
      //this.bookProvider.upDist(this.bookId, 45.750000, 4.850000);

      ///////
      this.navCtrl.setRoot('BookPage', { bookId: this.bookId });
    }

    else   //error
    {               //      ugly  !!!!!!!!!!!!!!!!
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
  //------------------fin SANS geoloc

  //-------------------------confirm et ajout des data AVEC GEOLOCATION-------------------------
  async confirmReadBook() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/book-gif-4.gif" class="img-align" />`,
      cssClass: 'my-loading-class',
    });
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

        //Geoloc
        await this.geolocation.getCurrentPosition()
          .then((position) => { //position
            this.position = position;
          })
        await this.bookProvider.upDist(this.bookId, this.position.coords.latitude, this.position.coords.longitude);

        this.bookReader = await this.bookProvider.addReaderOnBook(
          this.bookId,
          this.userId,
          this.position.coords.latitude,                      // --------  LOOADING !!!!!!
          this.position.coords.longitude,
        )
        this.bookRead = await this.bookProvider.addReadBookOnUser(
          this.userId,
          this.bookId,
        );
        this.loading.dismiss().then(() => {
          this.navCtrl.setRoot('BookPage', { bookId: this.bookId });
        })
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
  //------------------fin AVEC geoloc

  gotoMap() {
    let book = { bookImgUrl: this.bookImgUrl, bookId: this.bookId, title: this.title, cityReleasing: this.cityReleasing, latReleasing: this.latReleasing, lngReleasing: this.lngReleasing, dateReleasing: this.dateReleasing };
    this.navCtrl.push('MapPage', { book: book, bookProfile: this.bookProfile });
  }

}


