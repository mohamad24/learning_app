import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClassPage } from './class';
import { ComponentsModule } from '../../../components/components.module';
import { ScrollHideDirective } from '../../../directives/scroll-hide/scroll-hide';
 

@NgModule({
  declarations: [
    ClassPage
  ],
  imports: [
    IonicPageModule.forChild(ClassPage),
    ComponentsModule 
  ],
})
export class ClassPageModule {}
