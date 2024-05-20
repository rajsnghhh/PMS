import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSharedService } from '../Shared/Services/data-shared.service';
import { CommonFunctionService } from '../Shared/Services/common-function.service';

@Component({
  selector: 'login-main',
  templateUrl: './loginmodule.component.html',
  styleUrls: ['./loginmodule.component.scss']
})
export class LoginModuleComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private datasharedservice:DataSharedService,
    private commonFunction: CommonFunctionService
  ) { }

  verifylink: any

  ngOnInit(): void {
    this.verifylink = this.route.snapshot.paramMap.get('action');
    if (this.verifylink != 'reset') {
      if (this.datasharedservice.getLocalData('authKey')) {
        this.router.navigateByUrl('/home');
      }
    }
  }

  openSFT() {
    this.commonFunction.takeToSFT()
  }
}

