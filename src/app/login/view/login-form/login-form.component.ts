import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { ToastrService } from 'ngx-toastr';
import { AccessPermissionService } from 'src/app/Shared/Services/access-permission.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  showloginpassword = false;
  loginForm!: FormGroup;
  credentialerror = false;
  fieldTextType: boolean | undefined;
  constructor (
    private router: Router, 
    private formBuilder: FormBuilder,
    private apiservice:APIService,
    private datasharedservice:DataSharedService,
    private toastrService:ToastrService,
    private accesspermissionservice:AccessPermissionService
  ) {
    this.loginForm = formBuilder.group({
      username: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  togglePasswordView() {
    this.showloginpassword = !this.showloginpassword
  }

  proceedtoResetPassword() {
    this.router.navigateByUrl('/login/forgetPassword');
  }

  loginSubmit() {
    if (this.loginForm.valid) {
      let req = {
        username : this.loginForm.value.username,
        password : this.loginForm.value.password
      }
      this.apiservice.userLogin(req).subscribe(data=> {
        if(data.request_status == '0') {
          this.credentialerror = true;
        } else {

          this.toastrService.success('Loged In Successfully!', '', {
            timeOut: 2000,
          });
          this.datasharedservice.saveLocalData('authKey',data.token);
          this.datasharedservice.saveLocalData('userDATA',JSON.stringify(data));
          this.filterPermissions(data.user_role_details)
        }
      }, err => {
        this.toastrService.error('Please check the username and password', '', {
          timeOut: 2000,
        });
        this.credentialerror = true;
      })
      
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }  

  ChangePass() {
    this.credentialerror = false;
  }

  filterPermissions(data:any) {
    this.accesspermissionservice.generatePermissionObject(data.user_setting_permission,data.user_permissions_details)
    // let status1 = this.accesspermissionservice.setModuleAccess(data.user_permissions_details)
    let status2 = this.accesspermissionservice.setAdministrativeAccess(data.user_administrative_permissions);
    // let status3 = this.accesspermissionservice.setSettingAccess(data.user_setting_permission)
    this.router.navigateByUrl('/home');
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: { markAsTouched: () => void; controls: any[]; }) => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach((c: FormGroup) => this.markFormGroupTouched(c));
      }
    });
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched);
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched),
      'is-valid': form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched)
    };
  }

}
