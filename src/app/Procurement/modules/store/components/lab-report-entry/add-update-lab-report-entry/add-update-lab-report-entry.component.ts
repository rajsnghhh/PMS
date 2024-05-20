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
  selector: 'app-add-update-lab-report-entry',
  templateUrl: './add-update-lab-report-entry.component.html',
  styleUrls: [
    './add-update-lab-report-entry.component.scss',
    '../../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class AddUpdateLabReportEntryComponent {
  localStorageData:any
  issue_itemsArr:any = []
  receive_itemsArr:any = []
  itemObj:any = {}
  
  itemArray: any = [];

  PnEmasterlist: any = []

  siteList: Array<any> = [];
  sub_contractorList: Array<any> = [];

  @Output() parrentAction = new EventEmitter<any>();

  @Output("labReportEntryList") labReportEntryList: EventEmitter<any> = new EventEmitter();
  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();

  @ViewChild('submitButton', { read: ElementRef })

  submitButton!: ElementRef<HTMLElement>;
  storeList: any = [];
  itemList: any = [];
  masterlist:any = []
  materialGroupList:any = []
  materialSubTypeList:any = []
  uomList:any = []
  disabledEdit = true
  importData: any;
  MaterilFilterListSettings = {};


  gatePassList :any = []

  MaterilFilterList: any = []
  // prefieldData : any = {}

  @Input() prefieldData: any;
  @Input() onEditAccess: any;
  @Input() scope: any;
  @Input() isMR_Approver: any;

  form:any = {
    lab_report_table : false,

    financialyear : '',
    gate_pass_no : '',
    lr_no : '',
    date : '',
    item_group : '',
    item : '',
    sample_quantity : '',

    remark : '',

    items: [],
    
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
    
    this.getPassList()
    this.getPnEmasterList()
    // this.getSiteList()
    this.getStoreList()
    this.viewVendorList()

    this.getmasterList()
    this.getItems()

    this.getUomList()
    
    if((this.onEditAccess == 'add')) {
      // this.addIssueItem();
      // this.addReceiveItem();
    }
  }

  showMultiStateSelect() {
    this.MaterilFilterList = []

    for (const item of this.itemList) {
      var obj = {
        id: item.id,
        itemName: item?.material_name
      }
      this.MaterilFilterList.push(obj);
    }
    
  }
  setupMultiSelectOptions() {
    this.MaterilFilterListSettings = {
      singleSelection: false,
      text: "Select Items",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
  }
  onMultiSelectAddUser(item: any) {
    this.itemArray.push(item.id)

    let pushAble = {
      item: item.id,
      itemName: item.itemName,
      remark: '',
      accept: ''
    }
    this.form.items.push(pushAble)
  }
  OnMultiDeSelectAddUser(item: any) {
    const index: number = this.itemArray.indexOf(item.id);
    if (index !== -1) {
      this.itemArray.splice(index, 1);

      this.form.items.splice(index, 1);
    }
  }
  onMultiSelectAddUserAll(items: any) {
    this.itemArray = [];
    for (const item of items) {
      this.itemArray.push(item.id);

      let pushAble = {
        item: item.id,
        itemName: item.itemName,
        remark: '',
        accept: ''
      }
      this.form.items.push(pushAble)
    }
  }
  onMultiDeSelectAddUserAll(items: any) {
    this.itemArray = [];
    this.form.items = [];
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
    if(this.form.item_group){
      params2.set('material_type', this.form.item_group);
    }
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.itemList = data2.results;
      
      this.showMultiStateSelect()
    })
  }

  getPassList() {
    
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementApiService.getListGatePass(params).subscribe(data => {
      this.gatePassList = data.results;
      
    })
    
  }

  getPnEmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getPlantMachineryList(params).subscribe(data => {
      this.PnEmasterlist = data.results
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
    this.apiservice.getVendorListNew(params).subscribe(data => {
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
    let itemArray: any = []
    for(let item of datalist.materials_details){
      let obj = {
        id: item.id,
        itemName: item.material_name,
      }
      itemArray.push(obj)
    }
    
    let itemAcceptRejectArr: any = []
    for(let item of datalist.items){
      let obj2 = {
        id: item.id,

        organization: this.localStorageData.organisation_details[0].id,

        item: item.item,
        itemName: item.materials_details[0].material_name,
        remark: item.remark,
        accept: item.accept,
      }
      itemAcceptRejectArr.push(obj2)
    }

    this.form.financialyear = datalist.financialyear
    this.form.gate_pass_no = datalist.gate_pass_no
    this.form.lr_no = datalist.request_code
    this.form.date = datalist.date
    this.form.item_group = datalist.materials_groups[0]

    this.form.item = itemArray
    this.form.sample_quantity = datalist.sample_quantity
    
    this.form.remark = datalist.remark
    this.form.items = itemAcceptRejectArr
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

  // materialList(){
  //   // ========= getting materials =========
  //   let params2 = new URLSearchParams();
  //   // params2.set('id', typeid);
  //   params2.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   // params2.set('material_type', typeid);
  //   params2.set('page', '1');
  //   params2.set('page_size', '1000');

  //   this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
  //     this.MaterilFilterList = data2.results;
      
  //   })
  //   // ========= getting materials =========
  // }

  // setMaterialList(i: number) {
  //   let findGroup = this.form.issue_items[i]?.requested_material_group
  //   let findSubGroup = this.form.issue_items[i]?.requested_material_sub_group

  //   let materiallist =this.masterlist.filter(function (el:any) {
  //     // return el.material_type_name == findGroup && el.material_sub_type_name == findSubGroup 
  //     return el.material_type == findGroup && el.material_sub_type == findSubGroup 
  //   });
  //   this.MaterilFilterList = materiallist
    
  // }

  // addIssueItem() {
  //   this.form.issue_items.push({
  //     "item": "",
  //     "quantity": "",
  //     "rate": "",
  //     "amount": "",
  //     "store": "",
  //     "type": "",
  //   })
  // }
  // deleteIssueItem(index:any) {
  //   this.form.issue_items.splice(index, 1);
  // }

  // addReceiveItem() {
  //   this.form.receive_items.push({
  //     "item": "",
  //     "quantity": "",
  //     "rate": "",
  //     "amount": "",
  //     "store": "",
  //     "type": "",
  //   })
  // }
  // deleteReceiveItem(index:any) {
  //   this.form.receive_items.splice(index, 1);
  // }

  handleUpload(event:any) {
    this.form.attachments = []
    for(let i=0;i<event.target.files.length;i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let replacestring = 'data:' +file.type +';base64,'
        let data = reader.result?.toString().replace(replacestring, '');
          this.form.attachments.push(
            {
              'organization':this.localStorageData.organisation_details[0].id,
              'file_data':data,
              'mime_type':file.type
            }
          )
      };
    }
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  addUpdateLabReportEntry() { 
    if (!this.prefieldData) {
      let params = new URLSearchParams();
      
      let itemsArray: any = []
      for(let item of this.form.items){
        let obj = {
          organization: this.localStorageData.organisation_details[0].id,
          item: item.item,
          remark: item.remark,
          accept: (item.accept)? "true":"false",
        }
        itemsArray.push(obj)
      }

      let materialsArr: any = []
      for(let item of this.form.item){
        materialsArr.push(item.id)
      }

      let materialGroupsArr: any = []
      materialGroupsArr.push(Number(this.form.item_group))
      let req = {
        organization: this.localStorageData.organisation_details[0].id,
        
        financialyear: this.localStorageData.financial_year[0].id,
        date: this.form.date,
        sample_quantity: this.form.sample_quantity,
        materials_groups: materialGroupsArr,
        materials: materialsArr,
        remark: this.form.remark,
        gate_pass_no: this.form.gate_pass_no,

        items: itemsArray
      }
      
      this.procurementApiService.addLabReportEntry(params, req).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.labReportEntryList.emit();
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

      let itemsArray: any = []
      for(let item of this.form.items){
        let obj: any = {
          organization: this.localStorageData.organisation_details[0].id,

          item: item.item,
          remark: item.remark,
          accept: (item.accept)? "true":"false",
        }

        if(item.id){
          obj.id = item.id
        }

        itemsArray.push(obj)
      }

      let materialsArr: any = []
      for(let item of this.form.item){
        materialsArr.push(item.id)
      }

      let materialGroupsArr: any = []
      materialGroupsArr.push(Number(this.form.item_group))
      let req = {
        organization: this.localStorageData.organisation_details[0].id,
        
        financialyear: this.form.financialyear,
        date: this.form.date,
        sample_quantity: this.form.sample_quantity,
        materials_groups: materialGroupsArr,
        materials: materialsArr,
        remark: this.form.remark,
        gate_pass_no: this.form.gate_pass_no,

        items: itemsArray
      }
      
      this.procurementApiService.updateLabReportEntry(params, req).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.labReportEntryList.emit();
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
