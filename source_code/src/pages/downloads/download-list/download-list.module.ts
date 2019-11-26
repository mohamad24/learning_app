import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DownloadListPage } from './download-list';

@NgModule({
  declarations: [
    DownloadListPage,
  ],
  imports: [
    IonicPageModule.forChild(DownloadListPage),
  ],
})
export class DownloadListPageModule {}
