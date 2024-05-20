import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSharingService } from 'src/app/Procurement/modules/purchase/data-sharing.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import * as Global from 'src/app/global';
@Component({
  selector: 'app-raw-material-sale-bottom-card',
  templateUrl: './raw-material-sale-bottom-card.component.html',
  styleUrls: ['./raw-material-sale-bottom-card.component.scss'],
})
export class RawMaterialSaleBottomCardComponent {
  Global = Global;
  formGroup!: FormGroup;
  form: any = {};
  localStorageData: any;
  vendorList: Array<any> = [];
  siteList: any = [];

  @Output() checkValidation = new EventEmitter<any>();
  @Output() parrentAction = new EventEmitter<any>();
  @Input() checkValidData: boolean = false;
  @Input() add_type: any = null;
  @Input() rawMaterialSaleData: any = null;
  @Input() scope: any = null;
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private dataService: DataSharingService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  getFormGroup() {
    return this.formGroup;
  }

  ngOnInit() {
    this.localStorageData = JSON.parse(
      this.datasharedservice.getLocalData('userDATA')
    );
    this.formGroup = this.fb.group({
      remarks: [null, Validators.compose([])],
      narration: [null, Validators.compose([])],
      jurisdiction: [null, Validators.compose([])],
      attachments: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.checkValidData) {
      this.onSubmit();
    }
    if (this.rawMaterialSaleData) {
      this.formGroup.patchValue({
        remarks: this.rawMaterialSaleData?.remarks ?? null,
        narration: this.rawMaterialSaleData?.narration ?? null,
        jurisdiction: this.rawMaterialSaleData?.jurisdiction ?? null,
      });
    }
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    // this.formGroup.value.grn_top_Valid = true
    // JSON.stringify(this.formGroup.value)
    // this.parrentAction.emit(JSON.stringify(this.formGroup.value))
    this.checkValidation.emit(this.formGroup.valid);
    if (this.formGroup.valid) {
      this.parrentAction.emit(this.formGroup.value);
    }
  }

  get attachments() {
    return this.formGroup.get('attachments') as FormArray;
  }
  handleUpload(event: any) {
    this.attachments.clear();

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let replacestring = 'data:' + file.type + ';base64,';
        let data = reader.result?.toString().replace(replacestring, '');
        this.formGroup.value.attachments.push({
          file_data: data,
          mime_type: file.type,
          organization: this.localStorageData.organisation_details[0].id,
        });
      };
    }
  }
}
