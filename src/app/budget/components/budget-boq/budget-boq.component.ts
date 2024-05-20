import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-budget-boq',
  templateUrl: './budget-boq.component.html',
  styleUrls: [
    './budget-boq.component.scss',
    '../../../../assets/scss/from-coomon.scss',
  ]
})
export class BudgetBoqComponent implements OnInit, OnChanges{

  @Output() showLMPIcomponent = new EventEmitter<string>();
  localStorageData:any
  TenderNumber:any = ''
  ProjectID:any = ''

  @Input()
  scope!: any;

  @Input()
  selectedID!: any;

  form:any = {
    name: '',
    start_date: '',
    end_date: ''
  };

  disableFrom:any

  constructor(
    private paginationservice: PaginationService,
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {

  }

  onSubmit(): void {
    this.addBoq()
  }

  ngOnInit(): void {
    this.TenderNumber = this.route.snapshot.paramMap.get('tenderid');
    this.ProjectID = this.route.snapshot.paramMap.get('projectid');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if(this.scope == 'edit' || this.scope == 'lmpi' || this.scope == 'amend') {
      if(this.selectedID) {
        this.getPrefieldData()
      }
    }
    if(this.scope == 'lmpi') {
      this.disableFrom = true
    } else {
      this.disableFrom = false
    }
  }

  getPrefieldData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.selectedID);
    this.apiservice.getBOQList(params).subscribe(data => {
      this.form.name = data.name
      this.form.start_date = data.start_date
      this.form.end_date = data.end_date
    })

  }

  addBoq() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.form.organization = this.localStorageData.organisation_details[0].id
    this.form.project = this.ProjectID
    if(this.scope == 'add'|| this.scope == 'amend') {
      if(this.scope == 'amend') {
        params.set('replicate_boq', this.selectedID);
      }
      if(this.scope == 'add') {
        params.set('replicate_tender', this.TenderNumber);
      }
      this.apiservice.addBOQ(params,this.form).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.showLMPIcomponent.emit()
      })
    }
    if(this.scope == 'edit') {
      params.set('method', 'edit');
      params.set('id', this.selectedID);
      this.apiservice.editBOQ(params,this.form).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.showLMPIcomponent.emit()
      })
    }
    
  }

}
