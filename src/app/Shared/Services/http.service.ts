import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSharedService } from './data-shared.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public headers: any;

  constructor(
    private http: HttpClient,
    private datasharedservice: DataSharedService,
  ) { }



  // Set header and options for every request
  public prepareHeader() {
    this.headers = {
      headers: new HttpHeaders({
        'Authorization': 'Token ' + this.datasharedservice.getLocalData('authKey')
      })
    };
  }

  public prepareloginHeader() {
    this.headers = {
      headers: new HttpHeaders()
    };
  }



  // Observable get request
  public get(url: string): Observable<any> {
    this.prepareHeader();
    return this.http.get(url, this.headers);
  }



  // Observable post request
  public post(url: string, data?: any): Observable<any> {
    this.prepareHeader();
    return this.http.post(url, data, this.headers);
  }

  
  public postBinary(url: string, data?: any): Observable<any> {
    let options = this.headers
    options.responseType = 'blob'
    this.prepareHeader();
    return this.http.post(url, data, options);
  }

  public put(url: string, data?: any): Observable<any> {
    this.prepareHeader();
    return this.http.put(url, data, this.headers);
  }

  public LoginPost(url: string, data?: any): Observable<any> {
    this.prepareloginHeader();
    return this.http.post(url, data, this.headers);
  }

  public LoginPatch(url: string, data?: any): Observable<any> {
    this.prepareloginHeader();
    return this.http.patch(url, data, this.headers);
  }

  public loginget(url: string): Observable<any> {
    this.prepareloginHeader();
    return this.http.get(url, this.headers);
  }
  public rawFile(url: string) {
    this.prepareHeader();
    let httpOptions: any = this.headers;
    httpOptions.responseType = 'blob';
    return this.http.get(`${url}`, httpOptions);
  }
}
