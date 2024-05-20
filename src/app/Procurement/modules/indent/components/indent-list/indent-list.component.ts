import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-indent-list',
  templateUrl: './indent-list.component.html',
  styleUrls: [
    '../../../../../../assets/scss/micro-view-table.scss',
    './indent-list.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/tableactionButton.scss'
  ]
})
export class IndentListComponent implements OnChanges, OnInit {
  environment = environment;
  docUrl = '';
  localStorageData: any;
  indentListView:boolean=true;
  is_Indent_Checker = false;
  is_Indent_Approver = false;
  procurementIndentRequest: Array<any> = []

  @Input() indentAdvancedSearchFormValue: any;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    public router: Router,
    private activeroute: ActivatedRoute,
    private commonfunction: CommonFunctionService,
    private paginationservice: PaginationService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProcurementIndentRequest();
    this.getUserDetails()
    this.docUrl = environment.API_URL + 'media/'

    if(this.router.url=='/pms/purchase/procurement/indent/through'){
      this.indentListView = false;
    }
  }

  ngOnChanges() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if (this.indentAdvancedSearchFormValue) {
      this.getProcurementIndentRequest()
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
    params.set('indent__financialyear', this.localStorageData.financial_year[0].id);
    if (this.indentAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.indentAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    this.apiservice.getProcurementIndentRequest(params).subscribe(data => {
      this.procurementIndentRequest = data.results.Data;
      if (this.procurementIndentRequest.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
  }

  getProcurementIndentRequest() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('indent__financialyear', this.localStorageData.financial_year[0].id);

    if (this.indentAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.indentAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    this.apiservice.getProcurementIndentRequest(params).subscribe(data => {
      this.procurementIndentRequest = data.results.Data;
      this.paginationservice.setTotalItemData(data.count); 
      if (this.procurementIndentRequest.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
  }


  poByIDs() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/create-through-indent/' + this.indentCheckboxIds.join(',')])
  }

  pogstByIDs() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/create-through-indent/gst/' + this.indentCheckboxIds.join(',')])
  }
  
  indentCheckboxIds :any = []
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
  
  indentCheckboxIdsForGrn :any = []
  onIndentCheckboxForGrnChange(event: any, itemId: number) {
    if (event.target.checked) {
      this.indentCheckboxIdsForGrn.push(itemId);
    } else {
      const index = this.indentCheckboxIdsForGrn.indexOf(itemId);
      if (index !== -1) {
        this.indentCheckboxIdsForGrn.splice(index, 1);
      }
    }

  }

  createGRN() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/grn/create/indent/'+ this.indentCheckboxIdsForGrn.join(',')])
  }

  createGRNgst() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/grn/create/indent-gst/'+ this.indentCheckboxIdsForGrn.join(',')])
  }

  viewByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/request/view/' + id)
  }
  
  printByID(id: any) {
    this.commonfunction.openOnNewTab('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/request/print/' + id)
  }

  updateByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/request/modify/' + id)
  }

  checkByID(id:any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/request/checkStatus/' + id)
  }

  approveRejectByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/request/updateStatus/' + id)
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
      if (rolesArray.includes('procurement-indent-approver')) {
        this.is_Indent_Approver = true;
      }
      if (rolesArray.includes('procurement-indent-checker')) {
        this.is_Indent_Checker = true;
      }
    })
  }

}
