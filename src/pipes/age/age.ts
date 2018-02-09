import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  
  transform(value: string, ...args) {
    
    let today = new Date().toISOString();
    
    //  No bug for 50 years old people ...
    return (((Date.parse(today)) - (Date.parse(value))) / 31536000000).toFixed(0) + " ans";
  }
}
