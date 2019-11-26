import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotesListPage } from './notes-list';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    NotesListPage,
  ],
  imports: [
    IonicPageModule.forChild(NotesListPage),
    PipesModule
  ],
})
export class NotesListPageModule {}
