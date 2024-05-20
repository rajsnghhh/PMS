import { Component,EventEmitter,Output,OnInit,Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-project-head',
  templateUrl: './project-head.component.html',
  styleUrls: ['./project-head.component.scss',
  '../../../../assets/scss/from-coomon.scss',
]
})
export class ProjectHeadComponent implements OnInit,OnChanges {

  projectForm!: FormGroup;
  @Output()
  parentFun = new EventEmitter<string>();

  @Input() projectId: any;


  planningData:any = {
    planningHead : '',
  }
  userlist:any;
  localStorageData:any;

  constructor(
    private apiservice: APIService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private datasharedservice: DataSharedService,
  ) {
    this.projectForm = formBuilder.group({
      user: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userlist = data;
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.projectId?.is_project_head_selected==true){
       this.planningData.planningHead=this.projectId.project_head;
    }
  }

  addPlanning(){
    if (this.projectForm.valid) {
      let params={
        'project_id':this.projectId.id,
        'user_id':this.planningData.planningHead
      }

      this.apiservice.addProjectHead(params).subscribe(data=>{
        if (this.projectId?.is_project_head_selected==true) {
          this.toastrService.success(Success_Messages.SuccessUpdate, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(Success_Messages.SuccessAdd, '', {
            timeOut: 2000,
          });
        }
        this.parentFun.emit();
      }, err => {
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
      })

    }
    else {
      this.markFormGroupTouched(this.projectForm);
    }

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
