import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-sublet-order',
  templateUrl: './sublet-order.component.html',
  styleUrls: ['./sublet-order.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',]
})
export class SubletOrderComponent implements OnInit {

  scope: any;
  localStorageData: any;
  vendorList: any;
  subletOrderList: any;
  deleteSubletId: any;
  editId: any;

  form: any = {
    organization: '',
    so_no: '',
    date: '',
    company: '',
    number: '',
    work_description: '',
    representative: '',
  };

  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewVendorList();
    this.getData();
  }

  getData() {
    let params = new URLSearchParams();
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    this.procurementAPIService.getSubletOrder(params).subscribe(data => {
      this.subletOrderList = data.results;
    })
  }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }

  onSubmit() {
    this.form.organization = this.localStorageData.organisation_details[0].id;

    if (this.scope == 'edit') {

      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
      params.set('method', 'edit');
      params.set('id', this.editId);

      this.procurementAPIService.updateSubletOrder(params, this.form).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        window.location.reload();
      })
    } else {
      this.form.financialyear=this.localStorageData.financial_year[0].id;

      this.procurementAPIService.addSubletOrder(this.form).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        window.location.reload();
      })
    }
  }

  editSubletOrder(id: any) {
    this.editId = id;
    this.scope = 'edit'
    let params = new URLSearchParams();
    params.set('id', id);
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);

    this.procurementAPIService.getSubletOrder(params).subscribe(data => {
      this.form.so_no = data.so_no;
      this.form.date = data.date;
      this.form.company = data.company;
      this.form.number = data.number;
      this.form.work_description = data.work_description;
      this.form.representative = data.representative;

    })
  }

  deleteSubletOrder(id: number) {
    this.deleteSubletId = id;
  }

  deleteAlertCompany() {
    let params = new URLSearchParams();
    params.set('id', this.deleteSubletId);
    params.set('method', 'delete');
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);

    this.procurementAPIService.deleteSuborder(params).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getData();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }


}
