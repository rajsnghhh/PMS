import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-search-tender',
  templateUrl: './search-tender.component.html',
  styleUrls: ['./search-tender.component.scss',
    '../../../../assets/scss/from-coomon.scss',
    '../../../../assets/scss/survey-common.scss']
})

export class SearchTenderComponent implements OnInit {

  @Output()
  parentFun = new EventEmitter<string>();

  filterForm!: FormGroup;
  localStorageData: any;
  MultidropdownSettings: any = {}
  TenderType: any;
  TenderId: any;
  TenderJVList: any = [];
  tenderdata: any = [];
  floatTender: any = {
    Tenderage: '',
  }

  constructor(
    private apiservice: APIService,
    private formBuilder: FormBuilder,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private paginationservice: PaginationService
  ) {
    this.filterForm = formBuilder.group({
      tenderage: [''],
    })
  }

  ngOnInit(): void {
    this.dropDownSettings();
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    if (JSON.parse(this.datasharedservice.getLocalData('JV_Standalone')) == 'jv') {
      this.TenderType = JSON.parse(this.datasharedservice.getLocalData('EvaluationJVTender'));
      this.TenderId = JSON.parse(this.datasharedservice.getLocalData('JVTenderId'));
    } else {
      this.TenderType = JSON.parse(this.datasharedservice.getLocalData('EvaluationTender'));
    }
    this.getTenderJVList();
  }

  getTenderJVList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');
    params.set('search_for', 'tender');

    if (this.datasharedservice.getLocalData('JV_Standalone') == 'jv') {
      params.set('jv_id', this.TenderId);
    }
    this.apiservice.getTenderSearchForm(params).subscribe(data => {
      this.TenderJVList = data.results;
      // for (let i = 0; i < this.TenderJVList.length; i++) {
      //   this.TenderJVList[i].form_input_type = 'text';
      // }
    })
  }

  dropDownSettings() {
    this.MultidropdownSettings = {
      singleSelection: false,
      disabled: false,
      text: "",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    }
  }

  tenderFilter() {

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('search', 'true');
    params.set('list', 'true');
    if(this.TenderType){
      params.set('tender_type', this.TenderType);
    }
    if(this.TenderId){
      params.set('jv_id', this.TenderId);
    }

    for (let data of this.TenderJVList) {
      if (this.tenderdata[data.id]) {
        if (Array.isArray(this.tenderdata[data.id])) {
          let multiselectArray: any[] = [];
          for (let j = 0; j < this.tenderdata[data.id].length; j++) {
            multiselectArray.push(this.tenderdata[data.id][j].id);
          }
          params.set(data.id, JSON.stringify(multiselectArray));
        } else {
          params.set(data.id, this.tenderdata[data.id]);
        }
      }
    }

    this.apiservice.getTenderList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      let tenderData:any = {
        tenderList : data,
        setedQuery : Object.fromEntries(new URLSearchParams(params)),
      }
      delete tenderData.setedQuery.list
      this.parentFun.emit(JSON.stringify(tenderData));
    })
  }


  resetFilter() {
    this.tenderdata = {}
    let tenderData:any = {
      tenderList : [],
      setedQuery : '',
    }
    this.parentFun.emit(JSON.stringify(tenderData));
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
