import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPopoverPage } from './account-popover';

@NgModule({
  declarations: [
    AccountPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPopoverPage),
  ],
})
export class AccountPopoverPageModule {}
