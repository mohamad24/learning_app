import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourseOptionsPage } from './course-options';

@NgModule({
  declarations: [
    CourseOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(CourseOptionsPage),
  ],
})
export class CourseOptionsPageModule {}
