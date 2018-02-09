import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, AlertController } from 'ionic-angular';
import { BookProvider } from '../../providers/book/book';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { ProfileProvider } from '../../providers/profile/profile';
import { DiversProvider } from '../../providers/divers/divers';


@IonicPage()
@Component({
  selector: 'page-public-profile',
  templateUrl: 'public-profile.html',
})
export class PublicProfilePage {
  nation: any;
  loading: any;
  userId: any;
  flag: string;
  age: string;
  today: string;

  imgUrl = "assets/imgs/avatar.png";

  dudeBookReadDataTab = [];


  bookList: string = "released";   ////necessaire pour toolbar


  dudeBookReleasedDataTab = [];

  dateCreation: Date;
  birthDate: any;
  dudeId: any;

  showNation = false;


  public pseudo: any;
  public email: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public profileProvider: ProfileProvider,
    public bookProvider: BookProvider,
    public geocoder: NativeGeocoder,
    public diversProvider: DiversProvider,

  ) {

    this.dudeId = navParams.get('dudeId');
    this.userId = navParams.get('userId');
    this.loading = navParams.get('loading');

  }



  ionViewDidLoad() {
    console.log('dudeId', this.dudeId)
    if (!this.loading) {
      console.log('!this.loading', !this.loading)
      this.loading = this.diversProvider.loadingOpen();
      this.loading.present();
    }

    //recuperation du profil
    this.getProfile().then(() => {


      //recup de la liste des livres relachés
      this.profileProvider.getUserBookReleasedDataTab(this.dudeId).then(value => {
        this.dudeBookReleasedDataTab = value;
        console.log('breleasedtab with DATA', this.dudeBookReleasedDataTab)


        //recup de la liste des livres lus
        this.profileProvider.getUserBookReadDataTab(this.dudeId).then(value => {
          this.dudeBookReadDataTab = value;
          console.log("userBookReadDataTab", this.dudeBookReadDataTab)
          setTimeout(fonction => {
            this.loading.dismiss();
          }, 2000)
        })
      })
    })

  }//---------------fin ionviewdidload---------------------


  //recup du profil
  async getProfile() {
    let fdr = await this.profileProvider.getUserProfile(this.dudeId);
    console.log('fdr', fdr)
    await fdr.on("value", dudeProfileSnapshot => {
      let dudeProfile = dudeProfileSnapshot.val();
      if (dudeProfile) {
        console.log('userProfile 00', dudeProfile)
        if (dudeProfile.birthDate) {
          this.birthDate = dudeProfile.birthDate;
        }
        this.pseudo = dudeProfile.pseudo;  //recup du pseudo
        this.email = dudeProfile.email;    //recup de l'email
        if (dudeProfile.imgUrl !== undefined) {
          this.imgUrl = dudeProfile.imgUrl;  //      img
        }
        this.dateCreation = dudeProfile.dateCreation;
        if (dudeProfile.nation) {
          this.nation = dudeProfile.nation;
          this.flag = "assets/flag-icon-css/flags/4x3/" + dudeProfile.nation.toLowerCase() + ".svg";
        }
      }
    })
  }

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


  //-------------------------report--------------------------------
  reportUser() {
    //let alreadyReport;
    // await this.diversProvider.alreadyReport(commenterId, this.userId).then(alreadyReport => {
    if (this.diversProvider.alreadyReport(this.dudeId, this.userId)) {
      let alert = this.alertCtrl.create({
        message: "user already been reported",
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present();
    }
    else {
      let alert = this.alertCtrl.create({
        subTitle: 'Confirm you want to report that user ?',
        buttons: [
          {
            text: "No",
            role: 'cancel'
          },
          {
            text: 'Confirm',
            handler: data => {
              this.diversProvider.reportUser(this.dudeId, this.userId, "onProfile");
              let alert = this.alertCtrl.create({
                subTitle: 'user reported',           // or message
              })
              alert.present();
              setTimeout(() => alert.dismiss(), 3000);
            }
          }
        ]
      });
      alert.present();
    }
    // })
  }


  //-----------------------changement de page---------------------

  gotobook(bookId): void {
    this.navCtrl.push("BookPage", { bookId: bookId });
  }

  gotoTrophy(): void {
    this.navCtrl.push("ClassementPage", { userId: this.dudeId });
  }

  gotoMap(): void {
    let user = { userId: this.dudeId, pseudo: this.pseudo, imgUrl: this.imgUrl, }
    this.navCtrl.push("MapUserPage", { user: user, readTab: this.dudeBookReadDataTab, releasedTab: this.dudeBookReleasedDataTab });
  }

  gotoprofile(): void {
    this.navCtrl.push("ProfilePage");
  }

}
