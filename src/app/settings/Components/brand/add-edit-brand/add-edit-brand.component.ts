import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-edit-brand',
  templateUrl: './add-edit-brand.component.html',
  styleUrls: [
    './add-edit-brand.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddEditBrandComponent implements OnInit, OnChanges{

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

  @Input() onEditBrandData: any;
  @Input() onEditAccess: any;

  @Output("getBrandList") getBrandList: EventEmitter<any> = new EventEmitter();
  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();

  // @ViewChild('closeButton') closeButton!: ElementRef;

  addBrandTemplate: any = {
    material_type: [],
    brandCode: '',
    type: '',
    brandManufacturerName: '',
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    
    this.getMaterialType();

    // this.getmasterList()
    // this.callAddUpdateBrandForm()

    if (this.onEditBrandData) {
      this.addUpdateButton = 'UPDATE'
    } else {
      this.addUpdateButton = 'ADD'
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.onEditBrandData){

      for(let matType of this.onEditBrandData.material_type){
        this.selectedItem['dropDown'+ matType] = true
      }
      this.addBrandTemplate.brandCode = this.onEditBrandData.code
      this.addBrandTemplate.type = this.onEditBrandData.type
      this.addBrandTemplate.brandManufacturerName = this.onEditBrandData.name
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

  addUpdateBrand() {
    if (!this.onEditBrandData) {
      let material_type: any = []
      
      let i = 0;
      for (const [key, value] of Object.entries(this.selectedItem)) {
        if(value == true){
          material_type.push(key.split("dropDown")[1]);
        }
      }

      let RACK_ADD_OBJ = {
        organization: this.localStorageData.organisation_details[0].id,
        code: this.addBrandTemplate.brandCode,
        type: this.addBrandTemplate.type,
        name: this.addBrandTemplate.brandManufacturerName,
        material_type: material_type,
      }
      
      this.apiservice.addBrand(RACK_ADD_OBJ).subscribe((data: any) => {
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
          this.addBrandTemplate.brandCode = ''
          this.addBrandTemplate.type = ''
          this.addBrandTemplate.brandManufacturerName = ''
          this.selectedItem = []

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
      let material_type: any = []
      
      let i = 0;
      for (const [key, value] of Object.entries(this.selectedItem)) {
        if(value == true){
          material_type.push(key.split("dropDown")[1]);
        }
      }

      let RACK_UPDATE_OBJ = {
        organization: this.localStorageData.organisation_details[0].id,
        code: this.addBrandTemplate.brandCode,
        type: this.addBrandTemplate.type,
        name: this.addBrandTemplate.brandManufacturerName,
        material_type: material_type,
      }
      
      this.apiservice.editBrand(RACK_UPDATE_OBJ, this.onEditBrandData.organization, this.onEditBrandData.id).subscribe((data: any) => {
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
          this.addBrandTemplate.brandCode = ''
          this.addBrandTemplate.type = ''
          this.addBrandTemplate.brandManufacturerName = ''
          this.selectedItem = []

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
    // return !form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched);
  }

  displayFieldCss(form: FormGroup, field: string) {
    // return {
    //   'is-invalid': form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched),
    //   'is-valid': form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched)
    // };
  }

}
