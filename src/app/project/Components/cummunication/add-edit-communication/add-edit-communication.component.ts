import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-edit-communication',
  templateUrl: './add-edit-communication.component.html',
  styleUrls: ['./add-edit-communication.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddEditCommunicationComponent implements OnInit, OnChanges {
  localStorageData: any;
  departmentlist: any;
  importData: any;
  communicationTypeList: any;
  projectList: Array<any> = [];
  projectId: any

  @Input() onEditBrandData: any;


  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();


  form: any = {
    organization: '',
    name: '',
    from_name: '',
    to_name: '',
    date: '',
    name_of_document: '',
    file_name: '',
    mime_type: '',
    fileData: '',
    file_data: '',
    project: '',
    communication_type: ''
  };
  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.activatedRoute.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
    });
    this.form.project = this.projectId;

    if (!this.form.from_name) {
      this.form.from_name = this.localStorageData.first_name + ' ' + this.localStorageData.last_name
    }



    this.getCommunicationType();
    this.getProjectList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.onEditBrandData) {
      this.form = this.onEditBrandData;
    }
  }

  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');
    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results;
    })
  }


  getCommunicationType() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getCommunicationType(params).subscribe(data => {
      this.communicationTypeList = data.results;
    })
  }

  uploadFile(eve: any) {
    this.importData = eve.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.importData);
    reader.onload = (event: any) => {
      this.form.file_data = event.target!.result.replace(/^.+?;base64,/, ''),
        this.form.mime_type = eve.target.files[0].type
      this.form.file_name = this.importData.name
    }
  }

  onSubmit() {
    this.form.organization = this.localStorageData.organisation_details[0].id;

    if (this.form.id) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('method', 'edit');
      params.set('id', this.form.id);

      delete this.form.attachment;

      this.apiservice.updateCommunication(this.form, params).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.closeModal.emit();
        this.form = {}
        this.form.project = this.projectId;
        this.form.from_name = this.localStorageData.first_name + ' ' + this.localStorageData.last_name
      })
    } else {
      this.apiservice.addCommunication(this.form).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.closeModal.emit();
        this.form = {}
        this.form.project = this.projectId;
        this.form.from_name = this.localStorageData.first_name + ' ' + this.localStorageData.last_name
      })
    }
  }

  clearForm() {
    this.form = {}
    this.form.project = this.projectId;
    this.form.from_name = this.localStorageData.first_name + ' ' + this.localStorageData.last_name
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: { markAsTouched: () => void; controls: any[]; }) => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach((c: FormGroup) => this.markFormGroupTouched(c));
      }
    });
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
