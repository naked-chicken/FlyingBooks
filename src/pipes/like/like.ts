import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the LikePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'likePipe',
})
export class LikePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args) {
    if (value < 2) {
      return value + " like";
    }
    else {
      return value + " likes";
    }
  }
}
