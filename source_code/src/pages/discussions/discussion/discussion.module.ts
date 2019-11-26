import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscussionPage } from './discussion';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    DiscussionPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscussionPage),
    PipesModule
  ],
})
export class DiscussionPageModule {}
