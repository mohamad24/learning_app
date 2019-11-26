import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlogPage } from './blog';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    BlogPage,
  ],
  imports: [
    IonicPageModule.forChild(BlogPage),
    IonicImageLoader
  ],
})
export class BlogPageModule {}
