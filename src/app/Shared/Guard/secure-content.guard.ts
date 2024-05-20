import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DataSharedService } from '../Services/data-shared.service';

@Injectable({
  providedIn: 'root'
})
export class SecureContentGuard implements CanActivate {
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private datasharedservice:DataSharedService
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.datasharedservice.getLocalData('authKey')) {
        return true;
      } else {
        this.toastrService.error("Your Session is Expeired! Please login again to Proceed.", '', {
          timeOut: 2000,
        });
        this.datasharedservice.clearLocalData();
        this.router.navigateByUrl('/login');
        return false;
      }
  }
  
}
