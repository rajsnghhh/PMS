import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';


@Component({
  selector: 'app-fabrication-add',
  templateUrl: './fabrication-add.component.html',
  styleUrls: ['./fabrication-add.component.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class FabricationAddComponent implements OnInit{

  localStorageData:any;
  siteList:any;
  itemList:any;
  vendorList:any;
  workOrderList:any;
  laborsMasterList:any;
  importData: any;
  uomList: any


  form: any = {
    organization:'',
    voucher_no: '',
    date: '',
    select_template: '',
    batch: '',
    party_bill_no: '',
    bill_date: '',
    number_of_jobs: '',
    site: '',
    fabrication_by: '',
    fabrication_type: '',
    contractor: '',
    work_order: '',
    remark:'',
    fileData:'',
    attachments:[],
    raw_materials: [],
    finish_goods: [],
    labors: [],
  };

  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.form.site=this.localStorageData.site_data.id

    this.getUomList()
    this.viewVendorList();
    this.getSiteList();
    this.getWOList();
    this.getlaborsMasterList();
    this.viewItemList();
    this.form.raw_materials.push({
      "organization": this.localStorageData.organisation_details[0].id,
      "material": '',
      "quantity": '',
      "weight":'',
      "weight_uom":'',
      "l":'',
      "w":'',
      "t":'',
      "d":''
    })
    this.form.finish_goods.push({
      "organization": this.localStorageData.organisation_details[0].id,
      "material": '',
      "quantity": '',
      "weight":'',
      "weight_uom":'',
      "rate":''
    })
    this.form.labors.push({
      "organization": this.localStorageData.organisation_details[0].id,
      "category": '',
      "no_of_duty": '',
      "rate":'',
      "amount":''
    })
  }

  addRawMaterial() {
    this.form.raw_materials.push({
      "organization": this.localStorageData.organisation_details[0].id,
      "material": '',
      "quantity": '',
      "weight":'',
      "weight_uom":'',
      "l":'',
      "w":'',
      "t":'',
      "d":'',
    })
  }
  addFinishGoods() {
    this.form.finish_goods.push({
      "organization": this.localStorageData.organisation_details[0].id,
      "material": '',
      "quantity": '',
      "weight":'',
      "weight_uom":'',
      "rate":''
    })
  }

  addlabors(){
    this.form.labors.push({
      "organization": this.localStorageData.organisation_details[0].id,
      "category": '',
      "no_of_duty": '',
      "rate":'',
      "amount":''
    })
  }

  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }

  changeItem(i:any) {
    let filter =  this.itemList.filter((item: { id: any; }) => item.id == this.form.raw_materials[i].material)
    
    if(filter.length > 0) {
      this.form.raw_materials[i].unit_of_mesurement = filter[0].unit_of_mesurement
    }
  }

  changeFinishItem(i:any) {
    let filter =  this.itemList.filter((item: { id: any; }) => item.id == this.form.finish_goods[i].material)
    
    if(filter.length > 0) {
      this.form.finish_goods[i].unit_of_mesurement = filter[0].unit_of_mesurement
    }
  }

  deleteRawMaterial(index: any) {
    this.form.raw_materials.splice(index, 1);
  }
  deleteFinishGoods(index: any) {
    this.form.finish_goods.splice(index, 1);
  }
  deletelabors(index: any) {
    this.form.labors.splice(index, 1);
  }


  viewItemList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.itemList = data.results;
    })
  }
  getlaborsMasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getLabourMasterList(params).subscribe(data => {
      this.laborsMasterList = data.results;
    })
  }
  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }
  
  getWOList(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getWorkOrderList(params).subscribe(data => {
      this.workOrderList = data.results;
    })
  }

  uploadFile(eve: any) {
    this.form.attachments=[];
    this.importData = eve.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.importData); 
    reader.onload = (event) => { 

      let obj={
        organization:this.localStorageData.organisation_details[0].id,
        file_data:event.target!.result,
        mime_type:eve.target.files[0].type
      }
      this.form.attachments.push(obj);
    }
  }
  

  onSubmit(){
      this.form.organization=this.localStorageData.organisation_details[0].id;
      this.form.financialyear=this.localStorageData.financial_year[0].id;

      this.procurementAPIService.addFabricationWork(this.form).subscribe(data=>{
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.router.navigateByUrl('/pms/store/procurement/fabrication-work/list');
      })
  }
}
