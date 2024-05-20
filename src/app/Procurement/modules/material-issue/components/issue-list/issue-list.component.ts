import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: [
    './issue-list.component.scss',
    '../../../../../../assets/scss/micro-view-table.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/tableactionButton.scss'
  ]

})
export class IssueListComponent {

  localStorageData: any;
  procurementIssueList: Array<any> = []
  issueCheckboxIds: number[] = [];

  @Input() issueAdvancedSearchFormValue: any;

  constructor(
    private apiservice: APIService,
    private procurementApiService: PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    public router: Router,
    private activeroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProcurementIssueList();
  }

  ngOnChanges() {
    if (this.issueAdvancedSearchFormValue) {
      this.getProcurementIssueList()
    }
  }

  getProcurementIssueList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);    
    params.set('material_issue__project', this.localStorageData?.project_data?.id)
    params.set('material_issue__site', this.localStorageData?.site_data?.id);
    params.set('material_issue__financialyear', this.localStorageData.financial_year[0].id);

    if (!this.issueAdvancedSearchFormValue) {
      params.set('all', 'true');
    }

    if (this.issueAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.issueAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    this.procurementApiService.getProcurementIssueList(params).subscribe(data => {
      this.procurementIssueList = data.results?.Data;

      
      if (this.procurementIssueList.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
  }

  viewByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/material-issue/request/view/' + id)
  }

  // updateByID(id: any) {
  //   this.RouteToRoll('/pms/procurement/indent/request/modify/' + id)
  // }

  onIssueCheckboxChange(event: any, itemId: number) {
    if (event.target.checked) {
      this.issueCheckboxIds.push(itemId);
    } else {
      const index = this.issueCheckboxIds.indexOf(itemId);
      if (index !== -1) {
        this.issueCheckboxIds.splice(index, 1);
      }
    }
  }

  issueByIDs() {    
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/material-issue-return/' + this.issueCheckboxIds.join(',')])
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

}

