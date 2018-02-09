import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AuthProvider } from './../providers/auth/auth';
import { ProfileProvider } from '../providers/profile/profile';
import { BookApiService } from '../Services/bookapi.service';

import { ConfirmBookPage } from '../pages/confirm-book/confirm-book';
import { HttpModule } from '@angular/http'; // DANGER ZONE
import { HttpClientModule } from '@angular/common/http';
import { BookProvider } from '../providers/book/book';

import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { Toast } from '@ionic-native/toast';
import { ModalModifPage } from '../pages/modal-modif/modal-modif';
import { ModalChatPage } from '../pages/modal-chat/modal-chat';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-Path';

import { Camera } from '@ionic-native/camera';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
} from '@ionic-native/google-maps';

//import { EmailComposer } from '@ionic-native/email-composer';
//import { PdfProvider } from '../providers/pdf/pdf';

import { FileOpener } from '@ionic-native/file-opener';
import { DiversProvider } from '../providers/divers/divers';

import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConfirmBookPage,
    ModalModifPage,
    ModalChatPage,
    
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserModule,
    NgxQRCodeModule,
    IonicModule.forRoot(MyApp),    

    PipesModule,
   
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ConfirmBookPage,
    ModalModifPage,
    ModalChatPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    ProfileProvider,
    BookApiService,
    BookProvider,
    // PublicProfileProvider,   // -----------
    BarcodeScanner,
    Toast,
    FileChooser,
    FilePath,
    File,
    Camera,
    Geolocation,
    NativeGeocoder,
    GoogleMaps,
    // EmailComposer,
    // PdfProvider,
    FileOpener,
    DiversProvider,
    ]
})
export class AppModule { }
