import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'nbCommentPipe',
})
export class NbCommentPipe implements PipeTransform {

  transform(value: number, ...args) {
    if (value < 2) {
      return value + " comment";
    }
    else {
      return value + " comments";
    }  }
}
