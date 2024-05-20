import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-edit-material-sub',
  templateUrl: './add-edit-material-sub.component.html',
  styleUrls: [
    './add-edit-material-sub.component.scss',
    '../../../../../../assets/scss/from-coomon.scss'
  ]
})
export class AddEditMaterialSubComponent implements OnInit, OnChanges {

  @Input()
  scope!: any;

  @Input()
  selectedId!: any;

  @Output()
  parentFun = new EventEmitter<string>();
  pruductiontypeCheck:boolean=false;


  itemTypelist:any;
  gstlist:any;
  productionTypeValue:any;
    
  addUser: any = {
    organization:'',
    name: '',
    code: '',
    production_type: '',
    tolerance_level: '',
    purchase_account: '',
    sales_account: '',
    item_type: '',
    gst_tax: '',
    parent: '',
    is_production_type:'',
  }
  accountNameList:any;
  localStorageData: any;
  materialList: any = []

  constructor(
    private apiservice: APIService,
    private procurementAPIService:PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService
  ) {

  }

  onSubmit() {
    this.addUser.organization = this.localStorageData.organisation_details[0].id;
    this.addUser.is_production_type=this.pruductiontypeCheck;
    if (this.addUser.id) {
      let params = new URLSearchParams();
      params.set('id', this.selectedId);
      params.set('method', 'edit')
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.apiservice.editMaterialTypeData(params, this.addUser).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.parentFun.emit();
      })
    } else {
      this.apiservice.addMaterialTypeData(this.addUser).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.parentFun.emit();
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if (this.scope == 'edit' && this.selectedId) {
      this.getEditData()
    }
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getmasterList()
    this.getItemType();
    this.getTaxHeadData();
    this.getProductionType();
    this.getAccount();
  }

  getAccount(){
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getAccountHead(params).subscribe(data => {
    this.accountNameList = data.results;
    });
  }

  getProductionType(){
    this.apiservice.getProductionType().subscribe(data=>{
      this.productionTypeValue=data.results;
    })
  }
  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
      this.gstlist = data.results
    });
  }

  getItemType(){
    this.apiservice.getItemType().subscribe(data=>{
     this.itemTypelist=data.results;
    }) 
   }

  getEditData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.selectedId);

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.addUser.parent = data.parent
      this.addUser.name = data.name
      this.addUser.code = data.code
      this.addUser.id = data.id
      this.addUser.tolerance_level=data.tolerance_level;
      this.addUser.purchase_account=data.purchase_account;
      this.addUser.item_type=data.item_type;
      this.addUser.production_type=data.production_type;
      this.addUser.sales_account=data.sales_account;
      this.addUser.gst_tax=data.gst_tax;
      this.pruductiontypeCheck=data.is_production_type;
      
    })

  }
 

  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialList = data.results
    })
  }

  resetADD(form: NgForm): void {
    this.parentFun.emit();
    form.reset();
  }


  generateKey() {
    if (this.scope == 'add') {
      let code = this.addUser.name.split(' ')
      let codeREs = ''
      for (let i = 0; i < code.length; i++) {
        codeREs += code[i][0].toUpperCase()
      }
      this.addUser.code = codeREs
    }
  }
}
