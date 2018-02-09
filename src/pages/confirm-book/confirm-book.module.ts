import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmBookPage } from './confirm-book';

@NgModule({
  declarations: [
    ConfirmBookPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmBookPage),
  ],
})
export class ConfirmBookPageModule {}
