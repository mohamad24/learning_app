import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestListPage } from './test-list';

@NgModule({
  declarations: [
    TestListPage,
  ],
  imports: [
    IonicPageModule.forChild(TestListPage),
  ],
})
export class TestListPageModule {}
