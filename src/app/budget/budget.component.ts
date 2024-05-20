import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationService } from '../Shared/Services/pagination.service';
import { DataSharedService } from '../Shared/Services/data-shared.service';
import { APIService } from '../Shared/Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Success_Messages } from '../Shared/Config/config.const';
declare var window: any;

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: [
    './budget.component.scss',
    '../../assets/scss/survey-common.scss',
    '../../assets/scss/from-coomon.scss',
    '../../assets/scss/scrollableTable.scss'
  ]
})


export class BudgetComponent implements OnChanges, OnInit {

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;


  localStorageData: any;
  budgetList: any = []
  budgetHistoryList: any = []
  TenderNumber: any
  selectedID: any = ''
  offcanvasedit: any
  offcanvasAdd: any
  offcanvaslmpi: any
  offcanvasammend: any
  offcanvasViewBudget: any
  disableModifyBoq = true
  viewDewtails: any = false
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paginationservice: PaginationService,
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private toastrService: ToastrService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {

    this.offcanvasedit = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightEditRole')
    );
    this.offcanvasAdd = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabeladdrole')
    );

    this.offcanvaslmpi = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabellmpi')
    );

    this.offcanvasammend = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabelAmend')
    );

    this.offcanvasViewBudget = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabelViewBudget')
    );

    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.TenderNumber = this.route.snapshot.paramMap.get('tenderid');
    this.getBOQLIST()
  }

  changeNav(nav: string, formtype: any, button_name: string, index: any) {

  }



  editbyID(id: any) {
    this.selectedID = id

  }

  deleteByID(id: any) {
    this.selectedID = id
  }

  viewDetailsByID(id: any) {
    this.selectedID = id
    this.offcanvasViewBudget.show()
    this.viewDewtails = true
  }

  closeViewDetails() {
    this.viewDewtails = false
  }

  linkwithLMPI(id: any, status: any) {
    this.selectedID = id
    if (status == 'pending') {
      this.disableModifyBoq = false
    } else {
      this.disableModifyBoq = true
    }

    this.router.navigate(['/pms/budget/boq/'+id]).then(() => {
      window.location.reload();
    });
    
    // this.offcanvaslmpi.show()
  }

  AmendbyID(id: any) {
    this.selectedID = id
    this.offcanvasammend.show()
  }

  deleteAlert() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('method', 'delete');
    params.set('id', this.selectedID);

    this.apiservice.editBOQ(params, {}).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getBOQLIST()
    })

  }


  // addBOQ(query:any,req: any): Observable<any> {
  //   const url = API_CONFIG.BOQ_PMS + query.toString();
  //   return this.HTTP.post(url, req);
  // }

  // editBOQ(query:any,req: any): Observable<any> {
  //   const url = API_CONFIG.BOQ_PMS + query.toString();
  //   return this.HTTP.put(url, req);
  // }

  // getBOQList(param: any): Observable<any> {
  //   const url = API_CONFIG.BOQ_PMS + param.toString();
  //   return this.HTTP.get(url);
  // }

  getBOQLIST() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');

    this.apiservice.getBOQList(params).subscribe(data => {
      if (data.results && data.results.length > 0) {
        const [firstItem, ...restItems] = data.results;

        // Separate arrays
        this.budgetList = [firstItem];
        this.budgetHistoryList = restItems;
      }
    });
  }

  closeCanvas() {
    this.getBOQLIST()
    this.offcanvasAdd.hide();
    this.offcanvasedit.hide();
    this.offcanvasammend.hide();
  }

}
