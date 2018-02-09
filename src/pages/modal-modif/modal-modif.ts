import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, ViewController, AlertController, LoadingController, Loading, ActionSheetController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';

import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-Path';

import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthProvider } from './../../providers/auth/auth';
import { DiversProvider } from '../../providers/divers/divers';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { PseudoValidator } from '../../validators/pseudo';
import { EmailValidator } from '../../validators/email';




@IonicPage()
@Component({
  selector: 'page-modal-modif',
  templateUrl: 'modal-modif.html',
})
export class ModalModifPage {
  user: any;
  passwordForm: FormGroup;
  emailForm: FormGroup;
  PseudoForm: FormGroup;

  // email: any;
  // nation: any;
  // userId: any;
  // birthDate: any;
  // pseudo: string;

  nativepath: any;
  firestore = firebase.storage();
  imgsource: any;

  public loading: Loading;

  modiList = "profile";

  //----------------option country select------------------------------
  selectOptions = {
    //title: 'Pizza Toppings',
    //subTitle: 'Select your country',
    //mode: 'md',
    cssClass: 'selectClass'
  };


  constructor(public navCtrl: NavController,
    params: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public profileProvider: ProfileProvider,
    public authProvider: AuthProvider,
    public diversProvider: DiversProvider,
    public zone: NgZone,
    public fileChooser: FileChooser,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    formBuilder: FormBuilder,


  ) {
    this.user = params.get('user');

    this.imgsource = this.user.imgUrl;
    // this.pseudo = params.get('pseudo');
    // this.birthDate = params.get('dob');
    // this.userId = params.get('userId');
    // this.imgsource = params.get('imgUrl');
    // this.nation = params.get('nation');
    // this.email = params.get('email');

    this.PseudoForm = formBuilder.group({
      Pseudo: ['',
        Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(3), Validators.pattern('[a-zA-Z0-9_. ]*')]), PseudoValidator.isValid],  //PseudoValidators ASYNC !!!
    });

    this.emailForm = formBuilder.group({
      email: ['',
        Validators.compose([Validators.required, Validators.maxLength(40), EmailValidator.isValid])],
      password: ['',
        Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(6)])]
    })

    this.passwordForm = formBuilder.group({
      oldPassword: ['',
        Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(6)])],
      newPassword1: ['',
        Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(6)])],
      newPassword2: ['',
        Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(6)])],

    });

  }

  //----------------------------------IMG-------------------------------------------
  changePicture(): void {
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Take a picture',
          icon: 'camera',
          handler: () => {
            this.uploadFromCamera();
          }
        }, {
          text: 'From gallery',
          icon: 'images',
          handler: () => {
            this.uploadFromGallery();
          }
        }
      ]
    });
    actionSheet.present();
  }

  //--------------------------CAMERA--------------------------------

  private takePictureOptions: CameraOptions = {
    allowEdit: true,
    saveToPhotoAlbum: true,
    targetWidth: 720,
    targetHeight: 720,
    cameraDirection: this.camera.Direction.BACK,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.FILE_URI,
  }

  private galleryOptions: CameraOptions = {
    allowEdit: true,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    targetWidth: 720,
    targetHeight: 720,
    correctOrientation: true
  }

  //Take a picture and return a promise with the image data
  uploadFromCamera() {
    this.camera.getPicture(this.takePictureOptions).then((imagePath) => {
      return this.uploadimage(imagePath);      //convert picture to blob and ... upload

    }).then((_uploadSnapshot: any) => {
      alert('file saved to catalog successfully  ');
    }, (_error) => {
      alert('Error ' + (_error.message || _error));
    });
  }

  //open the gallery and Return a promise with the image data
  uploadFromGallery() {
    this.camera.getPicture(this.galleryOptions).then((imagePath) => {
      return this.uploadimage(imagePath);    //convert picture to blob and ... upaload

    }).then((_uploadSnapshot: any) => {
      alert('file saved to catalog successfully  ');
    }, (_error) => {
      alert('Error ' + (_error.message || _error));
    });
  }

  //--------------------------------------------------


  store() {              // récupération IMG sans passer par la caméra
    this.fileChooser.open().then((url) => {
      (<any>window).FilePath.resolveNativePath(url, (result) => {
        this.nativepath = result;
        this.uploadimage(this.nativepath);
      }
      )
    })
  }

  uploadimage(_imagePath) {          //------------- Fct KING !!!! ----------
    (<any>window).resolveLocalFileSystemURL(_imagePath, (res) => {
      res.file((resFile) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
          var imageStore = this.firestore.ref().child('avatarProfile').child(this.user.userId);
          imageStore.put(imgBlob)
            .then((res) => {
              this.loading.dismiss();
              alert('Upload Success');
              this.display();
            })
            .catch((err) => {
              this.loading.dismiss();
              alert('Upload Failed' + err);
            })
        }
        this.loading = this.loadingCtrl.create({
          content: 'please wait...',
          spinner: 'bubbles',
        });
        this.loading.present();
      })
    })
  }

  display() {        //--------------- récupération de l' URL , affichage et update automatique  ---------------
    this.firestore.ref().child('avatarProfile').child(this.user.userId).getDownloadURL().then((url) => {
      this.zone.run(() => {
        this.imgsource = url;
        this.updateIMG(url);
      })
    })
  }
  //-------------------------------fin IMG-----------------------------------------------------------------

  //---------------------------------Update-----------------------------------------------------------------
  updateNation(nation) {
    this.profileProvider.updateNation(nation);
  }

  updateDOB(birthDate: string): void {
    this.profileProvider.updateDOB(birthDate);
  }

  updateIMG(imgUrl): void {
    this.profileProvider.updateIMG(imgUrl);
  }

  //------------Pseudo-------------------
  updatePseudo(): void {
    if (!this.PseudoForm.valid) {
      console.log('NOvalid', this.PseudoForm.value);
    } else {
      const pseudo: string = this.PseudoForm.value.Pseudo;
      this.profileProvider.updatePseudo(pseudo).then(() => {
        this.diversProvider.alertM('pseudo changed with success');
      })
    }
  }
  //-------------------------------------

  updateEmail() {                      //----- à ameliorer
    if (!this.emailForm.valid) {
      console.log('NOvalid', this.emailForm.value);
    } else {
      this.authProvider
        .updateEmail(this.emailForm.value.email, this.emailForm.value.password)
        .then(mess => {
          console.log("mess to send", mess)
          this.diversProvider.alertM(mess)
        })
        .catch(error => {
          console.log('catch error', error)
          this.diversProvider.alertM('ERROR: ' + error.message);
        });
    }
  }

  updatePassword(): void {
    if (!this.passwordForm.valid) {
      console.log('NOvalid', this.passwordForm.value);
    } else {
      if (this.passwordForm.value.newPassword1 != this.passwordForm.value.newPassword2) {
        this.diversProvider.alertM("password failed")
      }
      else {
        this.authProvider.updatePassword(
          this.passwordForm.value.newPassword1,
          this.passwordForm.value.oldPassword)
          .then(mess => {
            console.log("mess", mess)
            this.diversProvider.alertM(mess)
          })
          .catch(error => { this.diversProvider.alertM(error.message); });
      }
    }


  }


  //-----------------------------------------------------------------------------------

  //-------------------------------------delete--------------------------------------------
  delete() {
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
          this.diversProvider.deleteReportsComments(this.user.pseudo).then(() => {
            loading.dismiss();
            this.navCtrl.setRoot("LoginPage");     //navCrl pas possible ds provider
          })
        }
      }]
    });
    alert.present();

    // let alert = this.diversProvider.alertMF("delete your profile for sure ?", this.diversProvider.deleteReportsComments(this.pseudo));
    // alert.present().then(() => {
    //   let loading = this.diversProvider.loading1();
    //   loading.present();
    //   setTimeout(() => {
    //     loading.dismiss();
    //     this.navCtrl.setRoot("LoginPage");
    //   }, 5000);
    // });

  }
  // let loading = this.loadingCtrl.create({
  //   spinner: 'hide',
  //   content: `
  //   <div class="loading-custom-spinner-container">
  //     <div class="loading-custom-spinner-box"></div>
  //   </div>
  //   <div><img src="assets/imgs/delete" class="img-align" /></div>`,

  // });
  // loading.present();
  // setTimeout(() => {
  //   loading.dismiss();
  //   this.navCtrl.setRoot("LoginPage");
  // }, 3000);

  //this.navCtrl.setRoot("LoginPage");   // maybe set time


  //--------------------------------------------------------------------------------------

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot("LoginPage");
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalModifPage');
  }

}
