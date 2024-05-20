import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';


@Component({
  selector: 'app-party-bill-addedit',
  templateUrl: './party-bill-addedit.component.html',
  styleUrls: ['./party-bill-addedit.component.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class PartyBillAddeditComponent implements OnInit{

  form: any = {
    organization:'',
    sr_no:'',
    received_date:(new Date()).toISOString().substring(0,10),
    manual_slip_number: '',
    bill_date:(new Date()).toISOString().substring(0,10),
    vendor: '',
    bill_type: '',
    amount: '',
    fileData: '',
    site: '',
    forward_to_user: '',
    nature_of_work: '',
    file_no: '',
    attachments:[]
  };

  localStorageData:any;
  perticularEditID:any;
  siteList:any;
  userList:any;
  vendorList:any;
  importData: any;

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
    this.form.site = this.localStorageData?.site_data.id;  
    this.perticularEditID = this.activeroute.snapshot.paramMap.get('editId')

    this.viewVendorList();
    this.getSiteList();   
    this.getUserList(); 

    if(this.perticularEditID){
      this.preFieldData(this.perticularEditID);
    }
  }

  preFieldData(Id:any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('site', this.localStorageData.site_data.id);
    params.set('id',Id);

    this.procurementAPIService.getBillReceive(params).subscribe(data => {
      this.form.sr_no=data.sr_no;
      this.form.received_date=data.received_date;
      this.form.manual_slip_number=data.manual_slip_number;
      this.form.bill_date=data.bill_date;
      this.form.vendor=data.vendor;
      this.form.bill_type=data.bill_type;
      this.form.amount=data.amount;
      this.form.site = this.localStorageData?.site_data.id;  
      this.form.forward_to_user=data.forward_to_user;
      this.form.nature_of_work=data.nature_of_work;
      this.form.file_no=data.file_no;
    })
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
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

    if(this.perticularEditID){
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('method','edit');
      params.set('id', this.perticularEditID);

      this.procurementAPIService.updateBillReceive(params,this.form).subscribe(data=>{
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.router.navigateByUrl('/pms/store/procurement/party-bill-receive/list');
      })
    }else{
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.form.financialyear=this.localStorageData.financial_year[0].id
  
      this.procurementAPIService.addBillReceive(params,this.form).subscribe(data=>{
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.router.navigateByUrl('/pms/store/procurement/party-bill-receive/list');
      })
    }

}

}
