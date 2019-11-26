import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DownloadfilesPage } from './downloadfiles';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    DownloadfilesPage,
  ],
  imports: [
    IonicPageModule.forChild(DownloadfilesPage),
    ComponentsModule
  ],
})
export class DownloadfilesPageModule {}
