import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicProfilePage } from './public-profile';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PublicProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(PublicProfilePage),
    PipesModule,
  ],
})
export class PublicProfilePageModule {}
