import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor() { }

  private subject = new BehaviorSubject<any>('landing');

  changeNav(navpoint: string) {
    let newMessage = navpoint
    this.subject.next(newMessage);
  }

  errorNav() {
    this.subject.next('OOPS Some Error occoured!!');
  }

  currentNav(): Observable<any> {
    return this.subject.asObservable();
  }

}
