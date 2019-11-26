import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursemenuPage } from './coursemenu';
import { ScrollHideDirective } from '../../../directives/scroll-hide/scroll-hide';

@NgModule({
  declarations: [
    CoursemenuPage
  ],
  imports: [
    IonicPageModule.forChild(CoursemenuPage),
  ],
})
export class CoursemenuPageModule {}
