import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-acknowledgement-approval',
  templateUrl: './acknowledgement-approval.component.html',
  styleUrls: [
  
    '../../../../../../assets/scss/micro-view-table.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    './acknowledgement-approval.component.scss',
  ]
})
export class AcknowledgementApprovalComponent implements OnInit{


  selectAll = false
  approvalScreen = false
  procurementIssueList : any = []
  storeList : any = []
  issueAdvancedSearchFormValue:any = {};
  issueAdvancedSearchForm!: FormGroup;

  constructor(
    private router : Router,
    private procurementApiService : PROCUREMENTAPIService,
    private datasharedservice : DataSharedService,
    private activeroute : ActivatedRoute,
    private toasterService : ToastrService,
    private apiservice : APIService,
    private fb: FormBuilder,
    private commonFunction: CommonFunctionService
  ) {}

  localStorageData :any 
  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.initIssueAdvancedSearchForm()
    this.getProcurementIssueList('')
    this.getStoreList()
    this.getSiteList()
    this.getUOMData()
    if(this.router.url.indexOf('/material-issue/ackowledgement-approval') > -1) {
      this.approvalScreen = true
    } else {
      this.approvalScreen = false
    }
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })

  }

  onSubmit() {
    let filter = this.procurementIssueList.filter((item: { selectedUpdate: boolean; }) => item.selectedUpdate == true)
    if(filter.length > 0) {
      this.proceedtoSubmit(filter)
    } else {
      this.toasterService.error('No Item Added !', '', {
        timeOut: 2000,
      });
    }
  }


  filterList() {
    let formdata = this.issueAdvancedSearchForm.value

    let requestObj = {
      organization_id: this.localStorageData.organisation_details[0].id,
      material_issue__issue_type: formdata.issue_type,
      material_issue__issue_transfer_from: formdata.issue_transfer_from,
      material_issue__gate_pass_number__icontains: formdata.gate_pass_number,
      material_issue__issue_location__icontains: formdata.issue_location,
      material_issue__transporter: formdata.transporter,
      material_issue__store: formdata.store,
      material_issue__carrying_vehicle_number: formdata.carrying_vehicle_number,
      created_at__gt: formdata.issue_date,
      material_issue__manual_slip_number__icontains: formdata.manual_slip_number,
      material_issue__rst_number__icontains: formdata.rst_number,
      material_issue__lr_date: formdata.lr_date,
      material_issue__lr_number: formdata.lr_number,
      material_issue__carrying_driver: formdata.loaded_via,
      material_issue__loaded_via: formdata.loaded_via
    }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }


    this.issueAdvancedSearchFormValue = searchdata
    this.commonFunction.getURL(this.issueAdvancedSearchFormValue)
    this.getProcurementIssueList(this.commonFunction.getURL(this.issueAdvancedSearchFormValue))
  }


  siteList :any = []

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }

  uomList :any = []
  getUOMData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }


  initIssueAdvancedSearchForm() {
    this.issueAdvancedSearchForm = this.fb.group({
      issue_type: [''],
      issue_transfer_from: [''],
      gate_pass_number: [''],
      issue_location: [''],
      transporter: [''],
      store: [''],
      carrying_vehicle_number: [''],
      issue_date: [''],
      manual_slip_number: [''],
      rst_number: [''],
      lr_date: [''],
      lr_number: [''],
      carrying_driver: [''],
      loaded_via: ['']
    });

    this.issueAdvancedSearchFormValue.material_issue__project = this.localStorageData.project_data.id
    this.issueAdvancedSearchFormValue.material_issue__site = this.localStorageData.site_data.id
  }

  

  proceedtoSubmit(data:any) {
    for(let i=0;i<data.length;i++) {
      if(data[i].received_quantity == '') {
        data[i].received_quantity = 0
      }
      if(data[i].royalty_quantity == '') {
        data[i].royalty_quantity = 0
      }
      if(data[i].chainage_from == '') {
        data[i].chainage_from = 0
      }
      if(data[i].chainage_to == '') {
        data[i].chainage_to = 0
      }
      if(data[i].received_quantity_acknowledge == '') {
        data[i].received_quantity_acknowledge = 0
      }
      if(data[i].royalty_quantity_acknowledge == '') {
        data[i].royalty_quantity_acknowledge = 0
      }
      if(data[i].chainage_from_acknowledge == '') {
        data[i].chainage_from_acknowledge = 0
      }
      if(data[i].chainage_to_acknowledge == '') {
        data[i].chainage_to_acknowledge = 0
      }

    }
    let req:any = {
      issue_datas : []
    }

    for(let i=0;i<data.length;i++) {
      req.issue_datas.push({
        id : data[i].issue_id,
        organization : data[i].organization,
        project : data[i].issue_project_id,
        weight : data[i].weight,
        loc_bal_qty : data[i].loc_bal_qty,
        requested_material : data[i].requested_material,
        is_returnable : data[i].is_returnable,
        quantity : data[i].quantity,
        rate : data[i].rate,
        amount : data[i].amount,
        issue_items : []
      })

      for (var k in data[i]){
        if (data[i].hasOwnProperty(k)) {
          if(data[i][k] == null) {
            delete data[i][k]
          }
        }
      }

      req.issue_datas[i].issue_items.push(data[i])
      req.issue_datas[i].issue_items[0].id = data[i].issue_item_id
      req.issue_datas[i].issue_items[0].requested_material = data[i].mat_item_id
      if(this.approvalScreen && data[i].selectedapproveSelected) {
        req.issue_datas[i].issue_items[0].status = 'approved'
      }
    }

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.procurementApiService.addMultipleIssue(params,req).subscribe(data => {
      this.toasterService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      this.backtolist()
    })
    
  }

  approvecheck(index:any) {
    if(this.procurementIssueList[index].selectedapproveSelected) {
      this.procurementIssueList[index].selectedUpdate = true
    }
  }

  

  toggleeall() {
    for(let i=0;i<this.procurementIssueList.length;i++) {
      if(this.procurementIssueList[i].status == 'pending') {
        this.procurementIssueList[i].selectedUpdate = this.selectAll
      }
    }
  }


  getProcurementIssueList(query:any) {
    let params = new URLSearchParams();
    if(query == '') {
      params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    } else {
      params = query
    }

    if (this.issueAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.issueAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    
    this.procurementApiService.getProcurementIssueList(params).subscribe(data => {
      this.procurementIssueList = data.results?.Data;
      for(let i=0;i<this.procurementIssueList.length;i++) {
        this.procurementIssueList[i].selectedUpdate = false
        this.procurementIssueList[i].selectedapproveSelected = false
        if(this.procurementIssueList[i].received_quantity == 0) {
          this.procurementIssueList[i].received_quantity = ''
        }
        if(this.procurementIssueList[i].royalty_quantity == 0) {
          this.procurementIssueList[i].royalty_quantity = ''
        }
        if(this.procurementIssueList[i].chainage_from == 0) {
          this.procurementIssueList[i].chainage_from = ''
        }
        if(this.procurementIssueList[i].chainage_to == 0) {
          this.procurementIssueList[i].chainage_to = ''
        }

        if(this.procurementIssueList[i].received_quantity_acknowledge == 0) {
          this.procurementIssueList[i].received_quantity_acknowledge = ''
        }
        if(this.procurementIssueList[i].royalty_quantity_acknowledge == 0) {
          this.procurementIssueList[i].royalty_quantity_acknowledge = ''
        }
        if(this.procurementIssueList[i].chainage_from_acknowledge == 0) {
          this.procurementIssueList[i].chainage_from_acknowledge = ''
        }
        if(this.procurementIssueList[i].chainage_to_acknowledge == 0) {
          this.procurementIssueList[i].chainage_to_acknowledge = ''
        }

        if(this.procurementIssueList[i].status == 'pending') {
          this.procurementIssueList[i].received_date_acknowledge = this.procurementIssueList[i].received_date
          this.procurementIssueList[i].purchase_voucher_no_acknowledg = this.procurementIssueList[i].purchase_voucher_no
          this.procurementIssueList[i].received_site_acknowledge = this.procurementIssueList[i].received_site
          this.procurementIssueList[i].received_quantity_acknowledge = this.procurementIssueList[i].received_quantity
          this.procurementIssueList[i].received_unit_acknowledge = this.procurementIssueList[i].received_unit
          this.procurementIssueList[i].received_no_acknowledge = this.procurementIssueList[i].received_no
          this.procurementIssueList[i].waybill_form_no_acknowledge = this.procurementIssueList[i].waybill_form_no
          this.procurementIssueList[i].is_royalty_received_acknowledg = this.procurementIssueList[i].is_royalty_received
          this.procurementIssueList[i].royalty_no_acknowledge = this.procurementIssueList[i].royalty_no =
          this.procurementIssueList[i].royalty_quantity_acknowledge = this.procurementIssueList[i].royalty_quantity
          this.procurementIssueList[i].chainage_from_acknowledge = this.procurementIssueList[i].chainage_from
          this.procurementIssueList[i].chainage_to_acknowledge = this.procurementIssueList[i].chainage_to
          this.procurementIssueList[i].in_time_acknowledge = this.procurementIssueList[i].in_time 
          this.procurementIssueList[i].out_time_acknowledge = this.procurementIssueList[i].out_time 
          this.procurementIssueList[i].reach_time_acknowledge = this.procurementIssueList[i].reach_time 
          this.procurementIssueList[i].unload_time_acknowledge = this.procurementIssueList[i].unload_time
          this.procurementIssueList[i].return_time_acknowledge = this.procurementIssueList[i].return_time 
          this.procurementIssueList[i].voucher_type_acknowledge = this.procurementIssueList[i].voucher_type
          
        }
        

        
      }
    })
  }

  backtolist() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/material-issue')
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
  
}
