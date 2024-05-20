import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccessUrlService } from '../Services/access-url.service';
import { DataSharedService } from '../Services/data-shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(
    private router: Router,
    private accessUrlService: AccessUrlService,
    private toastrService: ToastrService,
    private datasharedservice: DataSharedService
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let Module = route.data['url'] ;
    if(Module && Module.length > 0 && Module[0]== 'CustomCheckOnGurd') {
      if(state.url.includes("/pms/store/procurement/")) {
        Module[0] = "Store"
    } else if(state.url.includes("/pms/purchase/procurement/")) {
        Module[0] = "Purchase"
      }
    }  
    if ((this.accessUrlService.checkUrlPermission(state.url) == false) && (Module && Module.length > 0 && this.accessUrlService.checkModulePermission(Module[0]) == false)) {
      this.toastrService.error('You are not authorize to open this url', '', {
        timeOut: 2000,
      });
      this.router.navigateByUrl('/login');
      return false
    }
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
