import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, MenuController, Nav } from 'ionic-angular';
import { IntroPage } from '../intro/intro';
import { CourseProvider } from '../../../providers/course/course';
import { ClassPage } from '../class/class';

/**
 * Generated class for the CoursemenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coursemenu',
  templateUrl: 'coursemenu.html',
})
export class CoursemenuPage {

  public rootPage= 'IntroPage';
  public course;
  @ViewChild(Nav) nav:Nav;
  constructor(public menu:MenuController,public appCtrl: App,public navCtrl: NavController, public navParams: NavParams,public courseProvider:CourseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursemenuPage');
    let page = this.navParams.get('page');
    let open= this.navParams.get('open');
    if(open){
      let pages= this.navParams.get('pages');
      if(pages.length==1){
        let pageInfo = pages[0];
        this.nav.push(pageInfo.page,pageInfo.params);
      }
      else if(pages.length==2){
        let pageInfo = pages[0];
        let subPageInfo = pages[1];
        this.nav.push(pageInfo.page,pageInfo.params).then(resp=>{
          this.nav.push(subPageInfo.page,subPageInfo.params);
        });
      }

     // this.nav.setPages(pages,{direction:'forward'});
      //this.nav.push(page,this.navParams.get('params'))
    }
    console.log('rootpage: '+this.rootPage);

    this.course = this.courseProvider.getCourse();
  }

  exit(){
    this.navCtrl.pop();
  }

  intro(){
    this.nav.setRoot('IntroPage');
    //this.navCtrl.push('BlogPage');
    this.menu.close();
    //this.rootPage = 'BlogPage';
     
  }

  openClass(id){
    console.log('clicked');
    this.nav.push('ClassPage',{
      id:id
    });
    //this.navCtrl.push('ClassPage');

    this.menu.close();
  }

}
