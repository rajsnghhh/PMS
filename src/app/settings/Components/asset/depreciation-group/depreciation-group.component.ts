import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
declare var window: any;


@Component({
  selector: 'app-depreciation-group',
  templateUrl: './depreciation-group.component.html',
  styleUrls: ['./depreciation-group.component.scss',
  '../../../../../assets/scss/scrollableTable.scss',
  '../../../../../assets/scss/from-coomon.scss']
})
export class DepreciationGroupComponent implements OnInit{
  
  localStorageData: any;
  depreciationList:any=[];
  pageSize: any = 10;
  page: any = 1;

  selectedId = ''
 

  addUser: any = {
    name:'',
    depr_grp_per: '0',
    organization:''
  }

  constructor(
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private apiservice:APIService
  ){}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getDepreciationList();
  }

  getDepreciationList() {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getDepreciationGroupList(params).subscribe(data => {
      this.depreciationList = data.results;
    })
  }

  onSubmit(){
    this.addUser.organization=this.localStorageData?.organisation_details[0]?.id;
    if (this.selectedId) {
      this.apiservice.editDepretiation(this.addUser,this.selectedId).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.addUser.name='';
        this.addUser.depr_grp_per='0';
        this.selectedId='';
        this.getDepreciationList();
      })
    } else {
     
      this.apiservice.addDepretiation(this.addUser).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.addUser.name='';
        this.addUser.depr_grp_per='0';
        this.getDepreciationList();
      })
    }


  }

  editTaxid(id:any) {
    this.selectedId = id;
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData?.organisation_details[0]?.id);
    params.set('id', this.selectedId);
    this.apiservice.getDepreciationGroupList(params).subscribe(data => {
      this.addUser.name=data.name;
      this.addUser.depr_grp_per=data.depr_grp_per;
    })
  }

  deleteTaxid(id:any){
    this.selectedId = id
  }

  deleteAlertCompany() {
      this.apiservice.deleteDepretiation(this.selectedId).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessDelete, '', {
          timeOut: 2000,
        });
        this.selectedId='';
        this.getDepreciationList()
      })
  }
}
