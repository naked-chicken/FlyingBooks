import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClassementPage } from './classement';

@NgModule({
  declarations: [
    ClassementPage,
  ],
  imports: [
    IonicPageModule.forChild(ClassementPage),
  ],
})
export class ClassementPageModule {}
