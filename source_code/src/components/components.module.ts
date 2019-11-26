import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { DiscussComponent } from './discuss/discuss';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
@NgModule({
	declarations: [ProgressBarComponent,
    DiscussComponent],
	imports: [IonicModule,CommonModule,PipesModule],
	exports: [ProgressBarComponent,
    DiscussComponent]
})
export class ComponentsModule {}
