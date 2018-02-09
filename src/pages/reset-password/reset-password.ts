import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, AlertController } from 'ionic-angular';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthProvider } from './../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  public resetPasswordForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController
  ) {
    this.resetPasswordForm = formBuilder.group({
      email: ['',
        Validators.compose([Validators.required, EmailValidator.isValid])],
    });

  }

  resetPassword() {
    if (!this.resetPasswordForm.valid) {
      console.log('NOvalid', this.resetPasswordForm.value);
    } else {
      const email: string = this.resetPasswordForm.value.email;
      this.authProvider.resetPassword(email)
        .then(
        (user) => {
          let alert = this.alertCtrl.create({
            message: "We sent you a reset link to your email",
            buttons: [
              {
                text: "Ok",
                role: 'cancel',
                handler: () => { this.navCtrl.pop(); }
              }
            ]
          });
          alert.present();

        },
        (error) => {
          const errorAlert = this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: "Ok", role: 'cancel' }]
          });
          errorAlert.present();
        });
    }
  }

}
