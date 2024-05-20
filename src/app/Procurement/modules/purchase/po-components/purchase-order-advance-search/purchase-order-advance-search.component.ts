import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { AccessPermissionService } from 'src/app/Shared/Services/access-permission.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-purchase-order-advance-search',
  templateUrl: './purchase-order-advance-search.component.html',
  styleUrls: ['./purchase-order-advance-search.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss']
})
export class PurchaseOrderAdvanceSearchComponent {
  purchaseOrderAdvancedSearchForm!: FormGroup;
  localStorageData: any;
  purchaseOrderAdvancedSearchFormValue: any={};
  dashBoardData:any;
  siteList: Array<any> = [];
  vendorList: Array<any> = [];
  PO_Approver:boolean=false;
  taxHeads: any = []
  userList: any = []
  scope: any = 'list'
  materialTypeList: any;
  materialSubTypeList: any;
  activeScope: any = ''
  MaterilFilterList: any = []

  constructor(
    private fb: FormBuilder,
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private accessPermissionService: AccessPermissionService,
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
    this.getUserDetails()
    this.activeScope = this.activeroute.snapshot.paramMap.get('procurementScope')
  }


  scopeData(data: any) {
    this.scope = data;
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0]?.user_permissions

      if (rolesArray.includes('procurement-po-approver')) {
        this.PO_Approver = true;
      }
    })
  }

  initPOAdvancedSearchForm() {
    this.purchaseOrderAdvancedSearchForm = this.fb.group({
      created_at__gt: [''],
      created_at__lt: [''],
      date: [''],
      // po_grn_status: [''],
      site: [ {value: this.localStorageData.site_data.id, disabled: true}],
      delivery_site: [''],
      vendor: [''],
      procurement_po_tax__tax_head: [''],
      procurement_purchase_order_item__item__material_type: [''],
      procurement_purchase_order_item__item: [''],
      po_for__icontains: [''],
      updated_by_id: [''],
      status: [''],
      procurement_po_delivery_loc__delivery_location: [''],
      po_no: [''],
      procurement_purchase_order_item__unit_rate__gt: [''],
      procurement_purchase_order_item__unit_rate__lt: [''],
      procurement_purchase_order_item__quantity__gt: [''],
      procurement_purchase_order_item__quantity__lt: ['']
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
      this.purchaseOrderAdvancedSearchFormValue.project = this.localStorageData.project_data.id
      this.purchaseOrderAdvancedSearchFormValue.site = this.localStorageData.site_data.id
    }

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

      this.materialTypeList = this.materialTypeList.filter((item: any) => {
        return item.parent != null
      });

    })
  }

  typeChange() {
    let params = new URLSearchParams();
    params.set('id', this.purchaseOrderAdvancedSearchForm.value.procurement_purchase_order_item__item__material_type);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialSubTypeList = data;

    })
  }
  subTypeChange() {
    // ========= getting materials =========
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', this.purchaseOrderAdvancedSearchForm.value.procurement_purchase_order_item__item__material_type);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.MaterilFilterList = data2.results;

    })
    // ========= getting materials =========
  }

  addNew() {
    this.router.navigate(['/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/purchase-order/create'])
  }

  addNewGST() {
    this.router.navigate(['/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/purchase-order/create/gst'])
  }

  indentList() {
    this.router.navigate(['/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/indent'])
  }

  multistageApproval() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/multistage-approval'])
  }


  permissionData: any = {}

  getPermissionchild(moduleName: string) {
    if (moduleName in this.permissionData) {
      return this.permissionData[moduleName]
    } else {
      this.permissionData[moduleName] = this.accessPermissionService.getModulePermissions(moduleName).level_permission
      return this.permissionData[moduleName]
    }
  }


  onSubmit() {

    let formdata = this.purchaseOrderAdvancedSearchForm.value

    let requestObj = {
      organization_id: this.localStorageData.organisation_details[0].id,
      created_at__gt: formdata.created_at__gt,
      created_at__lt: formdata.created_at__lt,
      date: formdata.date,
      // po_grn_status: formdata.po_grn_status,
      site: formdata.site,
      delivery_site: formdata.delivery_site,
      vendor: formdata.vendor,
      procurement_po_tax__tax_head: formdata.procurement_po_tax__tax_head,
      procurement_purchase_order_item__item__material_type: formdata.procurement_purchase_order_item__item__material_type,
      procurement_purchase_order_item__item: formdata.procurement_purchase_order_item__item,
      po_for__icontains: formdata.po_for__icontains,
      updated_by_id: formdata.updated_by_id,
      status: formdata.status,
      procurement_po_delivery_loc__delivery_location: formdata.procurement_po_delivery_loc__delivery_location,
      request_code: formdata.po_no,
      procurement_purchase_order_item__unit_rate__gt: formdata.procurement_purchase_order_item__unit_rate__gt,
      procurement_purchase_order_item__unit_rate__lt: formdata.procurement_purchase_order_item__unit_rate__lt,
      procurement_purchase_order_item__quantity__gt: formdata.procurement_purchase_order_item__quantity__gt,
      procurement_purchase_order_item__quantity__lt: formdata.procurement_purchase_order_item__quantity__lt
    }

    if (requestObj.updated_by_id) {
      requestObj.status = 'approved'
    }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }

    this.purchaseOrderAdvancedSearchFormValue = searchdata

    this.purchaseOrderAdvancedSearchFormValue.project = this.localStorageData.project_data.id
    this.purchaseOrderAdvancedSearchFormValue.site = this.localStorageData.site_data.id
  }

}
