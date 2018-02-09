import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

import { BookApiService } from '../../Services/bookapi.service';
import { templateVisitAll } from '@angular/compiler';
import { ConfirmBookPage } from '../confirm-book/confirm-book';

@IonicPage()
@Component({
  selector: 'page-research-book',
  templateUrl: 'research-book.html',
})
export class ResearchBookPage {
  @ViewChild(Content) content: Content; // <-- get a reference of the content


  userPseudo: any;

  books = {items: []}; //initialiser sinon bug des le debut
  userId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private bookApiService: BookApiService) {

    this.userId = navParams.get('id');
    console.log(this.userId);
  }

  //récupération des données API
  async getBooks(ev) {
    console.log(ev);
    if (ev !== '' && ev !== undefined) {
      await this.bookApiService.getbooksapi(ev)
        .then(booksFetched => {
          this.books = booksFetched;
          console.log(this.books);
        });
      await this.scrollToBottom();

    }
    else {
      this.books.items = [];
      ev = '';
      console.log('reinit');
    }

  }

  scrollToBottom() {
    // use the content's dimension to obtain the current height of the scroll
    let dimension = this.content.getContentDimensions();

    // scroll to it (you can also set the duration in ms by passing a third parameter to the scrollTo(x,y,duration) method.
    this.content.scrollTo(0, dimension.scrollHeight);
  }

  //changement de page sur un click
  //book: {};
  private confirm(book) {
    console.log('move');

    //changement de page en direction de confirmbook page et envoie d'1 objet avec plusierus parametres
    this.navCtrl.push(ConfirmBookPage, {
      userId: this.userId,
      book: book,
    });
  }

}
