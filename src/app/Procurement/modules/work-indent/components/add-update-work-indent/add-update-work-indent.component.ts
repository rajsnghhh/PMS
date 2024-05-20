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
  selector: 'app-add-update-work-indent',
  templateUrl: './add-update-work-indent.component.html',
  styleUrls: [
    './add-update-work-indent.component.scss',
    '../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class AddUpdateWorkIndentComponent {
  localStorageData:any
  itemArray:any = []
  itemObj:any = {}

  groupTaskList : any = []
  userList: any = []

  // requested_items: any[] = [];
  siteList: Array<any> = [];
  sub_contractorList: Array<any> = [];

  @Output() parrentAction = new EventEmitter<any>();

  @Output("getworkIndentList") getworkIndentList: EventEmitter<any> = new EventEmitter();
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

  // prefieldData : any = {}

  @Input() prefieldData: any;
  @Input() onEditAccess: any;
  @Input() scope: any;
  @Input() isMR_Approver: any;

  form:any = {
    workIndent_table : false,

    workOrder_code : '',
    workOrder_no : '',
    date : '',
    location : '',
    work_desc : '',
    work_type : '',
    financialyear:'',

    requested_items : [],
    attachments : [],

    employee_name : '',
    jurisdiction : '',
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
    
    // this.getStoreList()

    this.getSiteList()
    this.getGroupTaskList()
    this.getUserList()

    // this.getmasterList();
    this.getUomList()
    
    if((this.onEditAccess == 'add')) {
      this.addItem();
    }
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
    })
  }

  getGroupTaskList() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.procurementApiService.getProcurementGroupTaskDetails(req).subscribe(data => {
      this.groupTaskList = data.results;  
      
    })
  }

  // getStoreList() {
  //   let params = new URLSearchParams();
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   // params.set('site__project', this.form.project);
  //   // params.set('site', this.form.site);
  //   params.set('all', 'true');
  //   this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
  //     this.storeList = data.results;
  //   })
  // }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('project', this.selectedMRDetails.project);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    
    if((this.onEditAccess == 'edit' || this.scope == 'view' || this.scope == 'print'  ) && this.prefieldData?.id) {      
      this.generatePrepopulateData(this.prefieldData)
    }
  }

  generatePrepopulateData(datalist:any) {
    
    this.form.requested_items = []
    
    this.form.workOrder_code = datalist.wo_no.split('-')[0]
    this.form.workOrder_no = datalist.wo_no.split('-')[1]
    this.form.date = datalist.date
    this.form.location = datalist.site
    this.form.work_desc = datalist.work_desc
    this.form.work_type = datalist.work_type    
    
    for(let i=0;i<datalist.work_details.length;i++) {
      if(datalist.work_details[i].is_deleted == false) {
        let temp = {
          id : datalist.work_details[i].id,
          work: datalist.work_details[i].work,
          work_detail: datalist.work_details[i].work_detail,
          quantity: datalist.work_details[i].quantity,
          uom: datalist.work_details[i].uom_details[0].id,
        }
        this.form.requested_items.push(temp)
      }
      
    }
    this.form.employee_name = datalist.employee_name    
    this.form.jurisdiction = datalist.jurisdiction    
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

  addItem() {
    this.form.requested_items.push({
      "work": "",
      "work_detail": "",
      "quantity": "",
      "uom": "",
    })
  }
  
  delete(index:any) {
    this.form.requested_items.splice(index, 1);
  }

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

  addUpdateWorkIndent() { 
    if (!this.prefieldData) {
      let params = new URLSearchParams();

      for(let item of this.form.requested_items){
        let itemObj = {
          organization: this.localStorageData.organisation_details[0].id,
          work: item.work,
          work_detail: item.work_detail,
          quantity: item.quantity,
          uom: item.uom,
        }
        this.itemArray.push(itemObj)

      }
      
      let reqBody = {
        organization: this.localStorageData.organisation_details[0].id,
        financialyear:this.localStorageData.financial_year[0].id,
        wo_no: this.form.workOrder_code +'-'+ this.form.workOrder_no,
        date: this.form.date,
        site: this.localStorageData?.site_data?.id,
        work_desc: this.form.work_desc,
        work_type: this.form.work_type,
        
        work_details: this.itemArray,

        employee_name: this.form.employee_name,
        attachments: this.form.attachments,
        jurisdiction: this.form.jurisdiction,
        remark: this.form.remark,

      }

      this.procurementApiService.addWorkIndent(params, reqBody).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getworkIndentList.emit();
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

      for(let item of this.form.requested_items){
        let itemObj :any = {
          organization: this.localStorageData.organisation_details[0].id,
          work: item.work,
          work_detail: item.work_detail,
          quantity: item.quantity,
          uom: item.uom,
        }
        if(item.id) {
          itemObj.id = item.id
        }
        this.itemArray.push(itemObj)

      }
      
      let reqBody = {
        organization: this.localStorageData.organisation_details[0].id,
        wo_no: this.form.workOrder_code +'-'+ this.form.workOrder_no,
        date: this.form.date,
        site: this.localStorageData?.site_data?.id,
        work_desc: this.form.work_desc,
        work_type: this.form.work_type,
        
        work_details: this.itemArray,
        financialyear:this.localStorageData.financial_year[0].id,
        employee_name: this.form.employee_name,
        attachments: this.form.attachments,
        jurisdiction: this.form.jurisdiction,
        remark: this.form.remark,

      }

      this.procurementApiService.updateWorkIndent(params, reqBody).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getworkIndentList.emit();
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
