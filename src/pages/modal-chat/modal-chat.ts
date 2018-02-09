import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Refresher, Content } from 'ionic-angular';
import { BookProvider } from '../../providers/book/book';
import { DiversProvider } from '../../providers/divers/divers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@IonicPage()
@Component({
  selector: 'page-modal-chat',
  templateUrl: 'modal-chat.html',
})
export class ModalChatPage {
  @ViewChild(Content) content: Content; // <-- get a reference of the content

  placeHolder: string = '';
  inputShow = false;
  bookImgUrl: any;
  title: any;
  userId: any;
  bookId: any;
  bookCommentsDataTab: any[];

  CommentForm: FormGroup;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    params: NavParams,
    public viewCtrl: ViewController,
    public bookProvider: BookProvider,
    public diversProvider: DiversProvider,
    public alertCtrl: AlertController,
    formBuilder: FormBuilder,

  ) {

    this.bookId = params.get('bookId');
    this.userId = params.get('userId');
    this.title = params.get('title');
    this.bookImgUrl = params.get('bookImgUrl');

    this.CommentForm = formBuilder.group({
      Comment: ['',
        Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(2),])],
    });


  }

  //-------------------ionView-------------------------
  ionViewDidLoad() {
    this.getComments();
    // this.bookProvider.getBookCommentsIdTab(this.bookId).then(value => {
    //   console.log('value', value)
    //   this.bookCommentsDataTab = value.reverse();
    //   this.scrollToBottom();

    //   console.log('bookCommentsDataTab final final !!', this.bookCommentsDataTab)

    // });

  }
  //------------------------------------------------------------------------------
   async getComments() {
     await this.bookProvider.getBookCommentsIdTab(this.bookId).then(value => {
      console.log('value', value)
      this.bookCommentsDataTab = value.reverse();
      console.log('bookCommentsDataTab final final !!', this.bookCommentsDataTab)
    });
    await this.scrollToBottom();
  }

  scrollToBottom() {
    // use the content's dimension to obtain the current height of the scroll
    let dimension = this.content.getContentDimensions();

    // scroll to it (you can also set the duration in ms by passing a third parameter to the scrollTo(x,y,duration) method.
    this.content.scrollTo(0, dimension.scrollHeight);
  }

  //-------------------------refresh-------------------------------------------
  // refresh() {
  //   console.log('refresh');
  //   this.bookProvider.getBookCommentsIdTab(this.bookId).then(value => {
  //     this.bookCommentsDataTab = value.reverse();
  //     console.log('bookCommentsDataTab refresh !!', this.bookCommentsDataTab)
  //   });
  //   this.scrollToBottom();
  // }

  doRefresh(refresher: Refresher) {
    console.log('DOREFRESH', refresher);

    this.bookProvider.getBookCommentsIdTab(this.bookId).then(value => {
      this.bookCommentsDataTab = value.reverse();

      console.log('bookCommentsDataTab refresh !!', this.bookCommentsDataTab)

    });
    refresher.complete();
    this.scrollToBottom();
  }

  doPulling(refresher: Refresher) {
    console.log('DOPULLING', refresher.progress);
  }
  //----------------------------------------------------------------------------------
  //--------------------------------addRemInputComment-------------------------------

  addRemInputComment() {
    console.log('inputShow', this.inputShow)
    if (this.inputShow) {
      this.inputShow = false;
    }
    else {
      this.inputShow = true;
    }
  }
  //-------------------------------------------------------------------------------
  //-------------------ADD Comment----------------------------------------------
  addComment() {
    if (!this.CommentForm.valid) {
      console.log('NOvalid', this.CommentForm.value);
    } else {
      const comment = this.CommentForm.value.Comment;

      this.bookProvider.addComment(comment, this.userId, this.bookId).then((result) => {
        if (result != 'nochange') {
          this.bookCommentsDataTab.push(result);
          this.inputShow = false;
          this.placeHolder = '';
        }

      });
      this.scrollToBottom();

    }

  }
  //-----------------------------------------------------------------

  //------------------Test User pour Remove--------------------------------------------
  testUser(commenterId) {
    return commenterId == this.userId;
  }
  //-------------------------------------------------------------------

  //------------------REMOVE Comment ---------------------------------------------------

  removeComment(commentId, i) {
    // let tab =this.bookCommentsDataTab;
    let alert = this.alertCtrl.create({
      subTitle: "Delete this message ?",
      buttons: [
        {
          text: "No",
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: data => {
            this.bookProvider.removeComment(this.bookId, commentId);
            this.bookCommentsDataTab.splice(i, 1);
          }
        }
      ]
    });
    alert.present();

  }
  //-------------------------------------------------------------------------------------

  //-------------------go to profil---------------------------
  gotoProfil(dudeId) {
    this.navCtrl.push("PublicProfilePage", { dudeId: dudeId });
  }
  //--------------------dismiss--------------------------
  dismiss() {
    this.viewCtrl.dismiss();
  }

  //---------------------Report---------------------------------

  // alreadyrep(commenterId) {
  //   console.log('modal chat')
  //   let result = this.diversProvider.alreadyReport(commenterId, this.userId);
  //   console.log('result ds mc', result)

  //   return result;
  // }

  reportUser(commenterId) {
    //let alreadyReport;
    // await this.diversProvider.alreadyReport(commenterId, this.userId).then(alreadyReport => {
    if (this.diversProvider.alreadyReport(commenterId, this.userId)) {
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
              this.diversProvider.reportUser(commenterId, this.userId, this.bookId);
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




}
