import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

declare var window: any;

@Component({
  selector: 'app-issue-advanced-search',
  templateUrl: './issue-advanced-search.component.html',
  styleUrls: ['./issue-advanced-search.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss']
})
export class IssueAdvancedSearchComponent {
  issueAdvancedSearchForm!: FormGroup;
  localStorageData: any;
  importCanvas : any;
  storeList: Array<any> = [];
  issueAdvancedSearchFormValue:any = {};

  constructor(
    private fb: FormBuilder,
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private router : Router,
    private activeroute : ActivatedRoute
  ) { }


  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.initIssueAdvancedSearchForm();
    this.getStoreList();
    this.importCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightImport')
    );
    
    if(this.router.url=='/pms/store/procurement/material-issue/import'){
      this.importCanvas.show()
    }

  }

  reloadData(){
    this.initIssueAdvancedSearchForm();
    this.getStoreList();
    this.importCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightImport')
    );
  }

  adddNew() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/material-issue/request')
  }

  adddNewMulti() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/material-issue/multi-request')
  }

  bulkTransfer() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/material-issue/bulk-transfer')
  }

  acknowledgement() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/material-issue/ackowledgement')
  }

  acknowledgementApproval() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/material-issue/ackowledgement-approval')
  }



  importIssue() {
    this.importCanvas.show()
  }

  
  RouteToRoll(route: any) {
    if(route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

  initIssueAdvancedSearchForm() {
    this.issueAdvancedSearchForm = this.fb.group({
      issue_type: [''],
      issue_transfer_from: [''],
      gate_pass_number: [''],
      issue_location: [''],
      transporter: [''],
      store: [''],
      carrying_vehicle_number: [''],
      issue_date: [''],
      manual_slip_number: [''],
      rst_number: [''],
      lr_date: [''],
      lr_number: [''],
      carrying_driver: [''],
      loaded_via: ['']
    });

    this.issueAdvancedSearchFormValue.material_issue__project = this.localStorageData.project_data.id
    this.issueAdvancedSearchFormValue.material_issue__site = this.localStorageData.site_data.id

  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('site__project', this.selectedMRDetails.project);
    // params.set('site', this.selectedMRDetails.site);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })

  }


  onSubmit() {

    let formdata = this.issueAdvancedSearchForm.value

    let requestObj = {
      organization_id: this.localStorageData.organisation_details[0].id,
      material_issue__issue_type: formdata.issue_type,
      material_issue__issue_transfer_from: formdata.issue_transfer_from,
      material_issue__gate_pass_number__icontains: formdata.gate_pass_number,
      material_issue__issue_location__icontains: formdata.issue_location,
      material_issue__transporter: formdata.transporter,
      material_issue__store: formdata.store,
      material_issue__carrying_vehicle_number: formdata.carrying_vehicle_number,
      created_at__gt: formdata.issue_date,
      material_issue__manual_slip_number__icontains: formdata.manual_slip_number,
      material_issue__rst_number__icontains: formdata.rst_number,
      material_issue__lr_date: formdata.lr_date,
      material_issue__lr_number: formdata.lr_number,
      material_issue__carrying_driver: formdata.loaded_via,
      material_issue__loaded_via: formdata.loaded_via
    }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }


    this.issueAdvancedSearchFormValue = searchdata
  }
}

