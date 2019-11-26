import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the MakeintPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'makeint',
})
export class MakeintPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    return parseInt(value) * 1000;
  }
}
