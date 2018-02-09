import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, Alert, AlertController } from 'ionic-angular';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { HomePage } from '../home/home';
import { AuthProvider } from './../../providers/auth/auth';
import { ProfilePage } from '../profile/profile';

import firebase from 'firebase';
import { DiversProvider } from '../../providers/divers/divers';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginFormByPseudo: FormGroup;

  public loginForm: FormGroup;
  //public loading: Loading;

  register = "pseudo";


  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public diversProvider: DiversProvider,
    formBuilder: FormBuilder
  ) {
    this.loginForm = formBuilder.group({
      email: ['',
        Validators.compose([Validators.required, Validators.maxLength(40), EmailValidator.isValid])],
      password: ['',
        Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(6)])]
    });

    this.loginFormByPseudo = formBuilder.group({
      Pseudo: ['',
        Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(3), Validators.pattern('[a-zA-Z0-9_. ]*')])],  //PseudoValidators ASYNC !!!
      password: ['',
        Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(6)])]
    });
  }
  // -----------------------------connect with pseudo !!!!!----------------------------------------
  async getEmailOfPseudo(tab, Pseudo) {

    let i = 0;
    while (i < tab.length) {

      if (tab[i].pseudo == Pseudo) {
        return tab[i].email;
      }
      else {
        if (i == tab.length - 1) {
          return "false";
        }
        else { i++; }
      }
    }
  }

  async loginUserByPseudo() {
    let loading = this.diversProvider.loadingOpen();
    loading.present();

    if (!this.loginFormByPseudo.valid) {
      console.log('NOvalid', this.loginFormByPseudo.value);
    } else {
      let email, password = this.loginFormByPseudo.value.password, Pseudo = this.loginFormByPseudo.value.Pseudo, tab = [];

      await firebase.database().ref(`/userProfile`).once('value', (snapshot) => {
        snapshot.forEach(snap => {
          tab.push({ email: snap.val().email, pseudo: snap.val().pseudo });
          return false;
        })
      })

      await this.getEmailOfPseudo(tab, Pseudo).then(res => {

        if (res == "false") {
          loading.dismiss().then(() => {
            let alert = this.diversProvider.alertMM("pseudo invalid, or deleted", "if you loose it, please try by your email" );
          });
        }

        else {
          email = res;
          this.authProvider.loginUser(email, password)
            .then(
            authData => {
              loading.dismiss().then(() => {
                this.navCtrl.setRoot('ProfilePage');
              });
            },
            error => {
              loading.dismiss().then(() => {
                let alert = this.diversProvider.alertM("password incorrect");
              });
            });
        }
      })
    }
  }
  //------------------------------------------------------------------------------------------------------

  // -----------------------------connect with email !!!!!----------------------------------------

  loginUser(): void {
    let loading = this.diversProvider.loadingOpen();
    loading.present();
    if (!this.loginForm.valid) {
      console.log('NOvalid', this.loginForm.value);
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authProvider.loginUser(email, password)
        .then(
        authData => {
          //loading.dismiss().then(() => {
            this.navCtrl.setRoot('ProfilePage', {loading: loading});
         // });
        },
        error => {
          console.log("error", error)
          loading.dismiss().then(() => {

            if (error.code == "auth/wrong-password") {
              let alert = this.diversProvider.alertM("password incorrect");
            }
            else {
              let alert = this.diversProvider.alertMM(error.message, "if you loose it, please try by your pseudo");
            }
          });
        });
    }
  }
  //---------------------------------------------------------------------------------------------------------------

  goToSignup(): void {
    this.navCtrl.push('SignupPage');
  }

  goToResetPassword(): void {
    this.navCtrl.push('ResetPasswordPage');
  }


}
