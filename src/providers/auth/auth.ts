import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';

import firebase from 'firebase';
import { FileChooser } from '@ionic-native/file-chooser';

@Injectable()
export class AuthProvider {
  userProfile: firebase.database.Reference;
  currentUser: firebase.User;
  imgsource: any;
  firestore = firebase.storage();

  date: any;


  constructor(
    public zone: NgZone,

  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });

  }


  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(pseudo: string, email: string, password: string): Promise<any> {

    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        let timestamp: any = firebase.database.ServerValue.TIMESTAMP;
        console.log('timestamp', timestamp)

        firebase
          .database()
          .ref(`/userProfile/${newUser.uid}/email`)
          .set(email);
        firebase
          .database()
          .ref(`/userProfile/${newUser.uid}/pseudo`)
          .set(pseudo);
        firebase
          .database()
          .ref(`/userProfile/${newUser.uid}/dateCreation`)
          .set(timestamp);

      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    const userId: string = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/userProfile/${userId}`)
      .off();
    return firebase.auth().signOut();
  }


  async updateEmail(newEmail, password) {
    let mess;
    //let mess = "Email invalid or already used";
    const credential: firebase.auth.AuthCredential = await firebase.auth.
      EmailAuthProvider.credential(
      this.currentUser.email,
      password
      );
    await this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updateEmail(newEmail)
          .then(user => {
            this.userProfile.update({ email: newEmail });
            return "Email Changed Successfully";
          })
          .catch(error => {
            console.log('mess in catch', error.message)
            return error.message;
          })

      })
      .catch(error => {
        return error.message;
      });

    return Promise.resolve(mess);
  }

  async updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    let mess = "";
    const credential: firebase.auth.AuthCredential = await firebase.auth
      .EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
      );
    await this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updatePassword(newPassword).then(user => {
        });
        mess = "Password Changed with success";
      })
      .catch(error => {
        console.error(error);
        mess = "current password invalid";
      });
    return await mess
  }

  //------------------------------delete-----------------------------

   deleteUser() {
    
     this.currentUser.delete()
      .then(function () {
        console.log("account supprimé");
        // User deleted.
      })
      .catch(function (error) {
        // An error happened.
        console.log(error.message);
      })
  }


}
