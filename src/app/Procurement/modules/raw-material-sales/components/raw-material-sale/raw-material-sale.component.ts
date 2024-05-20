import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { LocalStorageService } from 'src/app/Shared/Services/local-storage.service';
import { RawMaterialSaleTopCardComponent } from './raw-material-sale-top-card/raw-material-sale-top-card.component';
import { RawMaterialSaleTableDataComponent } from './raw-material-sale-table-data/raw-material-sale-table-data.component';
import { RawMaterialSaleTaxComponent } from './raw-material-sale-tax/raw-material-sale-tax.component';
import { RawMaterialSaleBottomCardComponent } from '../raw-material-sale-bottom-card/raw-material-sale-bottom-card.component';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-raw-material-sale',
  templateUrl: './raw-material-sale.component.html',
  styleUrls: [
    './raw-material-sale.component.scss',
    '../../../../../../assets/scss/from-coomon.scss',
  ],
})
export class RawMaterialSaleComponent {
  checkValidData: boolean = false;
  isApiCalled: boolean = false;
  formData: any;
  localStorageData:any;
  scope: any = null;
  add_type: any = null;
  id: any = null;
  rawMaterialSaleData: any = null;
  total: Number = 0;
  @ViewChild(RawMaterialSaleTopCardComponent) topCard: any;
  @ViewChild(RawMaterialSaleTableDataComponent) tableData: any;
  @ViewChild(RawMaterialSaleTaxComponent) saleTax: any;
  @ViewChild(RawMaterialSaleBottomCardComponent) bottomCard: any;
  constructor(
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private datasharedservice: DataSharedService,
    private localStorage: LocalStorageService,
    private commonFunction: CommonFunctionService,
    private router: Router
  ) {
    if (
      this.router.url.indexOf('/procurement/raw-material-sales/add/gst') > -1
    ) {
      this.add_type = 'gst';
      this.scope = 'add';
    } else if (
      this.router.url.indexOf('/procurement/raw-material-sales/edit/gst') > -1
    ) {
      this.add_type = 'gst';
      this.scope = 'update';
    } else if (
      this.router.url.indexOf('/procurement/raw-material-sales/edit') > -1
    ) {
      this.scope = 'update';
      this.add_type = null;
    } else if (
      this.router.url.indexOf('/procurement/raw-material-sales/view') > -1
    ) {
      this.scope = 'view';
      this.add_type = null;
    } else if (
      this.router.url.indexOf('/procurement/raw-material-sales/print') > -1
    ) {
      this.scope = 'print';
      this.add_type = null;
    } else {
      this.scope = 'add';
      this.add_type = null;
    }
  }
  ngOnInit() {

    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.id = this.route.snapshot.paramMap.get('id');
    setTimeout(async () => {
      if (this.id) {
        await this.getRawMaterialSaleData();
      }
    });
  }
  saveData() {
    this.topCard.onSubmit();
    this.tableData.onSubmit();
    this.saleTax.onSubmit();
    this.bottomCard.onSubmit();
    this.formData = {
      ...this.topCard.getFormGroup().value,
      ...this.tableData.getFormGroup().value,
      ...this.saleTax.getFormGroup().value,
      ...this.bottomCard.getFormGroup().value,
    };
    if (
      this.topCard.getFormGroup().valid &&
      this.tableData.getFormGroup().valid &&
      this.saleTax.getFormGroup().valid &&
      this.bottomCard.getFormGroup().valid
    ) {
      this.isApiCalled = true;
      if (this.scope == 'update') {
        let params = new URLSearchParams();
        params.set('organization_id', this.localStorage.organisation_id());
        params.set('method', 'edit');
        params.set('id', this.id);
        this.procurementApiService
          .updateRawMaterialSale(params, this.formData)
          .subscribe(
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
      } else {

        this.formData.financialyear = this.localStorageData.financial_year[0].id
        this.procurementApiService.addRawMaterialSale(this.formData).subscribe(
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
        '/procurement/raw-material-sales'
    );
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
  getRawMaterialSaleData() {
    new Promise((resolve, reject) => {
      let query = this.commonFunction.getURL({
        organization_id: this.localStorage.organisation_id(),
        financialyear:this.localStorageData.financial_year[0].id,
        id: this.id,
        project: this.localStorageData?.project_data?.id,
        site: this.localStorageData?.site_data?.id
      });
      this.procurementApiService.getRawMaterialList(query).subscribe((data) => {
        this.rawMaterialSaleData = data;
        resolve(true);
      });
    });
  }
}
