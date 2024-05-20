import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
declare var window: any;


@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss',
  '../../../../assets/scss/scrollableTable.scss',
  '../../../../assets/scss/from-coomon.scss']
})
export class ModelComponent implements OnInit{

  localStorageData: any;
  modelList:any=[];
  pageSize: any = 10;
  page: any = 1;

  scope = ''
  selectedId = ''
  offcanvasedit :any
  offcanvasAdd :any
  deleteModal : any
  brandList:any

  addUser: any = {
    brand_type: '',
    brand: '',
    brand_code:''
  }

  constructor(
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private apiservice:APIService
  ){}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getModelData();
    this.getBrandList();
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

  getBrandList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');
    this.apiservice.getBrandList(params).subscribe(data => {
      this.brandList = data.results;
    })
  }
  getModelData() {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    this.procurementAPIService.getModelDetails(params).subscribe(data => {
    this.modelList = data.results;
    });
  }

  onSearch() {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('brand_type', this.addUser.brand_type);
    params.set('brand', this.addUser.brand);
    params.set('brand__code__icontains', this.addUser.brand_code);

    this.procurementAPIService.getModelDetails(params).subscribe(data => {
    this.modelList = data.results;
    });
  }

  closeCanvas() {
    this.scope = ''
    this.offcanvasedit.hide();
    this.offcanvasAdd.hide();
    this.deleteModal.hide();
    this.getModelData();
    
  }

  editTaxid(id:any) {
    this.scope = 'edit'
    this.selectedId = id
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
      this.procurementAPIService.deleteModel(params).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessDelete, '', {
          timeOut: 2000,
        });
        this.closeCanvas()
      })
  }

}
