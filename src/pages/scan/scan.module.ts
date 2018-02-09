import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanPage } from './scan';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ScanPage,
  ],
  imports: [
    IonicPageModule.forChild(ScanPage),
    PipesModule,
  ],
})
export class ScanPageModule {}
