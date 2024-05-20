import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-update-expense-master',
  templateUrl: './add-update-expense-master.component.html',
  styleUrls: [
    './add-update-expense-master.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddUpdateExpenseMasterComponent {
  masterlist:any = []
  itemGroupList:any = []
  list :any = []
  selectedItem :any = []
  itemSubGroupList:any = []
  materialGroupList:any = []
  materialTypeList: any = [];

  addUpdateBrandForm!: FormGroup;
  localStorageData: any;
  addUpdateButton: string = 'ADD';

  accountNameList: any;
  taxHeads:any;

  @Input() onEditBrandData: any;
  @Input() onEditAccess: any;

  @Output("getBrandList") getBrandList: EventEmitter<any> = new EventEmitter();
  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();

  // @ViewChild('closeButton') closeButton!: ElementRef;

  addBrandTemplate: any = {
    name: '',
    account: '',
    tax_head:'',
    percentage: '',
    amount: '',
  }

  constructor(
    private formBuilder: FormBuilder,
    private procurementApiService: PROCUREMENTAPIService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    
    this.getAccount()
    this.getTaxHeadData()

    // this.getMaterialType();

    // this.getmasterList()
    // this.callAddUpdateBrandForm()

    if (this.onEditBrandData) {
      this.addUpdateButton = 'UPDATE'
    } else {
      this.addUpdateButton = 'ADD'
    }
  }

  getAccount() {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementApiService.getAccountHead(params).subscribe(data => {
      this.accountNameList = data.results;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.onEditBrandData){
      
      this.addBrandTemplate.name = this.onEditBrandData.name
      this.addBrandTemplate.account = this.onEditBrandData.account
      this.addBrandTemplate.percentage = this.onEditBrandData.percentage
      this.addBrandTemplate.amount = this.onEditBrandData.amount
      this.addBrandTemplate.tax_head = this.onEditBrandData.tax_head

    }
    
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  getMaterialType(){
    let params = new URLSearchParams();
    params.set('all', 'true');

    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialTypeList = data.results; 
      this.list = this.list_to_tree(data.results)

      this.itemGroupList = this.materialTypeList.filter((materialType: any, )=>{
        return materialType.parent == null
      })
      this.itemSubGroupList = this.materialTypeList.filter((materialType: any, )=>{
        return materialType.parent != null
      })
    })

    
  }

  list_to_tree(list: any) {
    const comments = list
    const nest: any = (items: any[], id = null, link = 'parent') =>
      items
        .filter((item: { [x: string]: null; }) => item[link] === id)
        .map((item: { id: null | undefined; }) => ({ ...item, children: nest(items, item.id) }));
 
    return nest(comments)
  }

  addUpdateExpense() {
    if (!this.onEditBrandData) {

      let req = {
        organization: this.localStorageData.organisation_details[0].id,

        name: this.addBrandTemplate.name,
        account: this.addBrandTemplate.account,
        percentage: this.addBrandTemplate.percentage,
        amount: this.addBrandTemplate.amount,
        tax_head: this.addBrandTemplate.tax_head,
      }
      
      this.apiservice.addExpense(req).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.getBrandList.emit();
          
          this.closeModal.emit();

          // this.addBrandTemplate.brandCode = ''
          // this.addBrandTemplate.type = ''
          // this.addBrandTemplate.brandManufacturerName = ''
          // this.selectedItem = []

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
      let req = {
        organization: this.localStorageData.organisation_details[0].id,

        name: this.addBrandTemplate.name,
        account: this.addBrandTemplate.account,
        percentage: this.addBrandTemplate.percentage,
        amount: this.addBrandTemplate.amount,
        tax_head: this.addBrandTemplate.tax_head,
      }
      
      this.apiservice.editExpense(req, this.localStorageData.organisation_details[0].id, this.onEditBrandData.id).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.getBrandList.emit();
          
          this.closeModal.emit();

          // this.addBrandTemplate.brandCode = ''
          // this.addBrandTemplate.type = ''
          // this.addBrandTemplate.brandManufacturerName = ''
          // this.selectedItem = []

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

  
  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    params.set('tax_type', 'gst_tax')

    this.procurementApiService.getTaxHeadDetails(params).subscribe(data => {
      this.taxHeads = data.results
    });
  }


  isFieldValid(form: FormGroup, field: string) {
    // return !form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched);
  }

  displayFieldCss(form: FormGroup, field: string) {
    // return {
    //   'is-invalid': form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched),
    //   'is-valid': form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched)
    // };
  }
}
