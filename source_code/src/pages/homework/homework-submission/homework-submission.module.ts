import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeworkSubmissionPage } from './homework-submission';

@NgModule({
  declarations: [
    HomeworkSubmissionPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeworkSubmissionPage),
  ],
})
export class HomeworkSubmissionPageModule {}
