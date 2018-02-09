import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform, Loading } from 'ionic-angular';
import { BookProvider } from '../../providers/book/book';

import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
//import { EmailComposer } from '@ionic-native/email-composer';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { DiversProvider } from '../../providers/divers/divers';

@IonicPage()
@Component({
  selector: 'page-confirm-book',
  templateUrl: 'confirm-book.html',
})
export class ConfirmBookPage {
  loading: Loading;

  bookId: any;
  bookImg: string;
  releaserPseudo: any;
  newReleasedBook: any;
  //newBook: any;
  book: any;
  userId: any;

  whoOnScreen = 'book';
  //options: BarcodeScannerOptions;
  //encodeData: string;
  //encodedData: any;

  //qrData = null;
  createdCode = null;

  // letterObj = {
  //   'text': "This is a dummy content to create and download pdf"
  // }
  // pdfObj = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public bookProvider: BookProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    // private emailComposer: EmailComposer
    private plt: Platform, private file: File,
    private fileOpener: FileOpener,
    private barcodeScanner: BarcodeScanner,
    public diversProvider: DiversProvider,
  ) {
    //navParam --> lien, intermediaire, comme la poste
    this.book = navParams.get('book');
    this.userId = navParams.get('userId');

  }

  ionViewDidLoad() {

    this.loading = this.diversProvider.loadingOpen();

  }
  //---------- Alert comment----------------------------
  // alertReleasedBook() {
  //   {
  //     let alert = this.alertCtrl.create({
  //       title: 'Comment if you want',
  //       inputs: [
  //         {
  //           name: 'comment',
  //           placeholder: 'bla bla bla'
  //         },
  //       ],
  //       buttons: [
  //         {
  //           text: 'No Thanks',
  //           handler: data => {
  //             this.confirmReleasedBook("")
  //           }
  //         },
  //         {
  //           text: 'Confirm',
  //           handler: data => {
  //             this.confirmReleasedBook(data.comment)
  //           }
  //         }
  //       ]
  //     });
  //     alert.present();
  //   }
  // }
  //--------------------------------------------------------

  //--------------------Confirmation sans Geolocation -----------------------------
  //async confirmReleasedBook(comment) {
  async confirmReleasedBook2() {
    //IMG
    if (this.book.volumeInfo.imageLinks === undefined) {
      this.bookImg = "assets/imgs/book-cover.png";
    }
    else {
      this.bookImg = this.book.volumeInfo.imageLinks.smallThumbnail;
    }
    //No author
    if (this.book.volumeInfo.authors === undefined) {    // !!!!!!!!!!!!!!
      this.book.volumeInfo.authors = 'unkown';
    }

    let title = this.book.volumeInfo.title.substring(0, 40);

    //Create
    this.bookProvider.CreateBook(
      title,
      this.book.volumeInfo.authors,     // bug if NO author .. if..
      this.bookImg,//
      this.userId,

      48.864716,
      2.349014,

    ).then((result) => {

      this.bookId = result.key;

      //QR Code creation
      this.createdCode = result.key;

      //add comment
      // this.bookProvider.addComment(comment, this.userId, result.key);

      //add book released on user side
      this.newReleasedBook = this.bookProvider.addReleasedBook(
        this.userId,
        result.key,
      )

      this.whoOnScreen = 'qrCode';
      this.loading.dismiss();

      console.log('test', result)
      //this.navCtrl.setRoot('BookPage', { bookId: result.key });
    })

    this.loading.present();
  }
  //----------------fin sans geolocation

  //-------------------- Confirmation avec GEOLOCATION -----------------------------------
  // confirmReleasedBook2(comment) {
  confirmReleasedBook() {

    //IMG
    if (this.book.volumeInfo.imageLinks === undefined) {
      this.bookImg = "assets/imgs/book-cover.png";
    }
    else {
      this.bookImg = this.book.volumeInfo.imageLinks.smallThumbnail;
    }
    //No author
    if (this.book.volumeInfo.authors === undefined) {
      this.book.volumeInfo.authors = 'unkown';
    }

    //Geoloc
    this.geolocation.getCurrentPosition()
      .then((position) => { //position


        let title = this.book.volumeInfo.title.substring(0, 40);

        //Create
        this.bookProvider.CreateBook(
          title,
          this.book.volumeInfo.authors,     // bug if NO author .. if..
          this.bookImg,//
          this.userId,
          position.coords.latitude,
          position.coords.longitude,

        ).then((result) => {
          this.bookId = result.key;
                //QR Code creation
          this.createdCode = result.key;


          this.newReleasedBook = this.bookProvider.addReleasedBook(
            this.userId,
            result.key,
          )

          // this.bookProvider.upNbBook(this.userId, 'nbBookReleased');
          this.whoOnScreen = 'qrCode';

          this.loading.dismiss();

          console.log('test', result)
          console.log('bookId', this.bookId)
          // this.navCtrl.setRoot('BookPage', { bookId: result.key });
        })

      })
    // })
    this.loading.present();
  }




  //--------------------go to Book Page---------------------------------------
  gotoBookProfile() {
    console.log('move')
    this.navCtrl.setRoot('BookPage', { bookId: this.bookId });
  }



  //---------------------------Encoding your data as barcode------------------------------------
  // encodeText() {   //  permet de sauvegarder le qr code directement, mais sans le pdf
  //   this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData).then((encodedData) => {

  //     console.log(encodedData);
  //     this.encodedData = encodedData;

  //   }, (err) => {
  //     console.log("Error occured : " + err);
  //   });
  // }

  //----------------------------PDF-------------------------------------------
  //   createPdf() {               //bof
  //   //-----encoding
  //    let result = this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.createdCode)   // bug sur android
  //     // .then((data) => {

  //     //   console.log('data first', data);
  //     //   this.encodedData = data;

  //     // }, (err) => {
  //     //   console.log("Error occured : " + err);
  //     // });

  //   console.log('result', result)
  //   this.letterObj = {
  //     'text': "This is a dummy content to create and download pdf"
  //   }

  //   //------pdf
  //   var docDefinition = {
  //     content: [
  //       { text: 'QR CODE', style: 'header' },
  //       { text: new Date().toTimeString(), alignment: 'right' },
  //       { text: 'Imprimez moi! et collez moi sur le dos du livre. ', style: 'subheader' },
  //       { text: result, style: 'subheader' },

  //       // {
  //       //   image: '',
  //       //   width: 150,
  //       //   heigth: 150
  //       // },


  //       { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] }

  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //       },
  //       subheader: {
  //         fontSize: 14,
  //         bold: true,
  //         margin: [0, 15, 0, 0]
  //       },
  //       story: {
  //         italic: true,
  //         alignment: 'center',
  //         width: '50%',
  //       }
  //     }
  //   }
  //  this.pdfObj = pdfMake.createPdf(docDefinition);
  //   console.log('pdfObj', this.pdfObj)
  //   alert('created successfully');

  //  this.downloadPdf();
  // }

  // downloadPdf() {
  //   if (this.plt.is('cordova')) {
  //     console.log('pdfObj', this.pdfObj)

  //     this.pdfObj.getBuffer((buffer) => {
  //       var blob = new Blob([buffer], { type: 'application/pdf' });
  //       console.log('blob', blob)
  //       let folderName = 'myDir'
  //       console.log('this.file', this.file)
  //       console.log('this.file.externalRootDirectory', this.file.externalRootDirectory)

  //       // create a folder as myDir in external Root Directory Directory and Save the PDF file in that folder .
  //       this.file.writeFile(this.file.externalRootDirectory, 'Pdf_FlyingBook.pdf', blob, { replace: true })
  //         .then(fileEntry => {
  //           console.log('fileEntry', fileEntry)
  //           //Open the PDf with the correct OS tools
  //           this.fileOpener.open(this.file.externalRootDirectory + '/Pdf_FlyingBook.pdf', 'application/pdf');
  //         })
  //     });
  //   } else {
  //     this.pdfObj.download();
  //   }
  // }


  generatePdf() {

    this.loading.present();

    const div = document.getElementById("Html2Pdf");
    const options = { background: "white", height: div.clientHeight, width: div.clientWidth };
    html2canvas(div, options).then((canvas) => {
      //Initialize JSPDF
      var doc = new jsPDF("p", "mm", "a4");
      //Converting canvas to Image
      let imgData = canvas.toDataURL("image/PNG");
      //Add image Canvas to PDF
      doc.addImage(imgData, 'PNG', 20, 20);

      let pdfOutput = doc.output();
      // using ArrayBuffer will allow you to put image inside PDF
      let buffer = new ArrayBuffer(pdfOutput.length);
      let array = new Uint8Array(buffer);
      for (var i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
      }

      //This is where the PDF file will stored , you can change it as you like

      //Name of pdf
      const fileName = "example.pdf";

      //Writing File to Device
      this.file.writeFile(this.file.externalRootDirectory, 'Pdf_FlyingBook.pdf', buffer, { replace: true })
        // .then((success) => console.log("File created Succesfully" + JSON.stringify(success)))
        .then(fileEntry => {
          this.loading.dismiss();
          console.log('fileEntry', fileEntry)
          //Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.externalRootDirectory + '/Pdf_FlyingBook.pdf', 'application/pdf');
        })
        .catch((error) => {
          this.loading.dismiss();
          alert('error');
          console.log("Cannot Create File " + JSON.stringify(error));
        })
    });
  }

}
