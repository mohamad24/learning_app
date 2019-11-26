import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumTopicsPage } from './forum-topics';
import { IonicImageLoader } from 'ionic-image-loader';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ForumTopicsPage,
  ],
  imports: [
    IonicPageModule.forChild(ForumTopicsPage),
    IonicImageLoader.forRoot(),
    PipesModule
  ],
})
export class ForumTopicsPageModule {}
