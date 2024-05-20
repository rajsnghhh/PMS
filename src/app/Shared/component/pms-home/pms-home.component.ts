import { Component } from '@angular/core';
import { AccessPermissionService } from '../../Services/access-permission.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PmsRoutingPremissionsService } from '../../Services/pms-routing-premissions.service';

@Component({
  selector: 'app-pms-home',
  templateUrl: './pms-home.component.html',
  styleUrls: ['./pms-home.component.scss']
})
export class PmsHomeComponent {
  constructor(
    private accesspermissionservice: AccessPermissionService,
    private router: Router,
    private toastrService: ToastrService,
    private pmsRoutingPremissionsService : PmsRoutingPremissionsService
  ) { }

  ProceedToPMS() {
    this.pmsRoutingPremissionsService.ProceedToPMS()
  }
}
