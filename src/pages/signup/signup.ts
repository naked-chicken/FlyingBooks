import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { HomePage } from '../home/home';
import { PseudoValidator } from '../../validators/pseudo';
import { DiversProvider } from '../../providers/divers/divers';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  loading: Loading;

  public signupForm: FormGroup;
  //public loading: Loading;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public diversProvider: DiversProvider,

  ) {

    this.signupForm = formBuilder.group({
      pseudo: ['',
        Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(3), Validators.pattern('[a-zA-Z0-9_. ]*')]), PseudoValidator.isValid],  //PseudoValidators ASYNC !!!
      email: ['',
        Validators.compose([Validators.required, Validators.maxLength(40), EmailValidator.isValid])],
      password: ['',
        Validators.compose([Validators.minLength(6), Validators.maxLength(20), Validators.required])]
    });

  }



  signupUser() {
    let loading = this.diversProvider.loadingOpen();
    loading.present();
    if (!this.signupForm.valid) {
      console.log('NOvalid', this.signupForm.value);
    } else {
      const email: string = this.signupForm.value.email;
      const password: string = this.signupForm.value.password;
      const pseudo: string = this.signupForm.value.pseudo;

      this.authProvider.signupUser(pseudo, email, password).then(
        user => {
         // loading.dismiss().then(() => {
         // this.loading = this.diversProvider.loadingOpen();
          // this.loading.present();
             this.navCtrl.setRoot('ProfilePage', {loading: loading});
           // this.navCtrl.setRoot('ProfilePage');

         // });
        },
        error => {
          loading.dismiss().then(() => {
            this.diversProvider.alertM(error.message);
          });
        });

    }
  }

}




