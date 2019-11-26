import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroPage } from './intro';
import { ComponentsModule } from '../../../components/components.module'; 
import { PipesModule } from '../../../pipes/pipes.module'; 

@NgModule({
  declarations: [
    IntroPage,
     
  ],
  imports: [
    IonicPageModule.forChild(IntroPage),
    ComponentsModule,
    PipesModule
  ],
})
export class IntroPageModule {}
