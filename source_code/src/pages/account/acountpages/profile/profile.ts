import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController, Platform } from 'ionic-angular';
import { SettingsProvider } from '../../../../providers/settings/settings';
import { ApiProvider } from '../../../../providers/api/api';
import { AuthenticationProvider } from '../../../../providers/authentication/authentication';
import { UtilsProvider } from '../../../../providers/utils/utils';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Base64 } from '@ionic-native/base64';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private loading;
  public fields;
  public student;
  public basePath;
  public picture;
  public studentInfo;
  public showLoading = false;
  public src;
  public lastImage;
  constructor(public auth:AuthenticationProvider,private transfer: FileTransfer,private filePath:FilePath,private file:File,private platform:Platform,private base64: Base64,private androidPermissions: AndroidPermissions, private camera: Camera, private fileChooser: FileChooser, private filePicker: IOSFilePicker, public plt: Platform, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, private utils: UtilsProvider, private authenticationService: AuthenticationProvider, private apiService: ApiProvider, private loadingController: LoadingController, private settingsService: SettingsProvider) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  async ngOnInit() {
    this.setup();
  }

  async setup() {

    this.student = {
      'first_name': '',
      'last_name': '',
      'email': '',
      'mobile_number': '',
      'picture': ''
    };

    //get settings
    this.fields = await this.settingsService.getSetting('registration');

    this.basePath = await this.settingsService.getSetting('base_path');

    for (let i = 0; i < this.fields.length; i++) {
      this.student['custom_' + this.fields[i].registration_field_id] = '';
    }

    //load student info from api
    //get student id
    this.studentInfo = await this.utils.getFromStorage('student-data');
    console.log(this.studentInfo['id']);

    this.presentLoading();
    this.apiService.getProfile(this.studentInfo['id']).subscribe(resp => {
      this.loading.dismiss();
      if (resp['status']) {
        this.student = resp['data'];

      }
      else {

        this.navCtrl.pop();
      }

    }, err => {
      this.loading.dismiss();
      this.utils.networkError();
      this.navCtrl.pop();
    });

  }



  presentLoading() {
    this.loading = this.loadingController.create({
      content: 'Loading. Please wait...',
      duration: 2000000000
    });
    this.loading.present();
  }


  onSave(registerForm) {

    if (registerForm.form.valid) {
      this.presentLoading();
      this.student['picture'] = this.picture;
      this.apiService.updateProfile(this.studentInfo['id'], this.student).subscribe(res => {
        this.loading.dismiss();
        let status = res['status'];
        if (status != true) {
          this.utils.presentAlert('Save Failed!', res['msg']);
        }
        else {
          this.utils.presentToast('Changes saved!');
          this.navCtrl.pop();
        }

      }, err => {
        this.loading.dismiss();
        this.utils.networkError();

      });

    }
    else {
      this.utils.presentAlert('Submission Failed!', ' Please fill all required fields and try again');
    }
  }

  onImageClick() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Profile Picture',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('photo clicked');
            this.photo();
          }
        }, {
          text: 'Gallery',
          icon: 'image',
          handler: () => {
            this.selectFile();
          }
        }, {
          text: 'Remove photo',
          icon: 'trash',
          handler: () => {
            this.presentLoading();
            this.apiService.removeProfilePhoto().subscribe(resp => {
              this.loading.dismiss();
              this.utils.presentToast('Image removed');
              this.setup();

            }, err => {
              this.loading.dismiss();
              this.utils.networkError();
            })
          }
        }
      ]
    });
    actionSheet.present();
  }


  selectFile() {
    if (this.plt.is('ios')) {
      // this.filePicker.pickFile().then(uri => {
      //   this.savePhotoFile(uri);
      // })
      // .catch(err => {
      //   console.log(err);
      //   this.utils.presentToast('An error has occured');
      // });
      this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
    }
    else if (this.plt.is('android')) {

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(status => {
           
            // this.androidFileChooser();
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          
        },err=>{
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
          .then(status => {
            if (status.hasPermission) this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          });
        });





    }
  }

  androidFileChooser() {
    this.fileChooser.open().then(uri => {
      this.savePhotoFile(uri);
    })
      .catch(e => {
        console.log(e);
        this.utils.presentToast('An error has occured');
      });

  }

  savePhotoData(data){
    this.showLoading = true;
    this.apiService.uploadProfilePhoto(data).subscribe(resp => {
      this.showLoading = false;
      if (resp['status']) {
        this.utils.presentToast('Photo saved');
        this.setup();
      }
      else {
        console.log(resp);
       
        this.utils.presentToast(resp['msg']);
      }

    }, err => {
      this.showLoading = false;
      this.utils.networkError();
    });
  }


  savePhotoFile(url) {
    this.showLoading = true; 
    let uploadOptions = {
      fileKey: "picture", // change fileKey
      chunkedMode: false, // add chunkedMode
      mimeType: "image/jpeg", // add mimeType
      httpMethod:"POST",
      fileName: 'photo', 
    //  headers: {'Authorization':this.auth.getToken(), 'Content-Type': 'application/x-www-form-urlencoded'}
      headers: {'Authorization':this.auth.getToken()}

    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.upload(url,this.apiService.getProfilePhotoPath(),uploadOptions).then((resp)=>{
      console.log(resp['response']);
    
      let jsonResponse = JSON.parse(resp['response']);
      
      this.showLoading = false;
      if (jsonResponse['status']) {
        this.utils.presentToast('Photo saved');
        this.setup();
      }
      else {
        this.utils.presentToast(jsonResponse['msg']);
      }


    }, (error) => {
      // handle error
      console.log(error); 

      this.showLoading = false;
      this.utils.networkError();
    });
  }


  savePhotoFileOld(url) {
    const reader = new FileReader();
    reader.readAsDataURL(url);

    reader.onload = () => {
      let image = reader.result;
      this.showLoading = true;
      let postData = {};
      postData['picture'] = image;
      this.apiService.uploadProfilePhoto(postData).subscribe(resp => {
        this.showLoading = false;
        if (resp['status']) {
          this.utils.presentToast('Photo saved');
          this.setup();
        }
        else {
          this.utils.presentToast(resp['msg']);
        }

      }, err => {
        this.showLoading = false;
        this.utils.networkError();
      });

    };
  }

  photo() {
    if (this.utils.isAndroid()) {
      
      console.log('is android');
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(status => {
        
            // this.loadCamera();
            console.log('There is permission');
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          
        },err=>{
          console.log('No permission. Requesting');
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then(status => {
            if (status.hasPermission) this.takePicture(this.camera.PictureSourceType.CAMERA);
          });
        });
    }
    else {
      //  this.loadCamera();
      this.takePicture(this.camera.PictureSourceType.CAMERA);
    }
  }

  loadCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.savePhotoFile(imageData);
    }, (err) => {
      // Handle error
      this.utils.presentToast('An error has occured');
    });

  }

  public takePicture(sourceType) {
    this.loading = true; 

    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library

      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        
        this.savePhotoFile(imagePath);
        // console.log('lib');
        // this.base64.encodeFile(imagePath).then((base64String: string) => {
        //   // console.log("-----base64String-----" + base64String);
        //   let imageSrc = base64String.split(",");
        //   console.log("---Splitted image string----" + imageSrc[1]);
        //   this.src = imageSrc[1]


        //   let args = {
        //     picture: imageSrc[1]
        //   }
          
        //   this.savePhotoData(args);
           

        // })

        // this.filePath.resolveNativePath(imagePath)
        //   .then(filePath => {
        //     let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
        //     let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
        //     this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        //   });

      } else {

        this.savePhotoFile(imagePath);
        // this.base64.encodeFile(imagePath).then((base64String: string) => {
        //   // console.log("-----base64String-----" + base64String);
        //   let imageSrc = base64String.split(",");
        //   console.log("---Splitted image string----" + imageSrc[1]);
        //   this.src = imageSrc[1]

        //   let args = {
        //     picture: imageSrc[1]
        //   }
        //   this.savePhotoData(args);
       
        // })

        // console.log("-------inside else IMage Path------" + imagePath);

         
      }
    }, (err) => {
      this.utils.presentToast('No image selected');
    });
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.externalRootDirectory+'/Download/', newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.utils.presentToast('Error while storing file.');
    });
  }



}
