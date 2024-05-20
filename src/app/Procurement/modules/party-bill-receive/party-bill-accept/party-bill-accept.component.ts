import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-party-bill-accept',
  templateUrl: './party-bill-accept.component.html',
  styleUrls: ['./party-bill-accept.component.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class PartyBillAcceptComponent {

  localStorageData: any;
  isParty_Bill_Editor:boolean=false;
  isParty_Bill_Approver:boolean=false;
  siteList: any;
  partBillList: any;
  userList: any;
  vendorList: any;
  deletePartyBillId: any;
  selectedBill: any = []
  forward_to_user: any;

  form: any = {
    received_date__gte: '',
    received_date__lte: '',
    bill_date__gte: '',
    bill_date__lte: '',
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
    this.getUserDetails();
  }


  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0]?.user_permissions

      if (rolesArray.includes('procurement-bill-receive-editor') || rolesArray.includes('procurement-bill-receive-approver')) {
        this.isParty_Bill_Editor = true
      }
      if (rolesArray.includes('procurement-bill-receive-approver')) {
        this.isParty_Bill_Approver = true
      }
    })
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
    params.set('site', this.localStorageData.site_data.id);

    this.procurementAPIService.getBillReceive(params).subscribe(data => {
      this.partBillList = data.results;
      this.partBillList.forEach((_covenants: any) => {
        _covenants.checkStatus = false;
      });
    })
  }

  onSearch() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('received_date__gte', this.form.received_date__gte);
    params.set('received_date__lte', this.form.received_date__lte);
    params.set('bill_date__gte', this.form.bill_date__gte);
    params.set('bill_date__lte', this.form.bill_date__lte);
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

  changeStatus() {
    for (let val of this.partBillList) {
      if (val.checkStatus) {
        if (!this.selectedBill.includes(val.id)) {
          this.selectedBill.push(val.id);
        } 
      }else {
        const index = this.selectedBill.indexOf(val.id);
        if (index > -1) {
          this.selectedBill.splice(index, 1);
        }
      }
    }
  }

  forwardTo(){

    if(this.forward_to_user){
      let req = []
      for(let i=0;i<this.selectedBill.length;i++) {
        req.push({
          "id": this.selectedBill[i],
          "forward_to_user_id": this.forward_to_user
        })
      }
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('type', 'bill-receive');
      this.procurementAPIService.updateProcurementSatatus(params, req).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.getData();
      })
    }else{
      this.toastrService.error('Please Select the Forward User', '', {
        timeOut: 2000,
      });
    }
   
  }

  approveBill(){
    let req = []
    for(let i=0;i<this.selectedBill.length;i++) {
      req.push({
        "id": this.selectedBill[i],
        "status": "approved"
      })
    }
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('type', 'bill-receive');
    this.procurementAPIService.updateProcurementSatatus(params, req).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      this.getData();
    })
  }
  rejectBill(){
    let req = []
    for(let i=0;i<this.selectedBill.length;i++) {
      req.push({
        "id": this.selectedBill[i],
        "status": "rejected"
      })
    }
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('type', 'bill-receive');
    this.procurementAPIService.updateProcurementSatatus(params, req).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      this.getData();
    })
  }

}

