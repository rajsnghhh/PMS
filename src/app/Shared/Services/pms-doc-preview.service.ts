import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PmsDocPreviewService {

  data: any = {
    showStatus: false,
    url: '',
    data: ''
  }

  private docData = new BehaviorSubject<any>(this.data);


  showDoc(url: any, docdata: any) {
    let newobj = {
      showStatus: true,
      url: url,
      data: docdata
    }
    this.docData.next(newobj);
  }

  hideData() {
    let newobj = {
      showStatus: false,
      url: '',
      data: ''
    }
    this.docData.next(newobj);
  }

  getDocData(): Observable<any> {
    return this.docData.asObservable();
  }

  constructor() { }
}
