import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
 
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SettingsProvider } from '../providers/settings/settings';
import { ApiProvider } from '../providers/api/api';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { CartProvider } from '../providers/cart/cart';
import { InterceptProvider } from '../providers/intercept/intercept';
import { UtilsProvider } from '../providers/utils/utils';
import { InitPage } from '../pages/init/init';
import { FormsModule } from '@angular/forms'; 
import { Network } from '@ionic-native/network';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { BrowsePage } from '../pages/catalog/browse/browse';
import { CoursesPage } from '../pages/courses/courses';
import { InformationPage } from '../pages/info/information/information';
import { AccountPage } from '../pages/account/account';
import { IonicStorageModule } from '@ionic/storage';
import { IonicImageLoader } from 'ionic-image-loader';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CourseProvider } from '../providers/course/course';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';  
import { MakeintPipe } from '../pipes/makeint/makeint';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { HTTP } from '@ionic-native/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { Base64 } from '@ionic-native/base64';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';

@NgModule({
  declarations: [
    MyApp, 
    HomePage,
    TabsPage,
    BrowsePage,
    CoursesPage,
    InformationPage,
    AccountPage,
    InitPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    FormsModule,
    HttpClientModule,
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, 
    HomePage,
    TabsPage,
    InitPage,
    BrowsePage,
    CoursesPage,
    InformationPage,
    AccountPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SettingsProvider,
    ApiProvider,
    AuthenticationProvider,
    CartProvider,
    InterceptProvider,
    UtilsProvider,
    Network,
    {
      provide : HTTP_INTERCEPTORS,
      useClass: InterceptProvider,
      multi   : true,
    },
    InAppBrowser,
    CourseProvider,
    FileTransfer, 
    File,
    AndroidPermissions,
    FileOpener,
    FilePath,
    StreamingMedia,
    HTTP,
    Camera,
    FileChooser,
    IOSFilePicker,
    Base64,
    SocialSharing,
    AppVersion
  ]
})
export class AppModule {}
