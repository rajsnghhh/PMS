import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, OnChanges, Output, ViewChild, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-edit-terms-conditions',
  templateUrl: './add-edit-terms-conditions.component.html',
  styleUrls: [
    './add-edit-terms-conditions.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddEditTermsConditionsComponent implements OnInit, OnChanges {
  
  localStorageData:any
  itemArray:any = []
  itemObj:any = {}
  termsAndConditionsList: Array<any> = [];
  previousChilds: Array<any> = [];

  @Output() parrentAction = new EventEmitter<any>();

  @Output("getTermsAndConditionsList") getTermsAndConditionsList: EventEmitter<any> = new EventEmitter();
  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();

  @ViewChild('submitButton', { read: ElementRef })

  submitButton!: ElementRef<HTMLElement>;
  disabledEdit = true
  // prefieldData : any = {}

  @Input() prefieldData: any;
  @Input() onEditAccess: any;
  @Input() scope: any;
  // @Input() isMR_Approver: any;

  form:any = {
    name : '',
    slug : '',
    terms_and_conditions_child : []
  };

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private toastrService: ToastrService
  ) {
    
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    
    this.getList();
  }

  getList(slug: any = false){

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    
    if(this.form.slug){
      params.set('slug', this.form.slug);

      this.form.title = ''
      this.form.description = ''
      this.form.sortingOrder = ''
      this.form.work_category = ''
      this.form.isDefault = false
      this.form.is_billing_format = false
    }
    params.set('all', 'true');
    params.set('page_size', '1000');

    this.apiservice.getTermsAndConditionsList(params).subscribe(data => {
      this.termsAndConditionsList = data.results;
      this.form.terms_and_conditions_child = (data.results[0]?.terms_and_conditions_child)? (data.results[0]?.terms_and_conditions_child):[]
      
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    
    if((this.onEditAccess == 'edit' || this.scope == 'view' || this.scope == 'print'  ) && this.prefieldData?.id) {
      
      this.generatePrepopulateData(this.prefieldData)
    }
    
    
  }

  generatePrepopulateData(datalist:any) {
    let childId = datalist.id;

    let params = new URLSearchParams();
    // params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', childId);

    this.apiservice.getTermsAndConditionsChild(params).subscribe(data => {      
      this.form.slug = data.master_slug[0].slug
      this.form.sortingOrder = data.order_id
      this.form.title = data.key
      this.form.work_category = data.work_category
      this.form.is_default = data.is_default
      this.form.is_billing_format = data.is_billing_format
      this.form.description = data.description
    })
  }

  delete(index:any) {
    this.form.requested_items.splice(index, 1);
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  addUpdateTerms() { 
    if (!this.prefieldData) {
      
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('slug', this.form.slug);
      
      this.apiservice.getTermsAndConditionsList(params).subscribe(data => {
        let termsChildArr = []
        
        // termsChildArr = this.form.terms_and_conditions_child

        this.previousChilds = (data.results[0]?.terms_and_conditions_child)? data.results[0]?.terms_and_conditions_child : [];
        
        // pushing previous datas =================
        for(let termChild of this.previousChilds){
          
          let obj2 = {
            key: termChild.key,
            description: termChild.description,
            order_id: termChild.order_id,
            work_category: termChild.work_category,
            is_default: termChild.is_default,
            is_billing_format: termChild.is_billing_format,
            master: this.termsAndConditionsList[0].id,
          }
          termsChildArr.push(obj2)
        }
        // pushing previous datas =================
  
        // new data to be added ============
        let obj : any = {
          key: this.form.title,
          description: this.form.description,
          order_id: this.form.sortingOrder,
          work_category: this.form.work_category,
          is_default: this.form.is_default,
          is_billing_format: this.form.is_billing_format,
        }
        if(this.termsAndConditionsList[0]?.id){
          obj.master = this.termsAndConditionsList[0]?.id
        }
        termsChildArr.push(obj)
        // new data to be added ============
        
        let TERMS_ADD_OBJ = {
          organization: this.localStorageData.organisation_details[0].id,
          name: this.form.slug.toUpperCase(),
          slug: this.form.slug,
          terms_and_conditions_child: termsChildArr
        }
        
        if(termsChildArr.length > 1){
          // data already exists === hit edit ===
          let editId = this.termsAndConditionsList[0]?.id;
          
          this.apiservice.editExistingTerms(TERMS_ADD_OBJ, this.localStorageData.organisation_details[0].id, editId).subscribe((data: any) => {
            if (data.status == 400) {
              this.toastrService.error(data.msg, '', {
                timeOut: 2000,
              });
            } else {
              this.toastrService.success(data.msg, '', {
                timeOut: 2000,
              });
  
              this.closeModal.emit();
              this.getTermsAndConditionsList.emit();
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
        } else{
          // data does not exist === hit add ===
          
          this.apiservice.addNewTerm(TERMS_ADD_OBJ).subscribe((data: any) => {
            if (data.status == 400) {
              this.toastrService.error(data.msg, '', {
                timeOut: 2000,
              });
            } else {
              this.toastrService.success(data.msg, '', {
                timeOut: 2000,
              });
  
              this.closeModal.emit();
              this.getTermsAndConditionsList.emit();
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
      })
      
    } else {

      // organization: this.localStorageData.organisation_details[0].id,
      let TERMS_UPDATE_OBJ = {
        key: this.form.title,
        description: this.form.description,
        order_id: this.form.sortingOrder,
        work_category: this.form.work_category,
        is_default: this.form.is_default,
        is_billing_format: this.form.is_billing_format,
        master : this.prefieldData.master,
      }
      
      this.apiservice.editTermsChild(TERMS_UPDATE_OBJ, this.prefieldData.organization, this.prefieldData.id).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getTermsAndConditionsList.emit();
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
