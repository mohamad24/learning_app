import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlogdetailPage } from './blogdetail';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    BlogdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BlogdetailPage),
    IonicImageLoader
  ],
})
export class BlogdetailPageModule {}
