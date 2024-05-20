import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-update-rack-master',
  templateUrl: './add-update-rack-master.component.html',
  styleUrls: [
    './add-update-rack-master.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddUpdateRackMasterComponent implements OnInit{
  addUpdateRackForm!: FormGroup;
  localStorageData: any;
  addUpdateButton: string = 'ADD';

  @Input() onEditRackData: any;
  @Input() onEditAccess: any;

  @Output("getRackMasterList") getRackMasterList: EventEmitter<any> = new EventEmitter();
  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();

  // @ViewChild('closeButton') closeButton!: ElementRef;

  addRackTemplate: any = {
    RackName: '',
    RackShortName: '',
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
    
    this.callAddUpdateRackForm()

    if (this.onEditRackData) {
      this.addUpdateButton = 'UPDATE'
    } else {
      this.addUpdateButton = 'ADD'
    }
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  callAddUpdateRackForm() {
    this.addUpdateRackForm = this.formBuilder.group({
      RackName: [this.onEditRackData ? this.onEditRackData.section_name : '', Validators.required],
      RackShortName: [this.onEditRackData ? this.onEditRackData.short_name : '', Validators.required],
      
    })

    if (this.onEditRackData) {
      this.addRackTemplate.RackName = this.onEditRackData.section_name      
      this.addRackTemplate.RackShortName = this.onEditRackData.short_name      
    }

  }

  addUpdateRackMaster() {
    if (this.addUpdateRackForm.valid) {
      if (!this.onEditRackData) {
        let RACK_ADD_OBJ = {
          organization: this.localStorageData.organisation_details[0].id,
          section_name: this.addUpdateRackForm.value.RackName,
          short_name: this.addUpdateRackForm.value.RackShortName,
        }

        this.apiservice.addRacMaster(RACK_ADD_OBJ).subscribe((data: any) => {
          if (data.status == 400) {
            this.toastrService.error(data.msg, '', {
              timeOut: 2000,
            });
          } else {
            this.toastrService.success(data.msg, '', {
              timeOut: 2000,
            });

            this.closeModal.emit();
            this.getRackMasterList.emit();
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
        let RACK_UPDATE_OBJ = {
          organization: this.localStorageData.organisation_details[0].id,
          section_name: this.addUpdateRackForm.value.RackName,
          short_name: this.addUpdateRackForm.value.RackShortName,
        }

        this.apiservice.editRackMaster(RACK_UPDATE_OBJ, this.onEditRackData.organization, this.onEditRackData.id).subscribe((data: any) => {
          if (data.status == 400) {
            this.toastrService.error(data.msg, '', {
              timeOut: 2000,
            });
          } else {
            this.toastrService.success(data.msg, '', {
              timeOut: 2000,
            });

            this.closeModal.emit();
            this.getRackMasterList.emit();
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

    } else {
      this.toastrService.error('Enter the fields', '', {
        timeOut: 2000,
      });

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
