import { Pipe, PipeTransform } from '@angular/core'; 
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';


/**
 * Generated class for the VideoUrlPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'videoUrl',
})
export class VideoUrlPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer){}
  
  transform(value: string, ...args) {
    let trustedVideoUrl: SafeResourceUrl;

    trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(value);
    return trustedVideoUrl;
  }
}
