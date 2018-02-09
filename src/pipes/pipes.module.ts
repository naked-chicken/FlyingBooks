import { NgModule } from '@angular/core';
import { AgePipe } from './age/age';
import { AgeCommentPipe } from './age-comment/age-comment';
import { LikePipe } from './like/like';
import { NbCommentPipe } from './nb-comment/nb-comment';
import { NbPipe } from './nb/nb';
import { CountryNamePipe } from './country-name/country-name';
import { KmPipe } from './km/km';
@NgModule({
	declarations: [
		AgePipe,
    AgeCommentPipe,
    LikePipe,
    NbCommentPipe,
    NbPipe,
    CountryNamePipe,
    KmPipe],
	imports: [],
	exports: [
		AgePipe,
    AgeCommentPipe,
    LikePipe,
    NbCommentPipe,
    NbPipe,
    CountryNamePipe,
    KmPipe]
})
export class PipesModule { }
