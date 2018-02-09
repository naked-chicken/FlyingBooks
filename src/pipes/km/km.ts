import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'km',
})
export class KmPipe implements PipeTransform {

  transform(value: number, ...args) {

    if (value > 1000) {
      let d = Math.round(value / 1000);
      return d + "k";
    }
    else {
      return value;
    }
  }
}
