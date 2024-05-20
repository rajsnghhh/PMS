import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';


@Component({
  selector: 'app-grn-cancel-close',
  templateUrl: './grn-cancel-close.component.html',
  styleUrls: ['./grn-cancel-close.component.scss',
  '../../../../../../assets/scss/scrollableTable.scss',
]
})
export class GrnCancelCloseComponent {

  purchaseOrderAdvancedSearchForm!: FormGroup;
  purchaseOrderAdvancedSearchFormValue: any;

  localStorageData: any;
  siteList: Array<any> = [];
  vendorList: Array<any> = [];
  taxHeads: any = []
  userList: any = []
  materialTypeList: any;
  materialSubTypeList: any;
  grnList: Array<any> = []


  constructor(private fb: FormBuilder,
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService
  ) { }


  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.initPOAdvancedSearchForm();
    this.getSiteList();
    this.viewVendorList()
    this.getTaxHeadData();
    this.getUserList()
    this.getMaterialType();
    this.getGRNList();
  }

  getGRNList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    if (!this.purchaseOrderAdvancedSearchFormValue) {
      params.set('all', 'true');
    }

    if (this.purchaseOrderAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.purchaseOrderAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    this.procurementAPIService.getGRNList(params).subscribe(data => {
      this.grnList = data.results;
      if (this.grnList.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }

      for(let i=0; i<this.grnList.length; i++){
        this.grnList[i].grnItem = ''
        this.grnList[i].changeStatus = ''
      }
    })
  }

  onSearch() {

    let formdata = this.purchaseOrderAdvancedSearchForm.value

    let requestObj = {
      organization_id: this.localStorageData.organisation_details[0].id,
      
      date__gt: formdata.date__gt,
      date__lt: formdata.date__lt,
      received_from: formdata.received_from,
      site: formdata.site,
      site__location: formdata.site__location,
      status: formdata.status,
      vendor: formdata.vendor,
      job_site: formdata.job_site,
      manual_slip_no: formdata.manual_slip_no,
      transporter: formdata.transporter,
      purchase_order__site: formdata.purchase_order__site,
      procurement_grn_item__item__material_type: formdata.procurement_grn_item__item__material_type,
      procurement_grn_item__item__material_sub_type: formdata.procurement_grn_item__item__material_sub_type,
      received_by: formdata.received_by,
      carrying_vehicle_no: formdata.carrying_vehicle_no,
      request_code: formdata.request_code,
      purchase_order__request_code: formdata.purchase_order__request_code,
      rst_no: formdata.rst_no,
      challan_no: formdata.challan_no,
      lab_report_no: formdata.lab_report_no,
      created_by: formdata.created_by,
      updated_by: formdata.updated_by,
      procurement_grn_item__is_royalty: formdata.procurement_grn_item__is_royalty,
      procurement_grn_item__is_istp: formdata.procurement_grn_item__is_istp,
      updated_at__gt: formdata.updated_at__gt,
      updated_at__lt: formdata.updated_at__lt,
      created_at__gt: formdata.created_at__gt,
      created_at__lt: formdata.created_at__lt,
    }

    if (requestObj.updated_by) {
      requestObj.status = 'approved'
    }
    if (requestObj.procurement_grn_item__is_royalty == true) {
      requestObj.procurement_grn_item__is_royalty = 1
    }
    if (requestObj.procurement_grn_item__is_istp == true) {
      requestObj.procurement_grn_item__is_istp = 1
    }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }

    this.purchaseOrderAdvancedSearchFormValue = searchdata


    if (this.purchaseOrderAdvancedSearchFormValue) {
      this.getGRNList()
    }
  }

  onSubmit(){
    let reqArr = []
    for(let val of this.grnCheckboxIdsForCancelClose){
      var obj={
        id: val,
        status:this.grnList.find((data:any)=> data.id==val).changeStatus,
      }

      reqArr.push(obj)
    }
    
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('type', 'grn');

    this.procurementAPIService.updateProcurementSatatus(params, reqArr).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      this.grnCheckboxIdsForCancelClose=[]
      this.ngOnInit()
    })
  }

  grnCheckboxIdsForCancelClose :any = []
  onGRNCheckboxChange(event: any, itemId: number) {
    if (event.target.checked) {
      this.grnCheckboxIdsForCancelClose.push(itemId);
    } else {
      const index = this.grnCheckboxIdsForCancelClose.indexOf(itemId);
      if (index !== -1) {
        this.grnCheckboxIdsForCancelClose.splice(index, 1);
      }
    }
    
  }


  initPOAdvancedSearchForm() {
    this.purchaseOrderAdvancedSearchForm = this.fb.group({
      date__gt: [''],
      date__lt: [''],
      received_from: [''],
      site: [''],
      site__location: [''],
      status: [''],
      vendor: [''],
      job_site: [''],
      manual_slip_no: [''],
      transporter: [''],
      purchase_order__site: [''],
      procurement_grn_item__item__material_type: [''],
      procurement_grn_item__item__material_sub_type: [''],
      received_by: [''],
      carrying_vehicle_no: [''],
      request_code: [''],
      purchase_order__request_code: [''],
      rst_no: [''],
      challan_no: [''],
      lab_report_no: [''],
      created_by: [''],
      updated_by: [''],
      procurement_grn_item__is_royalty: [''],
      procurement_grn_item__is_istp: [''],
      updated_at__gt: [''],
      updated_at__lt: [''],
      created_at__gt: [''],
      created_at__lt: [''],
    });

  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
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

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
    })
  }

  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
      this.taxHeads = data.results
    });
  }

  getMaterialType() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialTypeList = data.results;      
    })
  }

  typeChange() {
    let params = new URLSearchParams();
    params.set('id', this.purchaseOrderAdvancedSearchForm.value.procurement_grn_item__item__material_type);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialSubTypeList = data;
    })
  }


}
