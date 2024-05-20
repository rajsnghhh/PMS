import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharingService } from 'src/app/Procurement/modules/purchase/data-sharing.service';

@Component({
  selector: 'app-add-update-item-stock-jv',
  templateUrl: './add-update-item-stock-jv.component.html',
  styleUrls: [
    './add-update-item-stock-jv.component.scss',
    '../../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class AddUpdateItemStockJvComponent {
  localStorageData:any
  issue_itemsArr:any = []
  receive_itemsArr:any = []
  itemObj:any = {}

  financialYearData: any = []
  siteList: Array<any> = [];
  sub_contractorList: Array<any> = [];

  @Output() parrentAction = new EventEmitter<any>();

  @Output("getItemStockJvList") getItemStockJvList: EventEmitter<any> = new EventEmitter();
  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();

  @ViewChild('submitButton', { read: ElementRef })

  submitButton!: ElementRef<HTMLElement>;
  storeList: any = [];
  masterlist:any = []
  materialGroupList:any = []
  materialSubTypeList:any = []
  uomList:any = []
  disabledEdit = true
  importData: any;

  MaterilFilterList: any = []
  // prefieldData : any = {}

  @Input() prefieldData: any;
  @Input() onEditAccess: any;
  @Input() scope: any;
  @Input() isMR_Approver: any;

  form:any = {
    item_stock_jv_table : false,

    financialyear : '',
    item_stock_jv_code : '',
    item_stock_jv_no : '',
    date : '',
    remark : '',
    
    issue_items : [],
    receive_items : [],
  };

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService : PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private dataService: DataSharingService,
  ) {
    
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    
    //this.getFinancoialYearData()
    // this.getSiteList()
    this.getStoreList()
    this.viewVendorList()

    // this.getmasterList();
    this.materialList()
    this.getUomList()
    
    if((this.onEditAccess == 'add')) {
      this.addIssueItem();
      this.addReceiveItem();
    }
  }

  changeIssueItem(i:any) {
    let filter =  this.MaterilFilterList.filter((item: { id: any; }) => item.id == this.form.issue_items[i].requested_material_issue)
    
    if(filter.length > 0) {
      this.form.issue_items[i].unit_issue = filter[0].unit_of_mesurement
    }
  }

  changeReceiveItem(i:any) {
    let filter =  this.MaterilFilterList.filter((item: { id: any; }) => item.id == this.form.receive_items[i].requested_material_receive)
    
    if(filter.length > 0) {
      this.form.receive_items[i].unit_receive = filter[0].unit_of_mesurement
    }
  }

  calculateIssueAmount(i:any){
    let quantity = Number(this.form.issue_items[i].quantity_issue)
    let rate = Number(this.form.issue_items[i].rate_issue)

    let amount = quantity * rate    
    this.form.issue_items[i].amount_issue = amount
  }
  
  calculateReceiveAmount(i:any){
    let quantity = Number(this.form.receive_items[i].quantity_receive)
    let rate = Number(this.form.receive_items[i].rate_receive)

    let amount = quantity * rate    
    this.form.receive_items[i].amount_receive = amount
  }

  getFinancoialYearData() {
    this.procurementApiService.getFinanCialyrData().subscribe(data => {
      this.financialYearData = data.results;
    })
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('site__project', this.form.project);
    // params.set('site', this.form.site);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })
  }

  // getSiteList() {
  //   let params = new URLSearchParams();
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   // params.set('project', this.selectedMRDetails.project);
  //   params.set('all', 'true');
  //   this.apiservice.getProcurementSiteList(params).subscribe(data => {
  //     this.siteList = data.results;
  //   })

  // }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorList(params).subscribe(data => {
      this.sub_contractorList = data.results;
      
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    
    if((this.onEditAccess == 'edit' || this.scope == 'view' || this.scope == 'print'  ) && this.prefieldData?.id) {      
      this.generatePrepopulateData(this.prefieldData)
    }
  }

  generatePrepopulateData(datalist:any) {
    this.form.issue_items = []
    this.form.receive_items = []
    
    this.form.financialyear = datalist.financialyear
    this.form.item_stock_jv_code = datalist.jv_no.split('-')[0]
    this.form.item_stock_jv_no = datalist.jv_no.split('-')[1]
    this.form.date = datalist.date
    this.form.remark = datalist.remark
    

    for(let i=0;i<datalist.issue_items.length;i++) {
      
      let temp = {
        id: datalist.issue_items[i].id,

        requested_material_issue : datalist.issue_items[i].item,
        quantity_issue : datalist.issue_items[i].quantity,

        unit_issue : datalist.issue_items[i].uom_details[0].id,

        rate_issue: datalist.issue_items[i].rate,
        amount_issue: datalist.issue_items[i].amount,
        store_issue: datalist.issue_items[i].store,
        type_issue: datalist.issue_items[i].type,
        
      }
      this.form.issue_items.push(temp)
    }

    for(let i=0;i<datalist.receive_items.length;i++) {
      
      let temp = {
        id: datalist.receive_items[i].id,

        requested_material_receive : datalist.receive_items[i].item,
        quantity_receive : datalist.receive_items[i].quantity,

        unit_receive : datalist.receive_items[i].uom_details[0].id,

        rate_receive: datalist.receive_items[i].rate,
        amount_receive: datalist.receive_items[i].amount,
        store_receive: datalist.receive_items[i].store,
        type_receive: datalist.receive_items[i].type,
        
      }
      this.form.receive_items.push(temp)
    }
  }

  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
      
    })
  }


  // getmasterList() {
  //   let params = new URLSearchParams();
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   params.set('parent__isnull', 'true');
  //   params.set('page', '1');
  //   params.set('page_size', '1000');
   
  //   this.apiservice.getMaterialTypeList(params).subscribe(data => {
  //     this.masterlist = data.results

  //     // this.generateMaterialData()
  //   })


  //   let preFilledItemGroupId = "";
  //   let preFilledSubItemGroupId = "";
  //   let preFilledItemId = "";

  //   let j = 0;
  //   for(let reqItem of this.form.issue_items){

  //     this.typeChange(preFilledItemGroupId, j)
  //     this.subTypeChange(preFilledSubItemGroupId, j)
  //     j++
  //   }
  // }

  // typeChange(typeid: any, i: any) {
  //   let params = new URLSearchParams();
  //   // params.set('id', typeid);
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   params.set('parent', typeid);
  //   params.set('page', '1');
  //   params.set('page_size', '1000');

  //   this.apiservice.getMaterialTypeList(params).subscribe(data => {
  //     // this.materialSubTypeList = data.results;      
  //     this.form.issue_items[i].MaterilSubGroupList = data.results;
      
      
  //   })
  // }

  // groupTypeChange(typeid: any, i: any){
  //   this.form.issue_items[i].requested_material_sub_group = '';
  //   let params = new URLSearchParams();
  //   // params.set('id', typeid);
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   params.set('parent', typeid);
  //   params.set('page', '1');
  //   params.set('page_size', '1000');

  //   this.apiservice.getMaterialTypeList(params).subscribe(data => {
  //     // this.materialSubTypeList = data.results;      
  //     this.form.issue_items[i].MaterilSubGroupList = data.results;
      
  //   })
  // }
  // subTypeChange(typeid: any, i: any){
  //   // ========= getting materials =========
  //   let params2 = new URLSearchParams();
  //   // params2.set('id', typeid);
  //   params2.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   // params2.set('material_type', typeid);
  //   params2.set('page', '1');
  //   params2.set('page_size', '1000');

  //   this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
  //     this.form.issue_items[i].MaterilFilterList = data2.results;
  //   })
  //   // ========= getting materials =========
  // }

  materialList(){
    // ========= getting materials =========
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params2.set('material_type', typeid);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.MaterilFilterList = data2.results;
      
    })
    // ========= getting materials =========
  }

  // setMaterialList(i: number) {
  //   let findGroup = this.form.issue_items[i]?.requested_material_group
  //   let findSubGroup = this.form.issue_items[i]?.requested_material_sub_group

  //   let materiallist =this.masterlist.filter(function (el:any) {
  //     // return el.material_type_name == findGroup && el.material_sub_type_name == findSubGroup 
  //     return el.material_type == findGroup && el.material_sub_type == findSubGroup 
  //   });
  //   this.MaterilFilterList = materiallist
    
  // }

  addIssueItem() {
    this.form.issue_items.push({
      "item": "",
      "quantity": "",
      "rate": "",
      "amount": "",
      "store": "",
      "type": "",
      "stock_type": "issue",
    })
  }
  deleteIssueItem(index:any) {
    this.form.issue_items.splice(index, 1);
  }

  addReceiveItem() {
    this.form.receive_items.push({
      "item": "",
      "quantity": "",
      "rate": "",
      "amount": "",
      "store": "",
      "type": "",
      "stock_type": "receive",
    })
  }
  deleteReceiveItem(index:any) {
    this.form.receive_items.splice(index, 1);
  }

  // handleUpload(event:any) {
  //   this.form.attachments = []
  //   for(let i=0;i<event.target.files.length;i++) {
  //     const file = event.target.files[i];
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       let replacestring = 'data:' +file.type +';base64,'
  //       let data = reader.result?.toString().replace(replacestring, '');
  //         this.form.attachments.push(
  //           {
  //             'organization':this.localStorageData.organisation_details[0].id,
  //             'file_data':data,
  //             'mime_type':file.type
  //           }
  //         )
  //     };
  //   }
  // }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  addUpdateMaterialWastage() { 
    if (!this.prefieldData) {
      let params = new URLSearchParams();

      this.issue_itemsArr = []
      for(let item of this.form.issue_items){
        let itemObj = {
          organization: this.localStorageData.organisation_details[0].id,

          item: item.requested_material_issue,
          quantity: item.quantity_issue,
          rate: item.rate_issue,
          amount: item.amount_issue,
          store: item.store_issue,
          type: item.type_issue,
          stock_type: "issue",
        }
        this.issue_itemsArr.push(itemObj)

      }

      this.receive_itemsArr = []
      for(let item of this.form.receive_items){
        let itemObj = {
          organization: this.localStorageData.organisation_details[0].id,

          item: item.requested_material_receive,
          quantity: item.quantity_receive,
          rate: item.rate_receive,
          amount: item.amount_receive,
          store: item.store_receive,
          type: item.type_receive,
          stock_type: "receive",
        }
        this.receive_itemsArr.push(itemObj)

      }
      
      let WASTAGE_ADD_OBJ = {
        organization: this.localStorageData.organisation_details[0].id,
        
        financialyear: this.localStorageData.financial_year[0].id,
        jv_no: this.form.item_stock_jv_code +'-'+ this.form.item_stock_jv_no,
        date: this.form.date,
        remark: this.form.remark,
        
        issue_items: this.issue_itemsArr,
        receive_items: this.receive_itemsArr,
      }
      
      this.procurementApiService.addItemStockJv(params, WASTAGE_ADD_OBJ).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getItemStockJvList.emit();
        }
      }, err => {
        if (err.error.error) {
          this.toastrService.error(err.error.error, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
        }
      })
    } else {
      let params = new URLSearchParams();
      params.set('id', this.prefieldData.id);
      params.set('method', 'edit');
      params.set('organization_id', this.localStorageData.organisation_details[0].id);

      this.issue_itemsArr = []
      for(let item of this.form.issue_items){
        let itemObj: any = {
          organization: this.localStorageData.organisation_details[0].id,

          item: item.requested_material_issue,
          quantity: item.quantity_issue,
          rate: item.rate_issue,
          amount: item.amount_issue,
          store: item.store_issue,
          type: item.type_issue,
          stock_type: "issue",
        }

        if(item.id){
          itemObj.id = item.id
        }

        this.issue_itemsArr.push(itemObj)

      }

      this.receive_itemsArr = []
      for(let item of this.form.receive_items){
        let itemObj: any = {
          organization: this.localStorageData.organisation_details[0].id,

          item: item.requested_material_receive,
          quantity: item.quantity_receive,
          rate: item.rate_receive,
          amount: item.amount_receive,
          store: item.store_receive,
          type: item.type_receive,
          stock_type: "receive",
        }

        if(item.id){
          itemObj.id = item.id
        }

        this.receive_itemsArr.push(itemObj)

      }
      
      let WASTAGE_EDIT_OBJ = {
        organization: this.localStorageData.organisation_details[0].id,
        
        financialyear: this.localStorageData.financial_year[0].id,
        jv_no: this.form.item_stock_jv_code +'-'+ this.form.item_stock_jv_no,
        date: this.form.date,
        remark: this.form.remark,
        
        issue_items: this.issue_itemsArr,
        receive_items: this.receive_itemsArr,
      }
      
      this.procurementApiService.updateItemStockJv(params, WASTAGE_EDIT_OBJ).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getItemStockJvList.emit();
        }
      }, err => {
        if (err.error.error) {
          this.toastrService.error(err.error.error, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
        }
      })
    }

  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched);
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched),
      'is-valid': form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched)
    };
  }
}
