import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LecturePage } from './lecture';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { ScrollHideDirective } from '../../../directives/scroll-hide/scroll-hide';

@NgModule({
  declarations: [
    LecturePage,
    ScrollHideDirective
  ],
  imports: [
    IonicPageModule.forChild(LecturePage),
    ComponentsModule,
    PipesModule, 
  ],
})
export class LecturePageModule {}
