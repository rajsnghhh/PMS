import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/Shared/Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-edit-planning-structure',
  templateUrl: './edit-planning-structure.component.html',
  styleUrls: ['./edit-planning-structure.component.scss',
  '../../../../../assets/scss/from-coomon.scss',
  '../../../../../assets/scss/scrollableTable.scss'
]
})
export class EditPlanningStructureComponent {

  editcompanyForm!: FormGroup;
  localStorageData:any;
  editCompanyId:any;
  
  importData: any;
  filen = "Choose file";

  addStructure:any = {
    structurecode: '',
    structurename : '',
    structureimg : '',
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice:DataSharedService,
    private toastrService: ToastrService,
    private el: ElementRef
  ) {
    this.editcompanyForm = formBuilder.group({
      structcode: ['', Validators.required],
      structname: ['', Validators.required],
      structimg: ['']
    })
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  addnewCompany() {

  }

  close() {
    // this.parentFun.emit();
  }
  
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      "form .ng-invalid"
    );
    
    firstInvalidControl.focus();
  }

  uploadFile(event: any) {
    this.importData = event.target.files[0];
    this.filen = event.target.files[0].name;
    this.toastrService.success("Image Added Successfully", '', {
      timeOut: 2000,
    });
    var reader = new FileReader();
    reader.readAsDataURL(this.importData); 
    reader.onload = (event) => { 
      this.addStructure.imagefile = event.target!.result;
    }
  }
  imageDelete(){
    this.addStructure.imagefile ='';
    this.importData='';
  }
  onuserSubmit() {
    
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
