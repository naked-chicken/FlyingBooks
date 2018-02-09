import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'nbPipe',
})
export class NbPipe implements PipeTransform {

  transform(value: number, ...args) {
    if (value == 0) {
      return "not read";
    }
    else {
      if (value == 1) {
        return "1 time";
      }
      else {
        return value + " times"
      }
    }
  }
}

