import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-mr-list',
  templateUrl: './mr-list.component.html',
  styleUrls: [
    '../../../../../../assets/scss/micro-view-table.scss',
    './mr-list.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/tableactionButton.scss'
  ]
})
export class MrListComponent {
  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;
  localStorageData: any;
  environment = environment;
  docUrl = '';
  isMR_Approver = false;
  isMR_Checker = false;
  procurementMaterialRequest: Array<any> = []
  statusCheckboxIds: number[] = []
  indentCheckboxIds: number[] = [];
  issueCheckboxIds: number[] = [];


  @Input() mrAdvancedSearchFormValue: any;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    public router: Router,
    private toastrService: ToastrService,
    private activeroute: ActivatedRoute,
    private commonfunction: CommonFunctionService,
    private paginationservice: PaginationService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProcurementMaterialRequest();
    this.getUserDetails()
    this.docUrl = environment.API_URL + 'media/'
  }

  ngOnChanges() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if (this.mrAdvancedSearchFormValue) {
      this.getProcurementMaterialRequest();
    }
  }

  pageSize:any=10;
  page:any=1;
  paginationValue:any;

  getPaginate(){
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize=this.paginationValue.pagesizeValue;
    this.page=this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    if (this.mrAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.mrAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }

    this.apiservice.getProcurementMaterialRequest(params).subscribe(data => {
      this.procurementMaterialRequest = data.results.Data;
      
      if (this.procurementMaterialRequest.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
    
  }

  getProcurementMaterialRequest() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    if (this.mrAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.mrAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }

    this.apiservice.getProcurementMaterialRequest(params).subscribe(data => {
      this.procurementMaterialRequest = data.results.Data;
      this.paginationservice.setTotalItemData(data.count); 
      if (this.procurementMaterialRequest.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
  }

  updateByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/mr/modify/' + id)
  }

  printByID(id: any) {
    this.commonfunction.openOnNewTab('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/mr/print/' + id)
  }

  viewByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/mr/view/' + id)
  }

  onIndentCheckboxChange(event: any, itemId: number) {
    if (event.target.checked) {
      this.indentCheckboxIds.push(itemId);
    } else {
      const index = this.indentCheckboxIds.indexOf(itemId);
      if (index !== -1) {
        this.indentCheckboxIds.splice(index, 1);
      }
    }

  }

  onStatusCheckboxChange(event: any, itemId: number) {
    if (event.target.checked) {
      this.statusCheckboxIds.push(itemId);
    } else {
      const index = this.statusCheckboxIds.indexOf(itemId);
      if (index !== -1) {
        this.statusCheckboxIds.splice(index, 1);
      }
    }

  }

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

  indentByIDs() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/request/' + this.indentCheckboxIds.join(',')])
  }

  // createGRN(mrID:any){
  //   this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/grn/create/mr/'+ mrID])
  // }
  // Removed after discussion with management

  issueByIDs() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/material-issue/request/' + this.issueCheckboxIds.join(',')])
  }

  updateStatusByIDs() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/mr/updateStatus/' + this.statusCheckboxIds.join(',')])
  }


  checkByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/mr/checkStatus/' + id)
  }

  approveRejectByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/mr/updateStatus/' + id)
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }


  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0].user_permissions
      if (rolesArray.includes('procurement-mr-approver')) {
        this.isMR_Approver = true
      }
      if (rolesArray.includes('procurement-mr-checker')) {
        this.isMR_Checker = true
      }
    })
  }
  
  
  next() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
 
  previous() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }
}
