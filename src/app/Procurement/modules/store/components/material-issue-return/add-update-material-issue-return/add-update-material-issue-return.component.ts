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
  selector: 'app-add-update-material-issue-return',
  templateUrl: './add-update-material-issue-return.component.html',
  styleUrls: [
    './add-update-material-issue-return.component.scss',
    '../../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class AddUpdateMaterialIssueReturnComponent {
  localStorageData:any
  return_itemsArr:any = []
  receive_itemsArr:any = []
  itemObj:any = {}

  financialYearData: any = []
  siteList: Array<any> = [];
  sub_contractorList: Array<any> = [];

  @Output() parrentAction = new EventEmitter<any>();

  @Output("getMaterialIssueReturnList") getMaterialIssueReturnList: EventEmitter<any> = new EventEmitter();
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
  userList: any = []

  MaterilFilterList: any = []
  // prefieldData : any = {}

  @Input() prefieldData: any;
  @Input() preFilledIssueData: any;
  @Input() onEditAccess: any;
  @Input() scope: any;
  @Input() isMR_Approver: any;

  form:any = {
    material_issue_return_table : false,

    financialyear: '',
    material_issue_return_code : '',
    material_issue_return_no : '',
    return_date : '',
    return_type : '',
    return_from_site : '',
    gate_pass_no : '',
    manual_slip_no : '',
    in_our_carrying_vehicle : '',
    in_our_carrying_vehicle_text : '',

    remarks : '',
    return_to : '',
    return_from : '',
    
    return_items : [],
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
    
    this.form.financialyear = this.localStorageData.financial_year[0].id

    this.getUserList()
   // this.getFinancoialYearData()
    this.getSiteList()
    this.getStoreList()
    //this.viewVendorList()

    // this.getmasterList();
    this.materialList()
    this.getUomList()
    
    if((this.onEditAccess == 'add')) {
      this.addIssueItem();
    }
    
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
      
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
      this.sub_contractorList = data.results;
      
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    if((this.onEditAccess == 'edit' || this.scope == 'view' || this.scope == 'print'  ) && this.prefieldData?.id) {      
      this.generatePrepopulateData(this.prefieldData)
    }

    if(this.preFilledIssueData){
      this.generatePrepopulateIssueData(this.preFilledIssueData)
    }
  }

  generatePrepopulateIssueData(datalist:any){
    
    this.form.return_items = []

    this.form.material_issue = datalist.id

    this.form.gate_pass_no = datalist.gate_pass_number
    this.form.in_our_carrying_vehicle_text = datalist.carrying_vehicle_number

    for(let i=0;i<datalist.issue_items.length;i++) {
      
      let temp = {
        item : datalist.issue_items[i].requested_material,
        material_issue_item : datalist.issue_items[i].id,
        material_request_item : datalist.issue_items[i].material_request_item,
        
      }
      this.form.return_items.push(temp)
    }
  }

  generatePrepopulateData(datalist:any) {
    
    this.form.return_items = []
    
    this.form.financialyear = datalist.financialyear
    this.form.material_issue_return_code = datalist.material_issue_return_no.split('-')[0]
    this.form.material_issue_return_no = datalist.material_issue_return_no.split('-')[1]
    this.form.return_date = datalist.return_date
    this.form.return_type = datalist.return_type
    this.form.return_from_site = datalist.return_from_site
    this.form.gate_pass_no = datalist.gate_pass_no
    this.form.manual_slip_no = datalist.manual_slip_no
    this.form.in_our_carrying_vehicle = datalist.in_our_carrying_vehicle
    this.form.in_our_carrying_vehicle_text = datalist.in_our_carrying_vehicle_text

    this.form.remarks = datalist.remarks
    this.form.return_from = datalist.return_from
    this.form.return_to = datalist.return_to

    for(let i=0;i<datalist.return_items.length;i++) {
      
      let temp = {
        id: datalist.return_items[i].id,

        item : datalist.return_items[i].item,
        is_scrap : datalist.return_items[i].is_scrap,
        quantity : datalist.return_items[i].quantity,
        quantity_unit_issue : datalist.return_items[i].quantity_unit_issue,
        weight : datalist.return_items[i].weight,
        weight_unit_issue : datalist.return_items[i].weight_uom,
        return_from : datalist.return_items[i].return_from,
        rate : datalist.return_items[i].rate,
        amount : datalist.return_items[i].amount,
        log_book : datalist.return_items[i].log_book,
        remark : datalist.return_items[i].remark,
        
      }
      this.form.return_items.push(temp)
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
  //   for(let reqItem of this.form.return_items){

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
  //     this.form.return_items[i].MaterilSubGroupList = data.results;
      
      
  //   })
  // }

  // groupTypeChange(typeid: any, i: any){
  //   this.form.return_items[i].requested_material_sub_group = '';
  //   let params = new URLSearchParams();
  //   // params.set('id', typeid);
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   params.set('parent', typeid);
  //   params.set('page', '1');
  //   params.set('page_size', '1000');

  //   this.apiservice.getMaterialTypeList(params).subscribe(data => {
  //     // this.materialSubTypeList = data.results;      
  //     this.form.return_items[i].MaterilSubGroupList = data.results;
      
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
  //     this.form.return_items[i].MaterilFilterList = data2.results;
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
  //   let findGroup = this.form.return_items[i]?.requested_material_group
  //   let findSubGroup = this.form.return_items[i]?.requested_material_sub_group

  //   let materiallist =this.masterlist.filter(function (el:any) {
  //     // return el.material_type_name == findGroup && el.material_sub_type_name == findSubGroup 
  //     return el.material_type == findGroup && el.material_sub_type == findSubGroup 
  //   });
  //   this.MaterilFilterList = materiallist
    
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

  addIssueItem() {
    this.form.return_items.push({
      "item": "",
      "is_scrap": "",
      "quantity": "",
      "weight": "",
      "weight_unit_issue": "",
      "return_from": "",
      "rate": "",
      "amount": "",

      "log_book": "",
      "remark": "",

    })
  }
  deleteIssueItem(index:any) {
    this.form.return_items.splice(index, 1);
  }

  changeItem(i:any) {
    let filter =  this.MaterilFilterList.filter((item: { id: any; }) => item.id == this.form.return_items[i].item)
    
    if(filter.length > 0) {
      this.form.return_items[i].quantity_unit_issue = filter[0].unit_of_mesurement
    }
  }

  calculateAmount(i:any){
    let quantity = Number(this.form.return_items[i].quantity)
    let rate = Number(this.form.return_items[i].rate)

    let amount = quantity * rate    
    this.form.return_items[i].amount = amount
  }

  addUpdateMaterialIssueReturn() { 
    if (!this.prefieldData) {
      let params = new URLSearchParams();

      for(let item of this.form.return_items){
        let itemObj: any = {
          organization: this.localStorageData.organisation_details[0].id,

          item: item.item,
          is_scrap: (item.is_scrap)? true:false,
          quantity: item.quantity,
          weight: item.weight,
          weight_uom: item.weight_unit_issue,
          rate: item.rate,
          amount: item.amount,
          return_from: item.return_from,
          log_book: item.log_book,
          remark: item.remark,
        }

        if(item.material_issue_item){
          itemObj.material_issue_item = item.material_issue_item
        }
        if(item.material_request_item){
          itemObj.material_request_item = item.material_request_item
        }

        this.return_itemsArr.push(itemObj)
      }
      
      let req: any = {
        organization: this.localStorageData.organisation_details[0].id,

        financialyear: this.localStorageData.financial_year[0].id.toString(),
        material_issue_return_no: this.form.material_issue_return_code +'-'+ this.form.material_issue_return_no,
        return_date: this.form.return_date,
        return_type: this.form.return_type,
        return_from_site: this.form.return_from_site,
        gate_pass_no: this.form.gate_pass_no,
        manual_slip_no: this.form.manual_slip_no,
        in_our_carrying_vehicle: this.form.in_our_carrying_vehicle,
        in_our_carrying_vehicle_text: this.form.in_our_carrying_vehicle_text,

        return_items: this.return_itemsArr,

        remarks: this.form.remarks,
        return_to: this.form.return_to,
        return_from: this.form.return_from,

        attachments: this.form.attachments,
      }

      if(this.form.material_issue){
        req.material_issue = this.form.material_issue
      }
      
      this.procurementApiService.addMaterialIssueReturn(params, req).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getMaterialIssueReturnList.emit();
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

      let l =  0;
      for(let item of this.form.return_items){
        
        let itemObj = {
          id: this.form.return_items[l].id,
          organization: this.localStorageData.organisation_details[0].id,

          item: item.item,
          is_scrap: (item.is_scrap)? true:false,
          quantity: item.quantity,
          weight: item.weight,
          weight_uom: item.weight_unit_issue,
          rate: item.rate,
          amount: item.amount,
          return_from: item.return_from,
          log_book: item.log_book,
          remark: item.remark,
        }
        this.return_itemsArr.push(itemObj)
        l++
      }
      
      let req = {
        organization: this.localStorageData.organisation_details[0].id,
        
        financialyear: this.form.financialyear,
        material_issue_return_no: this.form.material_issue_return_code +'-'+ this.form.material_issue_return_no,
        return_date: this.form.return_date,
        return_type: this.form.return_type,
        return_from_site: this.form.return_from_site,
        gate_pass_no: this.form.gate_pass_no,
        manual_slip_no: this.form.manual_slip_no,
        in_our_carrying_vehicle: this.form.in_our_carrying_vehicle,
        in_our_carrying_vehicle_text: this.form.in_our_carrying_vehicle_text,

        return_items: this.return_itemsArr,

        remarks: this.form.remarks,
        return_to: this.form.return_to,
        return_from: this.form.return_from,

        attachments: this.form.attachments,
      }

      
      this.procurementApiService.updateMaterialIssueReturn(params, req).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getMaterialIssueReturnList.emit();
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
