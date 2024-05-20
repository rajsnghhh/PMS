import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
declare var window: any;


@Component({
  selector: 'app-grn-advance-search',
  templateUrl: './grn-advance-search.component.html',
  styleUrls: ['./grn-advance-search.component.scss',
    '../../../../../assets/scss/scrollableTable.scss']

})
export class GrnAdvanceSearchComponent {
  purchaseOrderAdvancedSearchForm!: FormGroup;
  localStorageData: any;
  dashBoardData:any;
  purchaseOrderAdvancedSearchFormValue: any={};
  siteList: Array<any> = [];
  vendorList: Array<any> = [];
  taxHeads: any = []
  userList: any = []
  materialTypeList: any;
  materialSubTypeList: any;
  importCanvas : any;

  constructor(private fb: FormBuilder,
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) { 
    this.activeroute.queryParams.subscribe(params => {
      this.dashBoardData = params;
    });
  }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.initPOAdvancedSearchForm();
    this.getSiteList();
    this.viewVendorList()
    this.getTaxHeadData();
    this.getUserList()
    this.getMaterialType();

    this.importCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightImport')
    );

    if(this.router.url=='/pms/store/procurement/grn/import'){
      this.importCanvas.show();
    }
  }

  reloadData(){
    this.initPOAdvancedSearchForm();
    this.getSiteList();
    this.viewVendorList()
    this.getTaxHeadData();
    this.getUserList()
    this.getMaterialType();

    this.importCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightImport')
    );
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

    if (this.dashBoardData) {
      if (this.dashBoardData.statusSearch == 'pending_next') {
        this.purchaseOrderAdvancedSearchFormValue.exclude__status__in = 'cancel,close,rejected'
      } else if (this.dashBoardData.statusSearch == 'rejected') {
        this.purchaseOrderAdvancedSearchFormValue.status = 'rejected'
      } else if (this.dashBoardData.statusSearch == 'pending_approve') {
        this.purchaseOrderAdvancedSearchFormValue.status = 'checked'
      } else if (this.dashBoardData.statusSearch == 'corrected') {
        this.purchaseOrderAdvancedSearchFormValue.version__gt = '1'
      }

      if (this.dashBoardData.financialyear) {
        this.purchaseOrderAdvancedSearchFormValue.financialyear = this.dashBoardData.financialyear
      }
    }

  }


  importGRN() {
    this.importCanvas.show()
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('project', this.selectedMRDetails.project);
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

  addNew() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/grn/create'])
  }

  addNewgst() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/grn/create-gst'])
  }

  onSubmit() {

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
  }

}

