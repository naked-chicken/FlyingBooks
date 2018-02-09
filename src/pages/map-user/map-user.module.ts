import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapUserPage } from './map-user';

@NgModule({
  declarations: [
    MapUserPage,
  ],
  imports: [
    IonicPageModule.forChild(MapUserPage),
  ],
})
export class MapUserPageModule {}
