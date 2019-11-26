import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotesSessionsPage } from './notes-sessions';

@NgModule({
  declarations: [
    NotesSessionsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotesSessionsPage),
  ],
})
export class NotesSessionsPageModule {}
