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
  selector: 'app-add-update-single-log-book',
  templateUrl: './add-update-single-log-book.component.html',
  styleUrls: [
    './add-update-single-log-book.component.scss',
    '../../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../../assets/scss/scrollableTable.scss',  
  ]
})
export class AddUpdateSingleLogBookComponent {
  localStorageData:any
  issue_itemsArr:any = []
  receive_itemsArr:any = []
  itemObj:any = {}

  PnEmasterlist: any = []

  financialYearData: any = []
  siteList: Array<any> = [];
  sub_contractorList: Array<any> = [];

  @Output() parrentAction = new EventEmitter<any>();

  @Output("getSingleLogBookList") getSingleLogBookList: EventEmitter<any> = new EventEmitter();
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
    single_log_book_table : false,

    financialyear : '',
    date : '',
    from_time : '',
    to_time : '',
    owner : '',
    shift : '',
    plantmachinery : '',
    fuel_opening : '',
    fuel_closing : '',
    issue : '',
    consumption : '',
    driver_operator : '',
    helper_cleaner : '',
    store : '',
    
    average : '',
    
    work_done_type : '',
    remark : '',
    
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
    
    this.getPnEmasterList()
    //this.getFinancoialYearData()
    // this.getSiteList()
    this.getStoreList()
    //this.viewVendorList()

    // this.getmasterList();
    this.materialList()
    this.getUomList()
    
    if((this.onEditAccess == 'add')) {
      // this.addIssueItem();
      // this.addReceiveItem();
    }
  }

  getPnEmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getPlantMachineryList(params).subscribe(data => {
      this.PnEmasterlist = data.results
    })
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
    
    this.form.financialyear = datalist.financialyear
    this.form.date = datalist.date
    this.form.from_time = datalist.from_time
    this.form.to_time = datalist.to_time
    this.form.owner = datalist.owner
    this.form.shift = datalist.shift
    this.form.plantmachinery = datalist.plant_machinery_details.id
    this.form.fuel_opening = datalist.fuel_opening
    this.form.fuel_closing = datalist.fuel_closing
    this.form.issue = datalist.issue
    this.form.consumption = datalist.consumption
    this.form.driver_operator = datalist.driver_operator
    this.form.helper_cleaner = datalist.helper_cleaner
    this.form.store = datalist.store_details[0].id
    this.form.average = datalist.average
    this.form.work_done_type = datalist.work_done_type
    this.form.remark = datalist.remark

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

  addUpdateSingleLogBookMachine() { 
    if (!this.prefieldData) {
      let params = new URLSearchParams();
      
      let req = {
        organization: this.localStorageData.organisation_details[0].id,
        
        financialyear: this.localStorageData.financial_year[0].id,
        date: this.form.date,
        from_time: this.form.from_time,
        to_time: this.form.to_time,
        owner: this.form.owner,
        shift: this.form.shift,
        plantmachinery: this.form.plantmachinery,
        fuel_opening: this.form.fuel_opening,
        fuel_closing: this.form.fuel_closing,
        issue: this.form.issue,
        consumption: this.form.consumption,
        driver_operator: this.form.driver_operator,
        helper_cleaner: this.form.helper_cleaner,
        site:this.localStorageData.site_data.id,
        store: this.form.store,
        average: this.form.average,

        work_done_type: this.form.work_done_type,
        remark: this.form.remark,

        attachments: this.form.attachments,
      }

      this.procurementApiService.addSingleLogBookMachine(params, req).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getSingleLogBookList.emit();
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

      let req = {
        organization: this.localStorageData.organisation_details[0].id,
        
        financialyear:this.localStorageData.financial_year[0].id,
        date: this.form.date,
        from_time: this.form.from_time,
        to_time: this.form.to_time,
        owner: this.form.owner,
        shift: this.form.shift,
        plantmachinery: this.form.plantmachinery,
        fuel_opening: this.form.fuel_opening,
        fuel_closing: this.form.fuel_closing,
        issue: this.form.issue,
        consumption: this.form.consumption,
        driver_operator: this.form.driver_operator,
        helper_cleaner: this.form.helper_cleaner,
        store: this.form.store,
        average: this.form.average,

        work_done_type: this.form.work_done_type,
        remark: this.form.remark,

        attachments: this.form.attachments,
      }

      this.procurementApiService.updateSingleLogBookMachine(params, req).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getSingleLogBookList.emit();
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
