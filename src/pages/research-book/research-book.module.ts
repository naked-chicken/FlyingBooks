import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResearchBookPage } from './research-book';

@NgModule({
  declarations: [
    ResearchBookPage,
  ],
  imports: [
    IonicPageModule.forChild(ResearchBookPage),
  ],
})
export class ResearchBookPageModule {}
