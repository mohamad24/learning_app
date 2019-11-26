import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertificatesPage } from './certificates';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CertificatesPage,
  ],
  imports: [
    IonicPageModule.forChild(CertificatesPage),
    PipesModule,
    ComponentsModule
  ],
})
export class CertificatesPageModule {}
