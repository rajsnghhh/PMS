import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { LocalStorageService } from 'src/app/Shared/Services/local-storage.service';

@Component({
  selector: 'app-way-bill',
  templateUrl: './way-bill.component.html',
  styleUrls: [
    './way-bill.component.scss',
    '../../../../../../assets/scss/from-coomon.scss',
  ],
})
export class WayBillComponent {
  checkValidData: boolean = false;
  isApiCalled: boolean = false;
  formData: any;
  total: Number = 0;
  way_bill_id: any = null;
  wayBillData: any = null;
  scope: any = null;
  constructor(
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private localStorage: LocalStorageService,
    private commonFunction: CommonFunctionService
  ) {
    this.way_bill_id = this.route.snapshot.paramMap.get('way_bill_id');
    if (this.router.url.indexOf('/procurement/way-bill/edit') > -1) {
      this.scope = 'update'
    } else if (this.router.url.indexOf('/procurement/way-bill/view') > -1) {
      this.scope = 'view'
    } else if (this.router.url.indexOf('/procurement/way-bill/print') > -1) {
      this.scope = 'print'
    } else {
      this.scope = 'add'
    }
    setTimeout(async () => {
      if (this.way_bill_id) {
        await this.getWayBillData();
      }
    });
  }
  saveData(topCard: any, tableData: any, bottomCard: any) {
    topCard.getFormGroup();
    tableData.getFormGroup();
    bottomCard.getFormGroup();
    this.formData = {
      ...topCard.getFormGroup().value,
      ...tableData.getFormGroup().value,
      ...bottomCard.getFormGroup().value,
    };
    if (
      topCard.getFormGroup().valid &&
      tableData.getFormGroup().valid &&
      bottomCard.getFormGroup().valid
    ) {
      this.isApiCalled = true;
      if(this.scope=='update'){
        let params = new URLSearchParams();
        params.set('organization_id', this.localStorage.organisation_id());
        params.set('method', 'edit');
        params.set('id', this.way_bill_id);
        this.procurementApiService.updateWayBill(params,this.formData).subscribe(
          (data) => {
            this.toastrService.success(Success_Messages.SuccessAdd, '', {
              timeOut: 2000,
            });
            this.backtolist();
            this.isApiCalled = false;
          },
          (error) => {
            this.isApiCalled = false;
          }
        );
      }
      else{
      this.procurementApiService.addWayBill(this.formData).subscribe(
        (data) => {
          this.toastrService.success(Success_Messages.SuccessAdd, '', {
            timeOut: 2000,
          });
          this.backtolist();
          this.isApiCalled = false;
        },
        (error) => {
          this.isApiCalled = false;
        }
      );
    }
    } else {
      this.checkValidData = true;
    }
  }
  checkValidation(event: any) {
    this.checkValidData = false;
  }
  appendData(data: any) {
    this.formData = { ...this.formData, ...data };
  }
  getTotalPrice(total: any) {
    this.total = total;
  }
  backtolist() {
    this.RouteToRoll(
      '/pms/' +
        this.route.snapshot.paramMap.get('procurementScope') +
        '/procurement/way-bill'
    );
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
  getWayBillData() {
    new Promise((resolve, reject) => {
      let query = this.commonFunction.getURL({
        organization_id: this.localStorage.organisation_id(),
        id: this.way_bill_id,
      });
      this.procurementApiService.getWayBill(query).subscribe((data) => {
        this.wayBillData = data;
        resolve(true);
      });
    });
  }
}
