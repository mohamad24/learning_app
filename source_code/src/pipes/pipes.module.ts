import { NgModule } from '@angular/core';
import { MakeintPipe } from './makeint/makeint';
import { VideoUrlPipe } from './video-url/video-url';
@NgModule({
	declarations: [MakeintPipe,
    VideoUrlPipe],
	imports: [],
	exports: [MakeintPipe,
    VideoUrlPipe]
})
export class PipesModule {}
