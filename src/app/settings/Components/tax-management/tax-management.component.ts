import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { Router } from '@angular/router';

declare var window: any;

@Component({
  selector: 'app-tax-management',
  templateUrl: './tax-management.component.html',
  styleUrls: ['./tax-management.component.scss',
  '../../../../assets/scss/scrollableTable.scss',
  '../../../../assets/scss/from-coomon.scss'
]

})
export class TaxManagementComponent implements OnInit {

  localStorageData: any;
  taxHeads:any=[];
  pageSize: any = 10;
  page: any = 1;

  scope = ''
  selectedId = ''
  offcanvasedit :any
  offcanvasAdd :any
  deleteModal : any

  addUser: any = {
    name: '',
    taxtype: '',
    applicabletype:''
  }

  constructor(
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private router:Router

  ){}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getTaxHeadData();
    this.offcanvasedit = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightEditRole')
    );
    this.offcanvasAdd = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabeladdrole')
    );
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteUser')
    );
  }

  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
    this.taxHeads = data.results;
    });
  }

  onSearch() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tax_type', this.addUser.taxtype);
    params.set('name', this.addUser.name);
    params.set('applicable_type', this.addUser.applicabletype);

    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
    this.taxHeads = data.results;
    });
  }

  closeCanvas() {
    this.scope = ''
    this.offcanvasedit.hide();
    this.offcanvasAdd.hide();
    this.deleteModal.hide();
    this.getTaxHeadData();
    
  }

  editTaxid(id:any,taxType:any) {
    this.scope = 'edit'
    this.selectedId = id

    if(taxType=="gst_tax"){
      this.offcanvasedit.hide();
      this.router.navigate(['/pms/settings/update-gst/'+ this.selectedId])
    }
  }

  deleteTaxid(id:any){
    this.selectedId = id
  }

  addnew() {
    this.scope = 'add'
  }

  deleteAlertCompany() {
    let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('id', this.selectedId);
      params.set('method','delete')
      this.procurementAPIService.deleteTax(params).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessDelete, '', {
          timeOut: 2000,
        });
        this.closeCanvas()
      })
  }

}
