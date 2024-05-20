import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-material-issue-top-card',
  templateUrl: './material-issue-top-card.component.html',
  styleUrls: ['./material-issue-top-card.component.scss']
})
export class MaterialIssueTopCardComponent implements OnChanges {
  localStorageData: any;

  @Input() preFieldData: any;
  @Input() scope: any;
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  @Output() parrentAction = new EventEmitter<any>();
  disabledEdit = false
  projectList : any = []
  form: any = {}

  storeList: Array<any> = [];

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService

  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.form.issue_number = this.preFieldData?.request_code
    this.form.issue_type = this.preFieldData?.issue_type
    this.form.issue_transfer_from = this.preFieldData?.issue_transfer_from
    this.form.issue_location = this.preFieldData?.issue_location
    this.form.transporter = this.preFieldData?.transporter
    this.form.carrying_vehicle_number = this.preFieldData?.carrying_vehicle_number
    this.form.date = this.preFieldData?.date
    this.form.time = this.preFieldData?.time.substr(0, 5)
    this.form.manual_slip_number = this.preFieldData?.manual_slip_number
    this.form.rst_number = this.preFieldData?.rst_number
    this.form.lr_date = this.preFieldData?.lr_date
    this.form.lr_number = this.preFieldData?.lr_number
    this.form.carrying_driver = this.preFieldData?.carrying_driver
    this.form.loaded_via = this.preFieldData?.loaded_via
    this.form.gate_pass_number = this.preFieldData?.gate_pass_number
    this.form.store = this.preFieldData?.store
    
    if (this.scope == 'view') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
  }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getStoreList();
    this.getProjectList()
    this.form = {
      issue_top_Valid: false,
      issue_type: '',
      issue_transfer_from: '',
      issue_location: '',
      transporter: '',
      carrying_vehicle_number: '',
      gate_pass_number: '',
      date: this.setCurrentDate(),
      time: this.setCurrentTime(),
      manual_slip_number: '',
      rst_number: '',
      lr_date: '',
      lr_number: '',
      carrying_driver: '',
      loaded_via: '',
      store: ''
    };

    this.form.project = this.localStorageData.project_data.id
  }


  
  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');

    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results
    });
  }


  setCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd
  }

  setCurrentTime(): string {
    const now = new Date();
    // Format the time as "HH:mm" (24-hour format)
    const hours = this.padZero(now.getHours());
    const minutes = this.padZero(now.getMinutes());
    return `${hours}:${minutes}`;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })

  }


  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() {
    this.form.issue_top_Valid = true
    JSON.stringify(this.form, null, 2)
    this.parrentAction.emit(JSON.stringify(this.form, null, 2))
  }

}
