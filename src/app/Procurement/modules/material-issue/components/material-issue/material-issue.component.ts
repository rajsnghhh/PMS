import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { MaterialIssueTopCardComponent } from '../material-issue-top-card/material-issue-top-card.component';
import { FormTableBelowMaterialIssueComponent } from '../form-table-below-material-issue/form-table-below-material-issue.component';
import { FormDataBelowMaterialIssueComponent } from '../form-data-below-material-issue/form-data-below-material-issue.component';
import { ToastrService } from 'ngx-toastr';
import { Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-material-issue',
  templateUrl: './material-issue.component.html',
  styleUrls: ['./material-issue.component.scss']
})
export class MaterialIssueComponent implements OnInit {

  localStorageData: any
  mrListIds: any
  selectedMRDetails: any = []
  scope = ''
  preFieldData: any;

  private isAddMRProcurementCalled = false;

  @ViewChild(MaterialIssueTopCardComponent) MaterialIssueTopCardComponent: any;
  @ViewChild(FormTableBelowMaterialIssueComponent) FormTableBelowMaterialIssueComponent: any;
  @ViewChild(FormDataBelowMaterialIssueComponent) FormDataBelowMaterialIssueComponent: any;

  constructor(
    private procurementApiService: PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router,
    private activeroute : ActivatedRoute

  ) {

  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.activatedRoute.paramMap.subscribe(params => {
      const mrIds = params.get('mrIds');
      this.mrListIds = mrIds ? mrIds.split(':').join(',') : '';
    });


    if (this.router.url.indexOf('/procurement/material-issue/request/view') > -1) {
      this.scope = 'view'
      this.getPrefieldData()
    } else {
      this.scope = 'add'
      if(this.mrListIds) {
        this.initMRListData();
      } else {
        this.scope = 'add-new'
      }
    }
  }


  initMRListData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.mrListIds)
    this.procurementApiService.getProcurementMaterialRequestItems(params).subscribe(data => {
      this.selectedMRDetails = data.results
      this.selectedMRDetails.forEach((obj:any)=>obj.quantity_unit=obj.sanctioned_quantity)
      // this.genratePrefieldData()
    });
  }


  getPrefieldData() {
    let params = new URLSearchParams();
    let issueID = JSON.parse(this.activatedRoute.snapshot.paramMap.get('issueId') || '{}')

    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', issueID);
    this.procurementApiService.getMaterialIssueDetails(params).subscribe(data => {
      this.preFieldData = data
    });
  }

  createMaterialIssue() {
    this.MaterialIssueTopCardComponent.save()
    this.FormTableBelowMaterialIssueComponent.save()
    this.FormDataBelowMaterialIssueComponent.save()
  }


  // genratePrefieldData() {
  //   let prefieldData: any = {}
  //   prefieldData.organization = this.localStorageData.organisation_details[0].id
  //   prefieldData.issue_items = []
  //   prefieldData.store = this.selectedMRDetails[0].store_id
  //   prefieldData.site = this.selectedMRDetails[0].site_id
  //   prefieldData.project = this.selectedMRDetails[0].project_id
  //   prefieldData.date = this.setDate()
  //   prefieldData.time = this.setCurrentTime()
  //   prefieldData.issue_type = ''
  //   prefieldData.issue_transfer_from = ''
  //   prefieldData.manual_slip_number = ''
  //   prefieldData.rst_number = ''
  //   prefieldData.issue_location = ''
  //   prefieldData.transporter = ''
  //   prefieldData.carrying_driver = ''
  //   prefieldData.loaded_via = ''
  //   prefieldData.carrying_vehicle_number = ''
  //   prefieldData.gate_pass_number = ''
  //   for (let i = 0; i < this.selectedMRDetails.length; i++) {
  //     let itemdata = {
  //       "organization": this.selectedMRDetails[i].organization_id,
  //       "material_request_item": this.selectedMRDetails[i].id,
  //       "requested_material": this.selectedMRDetails[i].requested_material_id,
  //       "quantity": this.selectedMRDetails[i].quantity_unit,
  //       "requested_for": this.selectedMRDetails[i].requested_for,
  //       "rate": "",
  //       "charge_type": "",
  //       "shift": "",
  //       "log_book": "",
  //       "notes": [
  //         {
  //           "note_title": "Technical",
  //           "note_details": ""
  //         },
  //         {
  //           "note_title": "Warranty",
  //           "note_details": ""
  //         },
  //         {
  //           "note_title": "Other",
  //           "note_details": ""
  //         }
  //       ]
  //     }
  //     prefieldData.issue_items.push(itemdata)
  //   }
  //   prefieldData.remarks = "",
  //     prefieldData.attachment = [],
  //     this.preFieldData = prefieldData
  // }

  setDate() {
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
    const hours = this.padZero(now.getHours());
    const minutes = this.padZero(now.getMinutes());
    return `${hours}:${minutes}`;
  }
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  createData: any = {
    requested_items : [],
    issue_items: []
  }

  appendData(req: any) {
    req = JSON.parse(req)
    if(req.requested_items) {
      this.createData.issue_items = req.requested_items;
    }
    this.createData = { ...this.createData, ...req };
    this.createData?.issue_items?.forEach((x: any) => {
      x.organization = this.localStorageData.organisation_details[0].id
    })

    if (
      this.createData.material_form_table &&
      this.createData.issue_form_data &&
      this.createData.issue_top_Valid &&
      this.createData.issue_items.length > 0 &&
      !this.isAddMRProcurementCalled
    ) {
      this.createData.organization = this.localStorageData.organisation_details[0].id;
      this.isAddMRProcurementCalled = true;
      this.addIssue();
    }


  }

  addIssue() {
    if (this.scope == 'add' || this.scope == 'add-new') {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('material_issue__project', this.localStorageData?.project_data?.id)
      params.set('material_issue__site', this.localStorageData?.site_data?.id);
      params.set('material_issue__financialyear', this.localStorageData.financial_year[0].id);

      this.createData.financialyear=this.localStorageData.financial_year[0].id;

      this.procurementApiService.addProcurementMRIssue(this.createData).subscribe(
        (data) => {
          this.toastrService.success(Success_Messages.SuccessAdd, '', { timeOut: 2000 });
          this.backtolist();
        },
        (error) => {
          this.isAddMRProcurementCalled = false;
        }
      );
    }

    // if (this.scope == 'update') {
    //   let params = new URLSearchParams();
    //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
    //   params.set('method', 'edit');
    //   params.set('id', this.prefieldData.id);
    //   this.createData.project = this.prefieldData.project

    //   this.procurementApiService.updateProcurementIndent(params, this.createData).subscribe(data => {
    //     this.toastrService.success(Success_Messages.SuccessUpdate, '', {
    //       timeOut: 2000,
    //     });
    //     this.backtolistIndent()
    //   },
    //     (error) => {
    //       this.isAddMRProcurementCalled = false;
    //     });

    // }
  }

  backtolist() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/material-issue')
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}
