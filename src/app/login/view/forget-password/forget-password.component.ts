import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnChanges {
  resetpassForm: FormGroup;
  newpassForm: FormGroup;
  showloginpassword = false;
  showloginpassword2 = false;
  verifylink: any;
  activefrom = 'resetPassword';
  otpconfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService

  ) {
    this.resetpassForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    }),
      this.newpassForm = formBuilder.group({
        newpassword: ['', [Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=.*[$@#$!%*?&])(?=[^A-Z]*[A-Z]).{8,16}$/)]],
        confirmpassword: ['', [Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=.*[$@#$!%*?&])(?=[^A-Z]*[A-Z]).{8,16}$/)]]
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.datasharedservice.clearLocalData();
  }

  ngOnInit(): void {
    
    this.verifylink = this.route.snapshot.paramMap.get('action');
    if (this.verifylink == 'reset') {
      this.activefrom = '';
      this.verifyLink();
    }
  }

  verifyLink() {
    let security = this.route.snapshot.paramMap.get('sccurity');
    let token = this.route.snapshot.paramMap.get('token') || '';

    this.apiservice.verifyresetURL(security + '/' + token + '/').subscribe(data => {

      if (data.success) {
        this.PasswordReset()
      } else {
        this.activefrom = 'linkexpired';
      }
    }, err => {
      this.activefrom = 'linkexpired';
    });
  }

  togglePasswordView() {
    this.showloginpassword = !this.showloginpassword
  }
  togglePasswordView2() {
    this.showloginpassword2 = !this.showloginpassword2
  }

  enterOTP() {
    if (this.resetpassForm.valid) {
      let req = {
        email: this.resetpassForm.value.email
      }
      this.apiservice.passResetRequest(req).subscribe(data => {
        if(data.status == 400) {
          this.toastrService.error("Email id does not exist, Please re-enter valid email id", '', {
            timeOut: 4000,
          });
        }else{
          this.activefrom = 'enterOTP'
        }
      }, err => {
        if(err.status == 400) {
          this.toastrService.error("Email id does not exist, Please re-enter valid email id", '', {
            timeOut: 4000,
          });
        }
      }
      )
    } else {
      this.markFormGroupTouched(this.resetpassForm);
    }
  }

  expiredLink() {
    this.activefrom = 'expiredLink'
  }

  PasswordReset() {
    this.activefrom = 'retakePassword';

  }
  saveNewPassword() {
    if (this.newpassForm.valid) {
      if (this.newpassForm.value.newpassword != this.newpassForm.value.confirmpassword) {
        this.toastrService.error("Please re-check Your Password. Both are not same!", '', {
          timeOut: 2000,
        });
      } else {
        let security = this.route.snapshot.paramMap.get('sccurity');
        let token = this.route.snapshot.paramMap.get('token');
        let req = {
          password: this.newpassForm.value.newpassword,
          password2: this.newpassForm.value.confirmpassword,
          token: token,
          uidb64: security
        }
        this.apiservice.forgetUpdatePassword(req).subscribe(data => {

          if (data.success) {
            this.activefrom = 'passwordUpdated';
            this.toastrService.success('Password Updated Successfully!', '', {
              timeOut: 2000,
            });
          } else {
            this.activefrom = 'linkexpired';
            this.toastrService.error('Link Is Expired!', '', {
              timeOut: 2000,
            });
          }
        }, err => {
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
          this.activefrom = 'linkexpired';
        });

      }
    } else {
      this.markFormGroupTouched(this.newpassForm);
    }
  }

  proceedtoLogin() {
    this.router.navigateByUrl('/login');
  }

  onOtpChange(otp: string) {
  }

  backToLogin() {
    this.router.navigateByUrl('/login');
  }

  goToForgotpassword() {
    this.router.navigateByUrl('/login/forgetPassword');
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
