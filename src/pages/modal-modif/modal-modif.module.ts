import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalModifPage } from './modal-modif';

@NgModule({
  declarations: [
    ModalModifPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalModifPage),
  ],
})
export class ModalModifPageModule {}
