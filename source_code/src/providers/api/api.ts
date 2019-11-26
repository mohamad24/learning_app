import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network'; 
import { ToastController } from 'ionic-angular';
import { CONFIG } from '../../app/config';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient,private _net: Network,public toastController: ToastController) {
    console.log('Hello ApiProvider Provider');
  }

  
  public getSettings(){
    return this.http.get(CONFIG.apiUrl+'/configs');
  }

  private getRequest(url:string){
    if(!this.isConnected()){
      //show toast
        this.presentToast('Network error! Please connect to the Internet');
      return false;
    }

    return this.http.get(url);
  }

  private postRequest(url:string, data:any){

  }

  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  
  isConnected(): boolean {
    let conntype = this._net.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  public getSessions(page,rowsPerPage=null,group=null,filter=null,sort=null,type=null){
    return this.http.get(CONFIG.apiUrl+'/sessions?page='+page+'&rows='+rowsPerPage+'&group='+group+'&filter='+filter+'&sort='+sort+'&type='+type);
  }

  public getSession(id){
    return this.http.get(CONFIG.apiUrl+'/sessions/'+id);
  }

  public getArticles(){
    return this.http.get(CONFIG.apiUrl+'/articles');
 
  }

  public getArticle(id){
    return this.http.get(CONFIG.apiUrl+'/articles/'+id);
  }

  public getPosts(page,filter=''){
    return this.http.get(CONFIG.apiUrl+'/posts?page='+page+'&filter='+filter);
 
  }

  public getPost(id){
    return this.http.get(CONFIG.apiUrl+'/posts/'+id);
  }

  public login(email,password){
    return this.http.post(CONFIG.apiUrl+'/accounts',{
      email:email,
      password:password
    });
  }

  public register(student){
    return this.http.post(CONFIG.apiUrl+'/students',student);
  }

  public getStudentCourses(){
    return this.http.get(CONFIG.apiUrl+'/student-courses');
  }

  public getPaymentMethods(currency){
    return this.http.get(CONFIG.apiUrl+'/payment-methods?currency_id='+currency);
  }

  public storeInvoice(sessions,paymentMethod,currency,coupon?){
      return this.http.post(CONFIG.apiUrl+'/invoices',{
          sessions:sessions,
          payment_method_id:paymentMethod,
          currency_id:currency,
          coupon:coupon
      });
  }

  public getInvoice(id){
    return this.http.get(CONFIG.apiUrl+'/invoices/'+id);
  }

  public  getToken(token) {
    return this.http.get(CONFIG.apiUrl+'/tokens/'+token);
  }
  
  public  getIntro(id) {
    return this.http.get(CONFIG.apiUrl+'/intros/'+id);
  }
  
  public getDonwloads(page){
    return this.http.get(CONFIG.apiUrl+'/downloads?page='+page);
  }

  public getDonwload(id){
    return this.http.get(CONFIG.apiUrl+'/downloads/'+id);
  }

  public getDownlodFilePath(id){
    return CONFIG.apiUrl+'/download-files/'+id;
  }

  public getClass(id,sessionId){
    return this.http.get(CONFIG.apiUrl+'/classes/'+id+'?session_id='+sessionId);
  }

  public getLecture(id,sessionId){
    return this.http.get(CONFIG.apiUrl+'/lectures/'+id+'?session_id='+sessionId);
  }

  public logLecture(lectureId,sessionId){
    return this.http.post(CONFIG.apiUrl+'/student-session-logs',{
      lecture_id:lectureId,
      session_id:sessionId
    });
  }

  public getClassFilePath(id,sessionId){
    return CONFIG.apiUrl+'/class-files/'+id+'?session_id='+sessionId;
  }

  public getLectureFilePath(id,sessionId){
    return CONFIG.apiUrl+'/lecture-files/'+id+'?session_id='+sessionId;
  }

  public getTests(page){
    return this.http.get(CONFIG.apiUrl+'/tests?page='+page); 
  }
 
  public getTest(id){
    return this.http.get(CONFIG.apiUrl+'/tests/'+id); 
  }

  public addStudentTest(testId){
      return this.http.post(CONFIG.apiUrl+'/student-tests',{
        test_id:testId, 
      });
  }

  public updateStudentTest(id,params){
    return this.http.put(CONFIG.apiUrl+'/student-tests/'+id,params);
  }
  
  public getStudentTest(id){
    return this.http.get(CONFIG.apiUrl+'/student-tests/'+id); 
  }

  public getStudentTests(id,page){
    return this.http.get(CONFIG.apiUrl+'/student-tests?test_id='+id+'&page='+page); 
  }

  public getProfile(id){
    return this.http.get(CONFIG.apiUrl+'/students/'+id);
  }

  public  updateProfile(id,data) {
    return this.http.put(CONFIG.apiUrl+'/students/'+id,data);
  }

  //assignment methods
  public getAssignments(page){
    return this.http.get(CONFIG.apiUrl+'/assignments?page='+page); 
  }

  public getAssignment(id){
    return this.http.get(CONFIG.apiUrl+'/assignments/'+id);
  }

  public createAssignmentSubmission(data){
    return this.http.post(CONFIG.apiUrl+'/assignment-submissions',data);
  }

  public getAssignmentSubmissionPath(){
    return CONFIG.apiUrl+'/assignment-submissions';
  }

  public updateAssignmentSubmission(id,data){
    return this.http.put(CONFIG.apiUrl+'/assignment-submissions/'+id,data);
  }

 


  public deleteAssignmentSubmission(id){
    return this.http.delete(CONFIG.apiUrl+'/assignment-submissions/'+id);
  }

//revision notes methods

public revisionNotesSessions(page){
  return this.http.get(CONFIG.apiUrl+'/revision-notes-sessions?page='+page); 
}

public getRevisionNotes(page,sessionId){
  return this.http.get(CONFIG.apiUrl+'/revision-notes?page='+page+'&session_id='+sessionId); 
}

public getRevisionNote(id){
  return this.http.get(CONFIG.apiUrl+'/revision-notes/'+id);
}

public getDiscussionOptions()
{
  return this.http.get(CONFIG.apiUrl+'/discussion-options'); 
}

public getDiscussions(page){
  return this.http.get(CONFIG.apiUrl+'/discussions?page='+page); 
}

public getDiscussion(id,page){
  return this.http.get(CONFIG.apiUrl+'/discussions/'+id+'?page='+page); 
}

public createDiscussion(data){
  return this.http.post(CONFIG.apiUrl+'/discussions',data); 
}

public deleteDiscussion(id){
  return this.http.delete(CONFIG.apiUrl+'/discussions/'+id);
}

public createDiscussionReply(data){
  return this.http.post(CONFIG.apiUrl+'/discussion-replies',data); 
}

//forum methods
public forumSessions(page){
  return this.http.get(CONFIG.apiUrl+'/forum-sessions?page='+page); 
}

public forumTopics(page,sessionId){
  return this.http.get(CONFIG.apiUrl+'/forum-topics?page='+page+'&session_id='+sessionId); 
}

public getForumTopic(id){
  return this.http.get(CONFIG.apiUrl+'/forum-topics/'+id); 
}

public createForumTopic(data){
  return this.http.post(CONFIG.apiUrl+'/forum-topics',data); 
}

public deleteForumTopic(id){
  return this.http.delete(CONFIG.apiUrl+'/forum-topics/'+id);
}

public getForumPosts(page,id){
  return this.http.get(CONFIG.apiUrl+'/forum-posts?page='+page+'&forum_topic_id='+id); 
}

public createForumPost(data){
  return this.http.post(CONFIG.apiUrl+'/forum-posts',data); 
}

public getCertificates(page){
  return this.http.get(CONFIG.apiUrl+'/certificates?page='+page); 
}

public getCertificate(id){
  return this.http.get(CONFIG.apiUrl+'/certificates/'+id); 
}
public getCertificateFilePath(id){
  return CONFIG.apiUrl+'/certificates/'+id;
}


public getDownloads(page){
  return this.http.get(CONFIG.apiUrl+'/downloads?page='+page); 
}

public getDownload(id){
  return this.http.get(CONFIG.apiUrl+'/download/'+id); 
}

public getDownloadFile(id){
  return this.http.get(CONFIG.apiUrl+'/download-files/'+id); 
}

//bookmarks 
public getBookMarks(page){
  return this.http.get(CONFIG.apiUrl+'/bookmarks?page='+page); 
}

public storeBookmark(data){
  return this.http.post(CONFIG.apiUrl+'/bookmarks',data);
}

public removeBookmark(id){
  return this.http.delete(CONFIG.apiUrl+'/bookmarks/'+id); 
}

public uploadProfilePhoto(data){
  return this.http.post(CONFIG.apiUrl+'/profile-photos',data);
}

public getProfilePhotoPath(){
  return CONFIG.apiUrl+'/profile-photos';
}

public removeProfilePhoto(){
  return this.http.delete(CONFIG.apiUrl+'/profile-photos');
}

public changePassword(password){
  let data = {password:password};
  return this.http.post(CONFIG.apiUrl+'/student-passwords',data);
}

public resetPassword(email){
  let data = {email:email};
  return this.http.post(CONFIG.apiUrl+'/password-resets',data);
}


}