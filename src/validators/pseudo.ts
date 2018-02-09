import { FormControl } from '@angular/forms';
import firebase from 'firebase';


export class PseudoValidator {

    static async isValid(control: FormControl) {
        // const re = /^([a-zA-Z0-9_\-\.])$/
        //     .test(control.value);

        // if (re) {
        //     return null;
        // }

        let tab = [];
        await firebase.database().ref(`/userProfile`).once('value', (snapshot) => {
            snapshot.forEach(snap => {
                tab.push(snap.val().pseudo);
                return false;
            })
        })
        // console.log('tab', tab)
        // console.log('control.value', control.value)
        // console.log('tab.indexOf(control.value)', tab.indexOf(control.value))
        if (tab.indexOf(control.value) === -1) {
            console.log('in If')
            return null;
        }


        return {
            invalidPseudo: true
        };


    }
}