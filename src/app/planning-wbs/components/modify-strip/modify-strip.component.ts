import { Component, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-modify-strip',
  templateUrl: './modify-strip.component.html',
  styleUrls: ['./modify-strip.component.scss',
    '../../../../assets/scss/from-coomon.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class ModifyStripComponent {

  @Input()
  projectId: any;

  stripForm!: FormGroup;
  localStorageData: any;
  selectedStripSide = 'LHS';
  graphUnitScope: any = 50 // In M
  userData: any
  StripDetails: any = [];
  MainKeyScopesData: any = [];
  dropdownIssueList: any = [];
  dropdownSubIssueList: any = [];

  addLocation: any = {
    Issue: '',
    Subissue: '',
    Startarea: '',
    Endarea: '',
    Date: '',
  }

  constructor(
    private formBuilder: FormBuilder,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonfunction: CommonFunctionService,
    private apiService: APIService,
    private el: ElementRef
  ) {
    this.stripForm = formBuilder.group({
      issue: ['', [Validators.required]],
      subissue: ['', [Validators.required]],
      startarea: ['', [Validators.required]],
      endarea: ['', [Validators.required]],
      date: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getStripDetaails();
    this.typeChange();

    this.MainKeyScopesData.push({
      issue: '',
      subissue: '',
      underarray: [
        {
          startarea: '',
          endarea: '',
          expdate: ''
        }
      ]
    });
  }

  modifyStrip() {
    if (this.stripForm.valid) {


    } else {
      this.markFormGroupTouched(this.stripForm);
    }
  }

  getStripDetaails() {
    if(this.projectId) {
    this.StripDetails = []
    let req = this.commonfunction.getURL({
      'project_id': this.projectId,
      'side': this.selectedStripSide,
      'chainage': parseInt(this.graphUnitScope),
      'organization_id': this.localStorageData.organisation_details[0].id
    })
    this.apiService.getStripDetaails(req).subscribe(data => {
      this.dropdownIssueList = data.results;
    })
  }
  }

  typeChange() {
    if(this.projectId) {
    this.StripDetails = []
    let req = this.commonfunction.getURL({
      'project_id': this.projectId,
      'side': this.selectedStripSide,
      'chainage': parseInt(this.graphUnitScope),
      'organization_id': this.localStorageData.organisation_details[0].id
    })
    this.apiService.getStripDetaails(req).subscribe(data => {
      this.dropdownSubIssueList = data.results[0];
    })
  }
  }

  addKeyScope(mainindex: any) {
    let data = {
      startarea: '',
      endarea: '',
      expdate: ''
    }
    this.MainKeyScopesData[mainindex].underarray.push(data)
  }

  MainaddKeyScope() {
    this.MainKeyScopesData.push({
      issue: '',
      subissue: '',
      underarray: [
        {
          startarea: '',
          endarea: '',
          expdate: ''
        }
      ]
    });
  }

  removeKeyScope(rid: number, mainIndex: any) {
    this.MainKeyScopesData[mainIndex].underarray.splice(rid, 1);
  }

  MainremoveKeyScope(rid: number) {
    this.MainKeyScopesData.splice(rid, 1);
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      "form .ng-invalid"
    );
    
    firstInvalidControl.focus();
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
