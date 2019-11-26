import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumTopicPage } from './forum-topic';
import { IonicImageLoader } from 'ionic-image-loader';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ForumTopicPage,
  ],
  imports: [
    IonicPageModule.forChild(ForumTopicPage),
    IonicImageLoader.forRoot(),
    PipesModule
  ],
})
export class ForumTopicPageModule {}
