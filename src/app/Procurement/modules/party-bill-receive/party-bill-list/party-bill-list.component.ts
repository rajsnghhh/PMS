import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';


@Component({
  selector: 'app-party-bill-list',
  templateUrl: './party-bill-list.component.html',
  styleUrls: ['./party-bill-list.component.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class PartyBillListComponent implements OnInit {

  localStorageData: any;
  siteList: any;
  partBillList: any;
  userList:any;
  vendorList:any;
  deletePartyBillId:any;

  form: any = {
    received_date__gte: '',
    received_date__lte:'',
    bill_date__gte: '',
    bill_date__lte:'',
    forward_to_user: '',
    manual_slip_number: '',
    vendor: '',
    bill_type: '',
    site: '',
    voucher_status: '',
    status: '',
  };

  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getData();
    this.viewVendorList();
    this.getSiteList();   
    this.getUserList(); 
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
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

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }

  getData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('site', this.localStorageData.site_data.id);

    this.procurementAPIService.getBillReceive(params).subscribe(data => {
      this.partBillList = data.results;
    })
  }

  onSearch(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('received_date__gte', this.form.received_date__gte);
    params.set('received_date__lte', this.form.received_date__lte);
    params.set('bill_date__gte', this.form.bill_date__gte);
    params.set('bill_date__lte', this.form.bill_date__lte);
    params.set('forward_to_user', this.form.forward_to_user);
    params.set('manual_slip_number', this.form.manual_slip_number);
    params.set('vendor', this.form.vendor);
    params.set('bill_type', this.form.bill_type);
    params.set('site', this.localStorageData.site_data.id);
    params.set('voucher_status', this.form.voucher_status);
    params.set('status', this.form.status);

    this.procurementAPIService.getBillReceive(params).subscribe(data => {
      this.partBillList = data.results;
    })
  }

  editPartyBill(id: any) {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/party-bill-receive/update/'+ id])
  }

  deletePartyBill(id: number) {
    this.deletePartyBillId = id;
  }

  deleteAlertCompany() {
    let params = new URLSearchParams();
    params.set('id', this.deletePartyBillId);
    params.set('method', 'delete');
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);

    this.procurementAPIService.deleteBillReceive(params).subscribe((res: any) => {
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
