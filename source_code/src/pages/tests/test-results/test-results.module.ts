import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestResultsPage } from './test-results';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    TestResultsPage,
  ],
  imports: [
    IonicPageModule.forChild(TestResultsPage),
    PipesModule
  ],
})
export class TestResultsPageModule {}
