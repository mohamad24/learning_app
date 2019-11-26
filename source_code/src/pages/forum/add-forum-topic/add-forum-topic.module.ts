import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddForumTopicPage } from './add-forum-topic';

@NgModule({
  declarations: [
    AddForumTopicPage,
  ],
  imports: [
    IonicPageModule.forChild(AddForumTopicPage),
  ],
})
export class AddForumTopicPageModule {}
