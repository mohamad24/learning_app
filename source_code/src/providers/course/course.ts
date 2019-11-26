import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CourseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CourseProvider {

  private course;

  constructor(public http: HttpClient) {
    console.log('Hello CourseProvider Provider');
  }

  public setCourse(course){
    this.course=course;
  }

  public getCourse()
  {
    return this.course;
  }

}
