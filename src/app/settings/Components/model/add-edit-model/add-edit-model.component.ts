import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';

@Component({
  selector: 'app-add-edit-model',
  templateUrl: './add-edit-model.component.html',
  styleUrls: ['./add-edit-model.component.scss',
  '../../../../../assets/scss/from-coomon.scss'
]
})
export class AddEditModelComponent implements OnInit,OnChanges{

  @Input()
  scope!: any;
  @Input()
  selectedId!: any;

  @Output()
  parentFun = new EventEmitter<string>();


  addUser: any = {
    organization:'',
    name: '',
    code : '',
    brand_type :'',
    brand :'',
    uom:'',
    item_type:'',
    item :'',
    warranty_days :'0',
    warranty_km:'0',
    load_capacity :'0',
    ply_rating :'0',
    total_run :'0',
    casing :'',
    tread_dpth:'',
    size:'0',
    grip:'',
    tread:'',
  }

  localStorageData: any;
  unitList:any;
  matGroupList:any;
  itemList:any;
  brandList:any;

  constructor(
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private apiservice:APIService
  ){}

  ngOnChanges(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if (this.scope == 'edit' && this.selectedId) {
      this.getEditData()
    }
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewUnit();
    this.viewMatGroup();
    this.viewItemList();
    this.getBrandList();
  }

  getBrandList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');
    this.apiservice.getBrandList(params).subscribe(data => {
      this.brandList = data.results;

    })
  }

  viewItemList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.itemList = data.results;
      
    })
  }

  viewMatGroup() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.matGroupList = data.results;
    })
  }
  
  viewUnit() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.unitList = data.results;
    })
  }

  getEditData() {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('id', this.selectedId);

    this.procurementAPIService.getModelDetails(params).subscribe(data => {
      
      this.addUser.casing = data.casing;
      this.addUser.total_run = data.total_run.toString();
      this.addUser.ply_rating=data.ply_rating.toString();
      this.addUser.load_capacity=data.load_capacity.toString();
      this.addUser.warranty_km=data.warranty_km.toString();
      this.addUser.warranty_days=data.warranty_days.toString();
      this.addUser.item=data.item;
      this.addUser.item_type=data.item_type;
      this.addUser.uom=data.uom;
      this.addUser.brand=data.brand;
      this.addUser.brand_type=data.brand_type;
      this.addUser.code=data.code;
      this.addUser.name = data.name;
      this.addUser.tread_dpth=data.tread_dpth;
      this.addUser.size=data.size.toString();
      this.addUser.grip=data.grip;
      this.addUser.tread = data.tread;
    })
  }
 
  onSubmit() {
    this.addUser.organization = this.localStorageData.organisation_details[0].id;

      if (this.selectedId) {
        let params = new URLSearchParams();
        params.set('id', this.selectedId);
        params.set('method', 'edit')
        this.procurementAPIService.editModel(params, this.addUser).subscribe(data => {
          this.toastrService.success(Success_Messages.SuccessUpdate, '', {
            timeOut: 2000,
          });
          this.parentFun.emit();
        })
      } else {
       
        this.procurementAPIService.addModel(this.addUser).subscribe(data => {
          this.toastrService.success(Success_Messages.SuccessAdd, '', {
            timeOut: 2000,
          });
          this.parentFun.emit();
        })
      }


  }

  resetADD(form: NgForm): void {
    this.parentFun.emit();
    form.reset();
  }

}
