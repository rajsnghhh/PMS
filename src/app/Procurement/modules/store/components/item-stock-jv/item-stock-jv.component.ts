import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { environment } from 'src/environments/environment.prod';
declare var window: any;

@Component({
  selector: 'app-item-stock-jv',
  templateUrl: './item-stock-jv.component.html',
  styleUrls: [
    './item-stock-jv.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class ItemStockJvComponent {
  itemStockAdvancedSearchForm!: FormGroup;
  itemStockAdvancedSearchFormValue: any;

  environment = environment
  docUrl = ''

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;
  offcanvasAdd:any
  materialGroupList : any = []
  MaterilFilterList :any = []

  itemStockJvList: Array<any> = [];
  onEditTransportData: any;
  onEditAccess: any = 'add';

  addUpdateMaterialWastage: string = 'Add Item Stock JV';
  deleteTransportRateDetails: any;
  // rackCat: boolean = false;
  itemStock: boolean = false;
  setTransportRateViewList: Array<any> = [];

  scope: any = 'list'
  isItemStockJV_approver:boolean=false;

  @Output() activeScope = new EventEmitter<any>();
  @ViewChild('closeButton') closeButton!: ElementRef;
  
  constructor(
    private apiservice: APIService,
    private procurementApiSevice : PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService,
    private fb: FormBuilder,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.getUserDetails()
    this.getmasterList()
    this.getItems()
    this.initItemStockJvAdvancedSearchForm()
    this.getItemStockJvList();

    this.offcanvasAdd = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabeladdrole')
    );

    if(this.router.url=='/pms/store/item-stock-jv/add'){
      this.offcanvasAdd.show();
    }


    this.docUrl = environment.API_URL1+''
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0]?.user_permissions
      
      if (rolesArray.includes('procurement-item-stock-jv-approver')) {
        this.isItemStockJV_approver = true;
      }
    })
  }

  scopeChange(scope:any){
    this.activeScope.emit(scope);

    this.scope = 'approve'
    this.ngOnInit();
  }
  scopeChange2(scope:any){
    this.activeScope.emit(scope);

    this.scope = 'list'
    this.ngOnInit();
  }

  itemStockJVCheckboxIds :any = []
  onItemStockJVCheckboxChange(event: any, itemId: number) {
    if (event.target.checked) {
      this.itemStockJVCheckboxIds.push(itemId);
    } else {
      const index = this.itemStockJVCheckboxIds.indexOf(itemId);
      if (index !== -1) {
        this.itemStockJVCheckboxIds.splice(index, 1);
      }
    }
    
  }

  checkSubmit(){
    let req = []
    for(let i=0;i<this.itemStockJVCheckboxIds.length;i++) {
      req.push({
        "id": this.itemStockJVCheckboxIds[i],
        "status": "approved",
      })
    }

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('type', 'item-stock-jv');
    
    this.procurementApiSevice.updateProcurementSatatus(params,req).subscribe(data => {
      if (data.status == 400) {
        this.toastrService.error(data.msg, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.success(data.msg, '', {
          timeOut: 2000,
        });
      }

      this.activeScope.emit('list');
      this.scope = 'list'
      this.ngOnInit()
    })
  }

  initItemStockJvAdvancedSearchForm() {
    this.itemStockAdvancedSearchForm = this.fb.group({
      date__gte: [''],
      date__lte: [''],
      jv_no__icontains: [''],
      
    });
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
    let formdata = this.itemStockAdvancedSearchForm.value

    let requestObj: any = {}

    requestObj = {
      organization_id: this.localStorageData.organisation_details[0].id,

      date__gte: formdata.date__gte,
      date__lte: formdata.date__lte,
      jv_no__icontains: formdata.jv_no__icontains,
      
    }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }

    this.itemStockAdvancedSearchFormValue = searchdata

    this.getItemStockJvList()
  }

  getItemStockJvList() {
    let params = new URLSearchParams();

    if(this.scope == 'list'){
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('page_size', '1000');
      params.set('financialyear', this.localStorageData.financial_year[0].id);

    } else if(this.scope == 'approve'){
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('status', 'pending');
    }
    

    if (this.itemStockAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.itemStockAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }

    this.procurementApiSevice.getItemStockJvDetails(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.itemStockJvList = data.results;
      this.itemStock = true;
      
    })
  }

  editMaterialWastage(transport: any, access: any) {
    this.onEditTransportData = transport;
    this.onEditAccess = access;

    if (this.onEditTransportData && access == 'edit') {
      this.addUpdateMaterialWastage = 'Edit Item Stock JV'
    } else if (this.onEditTransportData && access == 'view') {
      this.addUpdateMaterialWastage = 'View Item Stock JV'
    }

  }

  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditTransportData = ''
    this.addUpdateMaterialWastage = 'Add Item Stock JV'
  }

  deleteAlertWastage(rack: any) {
    this.deleteTransportRateDetails = rack;
  }

  deleteItemStockJv(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.deleteTransportRateDetails.id);
    params.set('method','delete')

    this.procurementApiSevice.deleteItemStockJv(params).subscribe((res: any) => {
      
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      this.closeModal();
      this.getItemStockJvList();
      
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

    this.getItemStockJvList();
  }
}
