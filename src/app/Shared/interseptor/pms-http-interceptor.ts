import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { PmsLoaderService } from '../Services/pms-loader.service';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class PmsHttpInterceptor implements HttpInterceptor {
  constructor(
    private loaderservice: PmsLoaderService,
    private toastrService: ToastrService
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    let url = new URL(req.url);
    let HideLoader = false
    //Set query parameter hideLoader: 'true' to pause loader action on API Call
    if (url.searchParams.get("hideLoader")) {
      HideLoader = true
    }
    if (!HideLoader) {
      this.loaderservice.show()
    }
    return next.handle(req).pipe(
      catchError((error: any) => {
        if(error.status != 200) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `${error.error.message}`;
        } else {
          // server-side 
          if (error.error.msg && error.error.request_status == "0") {
            // if(this.isJsonString(error.error.msg)) {
            if(error.error.msg) {
              // errorMessage = `${this.getkeyValueerroe(error.error.msg)}`;
              errorMessage = `Oops something went wrong!! Please try after sometime.`;
            } else {
              errorMessage = `${error.error.msg}`;
            }
          } else {
            errorMessage = `Oopsss something went wrong!! Please try after sometime.`;
          }
        }

        this.toastrService.error(errorMessage, '', {
          timeOut: 2000,
        });
        return throwError(errorMessage);
        }
        return throwError(null);
      }),
      finalize(() => this.loaderservice.hide())
    );

  }

  // isJsonString(str:any) {
  //   try {
  //     str = JSON.parse(str.replace(/'/g, '"').replace(/ErrorDetail\(string=/g, '').replace(/, code="error"\)/g, ''));
  //   }catch (e){
  //   }
    
  //   if(typeof(str) == 'object') {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // getkeyValueerroe(str:any) {
  //   try {
  //     str = JSON.parse(str.replace(/'/g, '"').replace(/ErrorDetail\(string=/g, '').replace(/, code="error"\)/g, ''));
  //   }catch (e){
  //   }
  //   while(typeof(str) == 'object' && str.msg) {
  //     str = str.msg
  //   }
  //   if(!this.isJsonString(str)) {
  //     return str
  //   }else {
  //     let res = ''
  //     for (var key in str) {
  //       res += key.replace(/_/g, " ").toUpperCase() + ' : ' +str[key][0];
  //     }
  //     return res
  //   }
  // }
}