import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PmsLoaderService {

  constructor() { }

  private showLoader = new BehaviorSubject<boolean>(false);
  private LoaderMsg = new BehaviorSubject<string>('');
  showIndex = 0;
  show() {
    this.showIndex++;
    if (this.showIndex > 0) {
      this.showLoader.next(true);
    }
  }

  showWithMessage(msg: any) {
    this.show()
    this.LoaderMsg.next(msg);
  }

  hide() {
    if (this.showIndex > 0) {
      this.showIndex--;
    }
    if (this.showIndex == 0) {
      this.showLoader.next(false);
      this.LoaderMsg.next('')
    }
  }

  loaderStatus(): Observable<any> {
    return this.showLoader.asObservable();
  }

  loaderMsg(): Observable<any> {
    return this.LoaderMsg.asObservable();
  }

}
