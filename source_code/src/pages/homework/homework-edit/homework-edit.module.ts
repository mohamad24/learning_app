import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeworkEditPage } from './homework-edit';

@NgModule({
  declarations: [
    HomeworkEditPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeworkEditPage),
  ],
})
export class HomeworkEditPageModule {}
