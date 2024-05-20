import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import * as Global from 'src/app/global';
import { DataSharingService } from '../../../purchase/data-sharing.service';
import { LocalStorageService } from 'src/app/Shared/Services/local-storage.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-way-bill-linking',
  templateUrl: './way-bill-linking.component.html',
  styleUrls: ['./way-bill-linking.component.scss'],
})
export class WayBillLinkingComponent {
  Global = Global;
  formGroup!: FormGroup;
  form: any = {};
  vendorList: Array<any> = [];
  siteList: any = [];
  wayBillList: any = [];
  all_items: any = [];
  vendorAndBillSelected: boolean = false;
  searchedDone: boolean = false;
  selected: boolean[] = [];
  selected_items: any = [];
  @Output() checkValidation = new EventEmitter<any>();
  @Output() parrentAction = new EventEmitter<any>();
  @Input() checkValidData: boolean = false;
  @Input() wayBillData: any = null;
  @Input() scope: any = null;
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private dataService: DataSharingService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      vendor: [null, Validators.compose([Validators.required])],
      way_bill_no: [null, Validators.compose([Validators.required])],
      issued_in: [null, Validators.compose([])],
      date__gte: [null, Validators.compose([])],
      date__lte: [null, Validators.compose([])],
      // way_bill_form__isnull: [true,Validators.compose([])],
      // exclude__way_bill_form: [null,Validators.compose([])],
      pending: [null, Validators.compose([])],
    });
    this.viewVendorList();
    this.fetchWayBillList();
  }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe((data) => {
      this.vendorList = data.results;
    });
  }
  fetchWayBillList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('all', 'true');
    this.procurementAPIService.getWayBill(params).subscribe((data) => {
      this.wayBillList = data.results;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.checkValidData) {
      this.onSubmit();
    }
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    this.checkValidation.emit(this.formGroup.valid);
    if (this.formGroup.valid) {
      this.parrentAction.emit(this.formGroup.value);
    }
  }
  onVendorWayBillSelect() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      if (this.vendorAndBillSelected) {
        let filter: any = {
          vendor: this.formGroup.value.vendor,
        };
        if (this.formGroup.value.date__gte) {
          filter.date__gte = this.formGroup.value.date__gte;
        }
        if (this.formGroup.value.date__lte) {
          filter.date__lte = this.formGroup.value.date__lte;
        }
        if (this.formGroup.value.pending === 'way_bill_form__isnull') {
          filter.way_bill_form__isnull = true;
        } else {
          filter.exclude__way_bill_form = this.formGroup.value.way_bill_no;
        }
        if (this.formGroup.value.issued_in == 'grn') {
          this.getGRNList(filter);
          this.searchedDone = true;
        } else if (this.formGroup.value.issued_in == 'purchase') {
          this.getPurchaseList(filter);
          this.searchedDone = true;
        } else {
          this.searchedDone = false;
        }
      } else {
        this.vendorAndBillSelected = true;
        Global.applyValidatorsAndUpdate(this.formGroup, [
          'pending',
          'issued_in',
        ]);
      }
    }
  }
  backtolist() {
    if (this.vendorAndBillSelected) {
      Global.removeValidatorsAndUpdate(this.formGroup, [
        'pending',
        'issued_in',
      ]);
      Global.resetForm(this.formGroup);
      this.vendorAndBillSelected = false;
      this.searchedDone = false;
    } else {
      this.RouteToRoll(
        '/pms/' +
          this.route.snapshot.paramMap.get('procurementScope') +
          '/procurement/way-bill'
      );
    }
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
  getGRNList(filter: any) {
    this.all_items = [];
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());

    for (const [key, value] of Object.entries(filter)) {
      let val = '' + value;
      let ky = '' + key;
      params.set(ky, val);
    }
    this.procurementAPIService.getGRNList(params).subscribe((data) => {
      this.all_items = data.results;
    });
  }
  getPurchaseList(filter: any) {
    this.all_items = [];
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());

    for (const [key, value] of Object.entries(filter)) {
      let val = '' + value;
      let ky = '' + key;
      params.set(ky, val);
    }
    this.procurementAPIService
      .getPurchaseListDetails(params)
      .subscribe((data) => {
        this.all_items = data.results;
      });
  }
  getCheckboxValues(event: any, id: string, i: number) {
    this.selected[i] = !this.selected[i];
    const index = this.selected_items.findIndex(
      (item: any) => parseInt(item.id) === parseInt(id)
    );

    if (event.target.checked) {
      // If not in the array, add it
      if (index === -1) {
        this.selected_items.push({
          id: id,
          way_bill_form_id: this.formGroup.value.way_bill_no,
        });
      }
    } else {
      if (index !== -1) {
        this.selected_items.splice(index, 1);
      }
    }
  }
  saveLinking() {
    if (this.selected_items?.length) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorage.organisation_id());
      params.set('type', this.formGroup.value.issued_in);
      this.procurementAPIService
        .updateProcurementSatatus(params, this.selected_items)
        .subscribe((data) => {
          this.toastrService.success(Success_Messages.SuccessUpdate, '', {
            timeOut: 2000,
          });
          this.RouteToRoll(
            '/pms/' +
              this.route.snapshot.paramMap.get('procurementScope') +
              '/procurement/way-bill'
          );
        });
    } else {
      this.toastrService.error('Select Item to Linking.');
    }
  }
}
