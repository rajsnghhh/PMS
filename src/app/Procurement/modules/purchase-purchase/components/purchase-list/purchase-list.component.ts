import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: [
    './purchase-list.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/tableactionButton.scss',
  ]
})
export class PurchaseListComponent {
  materialWastageAdvancedSearchForm!: FormGroup;
  materialWastageAdvancedSearchFormValue: any;
  addScope = false
  grn_Approver:boolean=false;
  purchase_Approver:boolean=false;
  purchase_Checker:boolean=false;
  environment = environment
  docUrl = ''

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;

  materialGroupList : any = []
  MaterilFilterList :any = []

  purchaseListDetails: Array<any> = [];
  onEditTransportData: any;
  onEditAccess: any = 'add';

  addUpdateMaterialWastage: string = 'Add Material Wastage';
  deleteTransportRateDetails: any;
  dashBoardData:any;
  // rackCat: boolean = false;
  purchaseList: boolean = false;
  setTransportRateViewList: Array<any> = [];

  @ViewChild('closeButton') closeButton!: ElementRef;
  
  constructor(
    private apiservice: APIService,
    private procurementApiSevice : PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService,
    private fb: FormBuilder,
    private activeroute: ActivatedRoute,
    private router: Router
  ) {
    this.activeroute.queryParams.subscribe(params => {
      this.dashBoardData = params;
    });
   }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.getmasterList()
    this.getItems()
    this.initMaterialWastageAdvancedSearchForm()
    this.getPurchaseList();
    this.getUserDetails();

    this.docUrl = environment.API_URL1+''

    if(this.activeroute.snapshot.paramMap.get('procurementScope') == 'purchase') {
      this.addScope = true
    }
  }

  initMaterialWastageAdvancedSearchForm() {
    this.materialWastageAdvancedSearchForm = this.fb.group({
      date_gte: [''],
      date_lte: [''],
      group: [''],
      material: [''],
      wastage_type: [''],
    });
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0]?.user_permissions

      if (rolesArray.includes('procurement-grn-approver')) {
        this.grn_Approver = true;
      }
      if (rolesArray.includes('procurement-purchase-approver')) {
        this.purchase_Approver = true;
      }
      if (rolesArray.includes('procurement-purchase-checker')) {
        this.purchase_Checker = true;
      }
    })
  }

  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialGroupList = data.results
      this.materialGroupList = this.materialGroupList.filter((item: any)=>{
        return item.parent != null
      })
      
    })
  }

  add() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase/add')
  }

  addGST() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase/add-gst')
  }

  viewById(data:any) {
    let id = data.id
    if(data.tax_type == 'gst') {
      this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase/view-gst/'+id)
    } else {
      this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase/view/'+id)
    }
  }

  updateById(data:any) {
    let id = data.id
    if(data.tax_type == 'gst') {
      this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase/update-gst/'+id)
    } else {
      this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase/update/'+id)
    }
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

  getItems(){
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.MaterilFilterList = data2.results;
    })
  }

  onSubmit() {
    let formdata = this.materialWastageAdvancedSearchForm.value

    let requestObj: any = {}

    requestObj = {
      organization_id: this.localStorageData.organisation_details[0].id,

      date_gte: formdata.date_gte,
      date_lte: formdata.date_lte,
      procurement_material_wastage_items__item__material_type: formdata.group,
      procurement_material_wastage_items__item: formdata.material,
      wastage_type: formdata.wastage_type,
    }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }

    this.materialWastageAdvancedSearchFormValue = searchdata

    this.getPurchaseList()
  }

  getPurchaseList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);

    // if (this.materialWastageAdvancedSearchFormValue) {
    //   for (const [key, value] of Object.entries(this.materialWastageAdvancedSearchFormValue)) {
    //     let val = '' + value
    //     let ky = '' + key
    //     params.set(ky, val)
    //   }
    // }
    if (this.dashBoardData) {
      if (this.dashBoardData.statusSearch == 'pending_next') {
        params.set('exclude__status__in','cancel,close,rejected')
      } else if (this.dashBoardData.statusSearch == 'rejected') {
        params.set('status','rejected')
      } else if (this.dashBoardData.statusSearch == 'pending_approve') {
        params.set('status','checked')
      } else if (this.dashBoardData.statusSearch == 'corrected') {
        params.set('version__gt','1')
      }

      if(this.dashBoardData.financialyear){
        params.set('financialyear', this.dashBoardData.financialyear);
      }
    }

    this.procurementApiSevice.getPurchaseListDetails(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.purchaseListDetails = data.results;
      this.purchaseList = true;
      
    })
  }

  editMaterialWastage(transport: any, access: any) {
    this.onEditTransportData = transport;
    this.onEditAccess = access;

    if (this.onEditTransportData && access == 'edit') {
      this.addUpdateMaterialWastage = 'Edit Material Wastage'
    } else if (this.onEditTransportData && access == 'view') {
      this.addUpdateMaterialWastage = 'View Material Wastage'
    }

  }

  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditTransportData = ''
    this.addUpdateMaterialWastage = 'Add Rack Setting'
  }

  deleteAlertWastage(rack: any) {
    this.deleteTransportRateDetails = rack;
  }

  deleteMaterialWastage(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.deleteTransportRateDetails.id);
    params.set('method','delete')

    this.procurementApiSevice.deletePurchase(params).subscribe((res: any) => {
      
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      // this.closeModal();
      // this.getPaginate();
      this.getPurchaseList()
      
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)


    this.procurementApiSevice.getPurchaseListDetails(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.purchaseListDetails = data.results;
      this.purchaseList = true;
      
    })

  }

  colapsIndex(i:number) {
    if(this.purchaseListDetails[i]['colaps']) {
      this.purchaseListDetails[i]['colaps'] = false
    } else {
      this.purchaseListDetails[i]['colaps'] = true
    }
  }

}
