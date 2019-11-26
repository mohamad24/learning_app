import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeworkListPage } from './homework-list';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    HomeworkListPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeworkListPage),
    ComponentsModule,
    PipesModule
  ],
})
export class HomeworkListPageModule {}
