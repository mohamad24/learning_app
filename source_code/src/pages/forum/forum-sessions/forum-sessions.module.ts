import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumSessionsPage } from './forum-sessions';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    ForumSessionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ForumSessionsPage),
    IonicImageLoader.forRoot()
  ],
})
export class ForumSessionsPageModule {}
