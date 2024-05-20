import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-vender-merge',
  templateUrl: './vender-merge.component.html',
  styleUrls: ['./vender-merge.component.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class VenderMergeComponent implements OnInit {

  venderForm!: UntypedFormGroup;

  localStorageData: any;
  vendorList: any = [];
  vendorListFrom:any=[];
  allVendorData:any=[];
  fromUnitId:any=[];

  constructor(private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private fb: UntypedFormBuilder,
    private toastrService:ToastrService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewVendorList();
    this.createVenderForm();
  }

  createVenderForm() {
    this.venderForm = this.fb.group({
      filerVendor: [''],
      venderId: ['', [Validators.required]],
      venderFromId:['', [Validators.required]]
    });
  }

  venderInput(event:any){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('name', event.target.value);
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }

  venderInputFrom(event:any){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('name', event.target.value);
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorListFrom = data.results;
    })
  }
  venderSelect(){
    this.vendorList=this.allVendorData;
    this.vendorListFrom=this.allVendorData;
    if(this.venderForm.value.venderFromId){
      this.vendorList = this.vendorList.filter((x:any)=>(x.id != this.venderForm.value.venderFromId));
    }
    if(this.venderForm.value.venderId){
      this.vendorListFrom = this.vendorListFrom.filter((x:any)=>(x.id != this.venderForm.value.venderId));
    }
  }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
      this.vendorListFrom=data.results;
      this.allVendorData=data.results;
    })
  }

  mergeVender() {

    this.fromUnitId=[];
    this.fromUnitId.push(this.venderForm.value.venderFromId)

    let param={
      "type": "vendor",
      "from_id_list":this.fromUnitId,
      "to_id": this.venderForm.value.venderId
    }
    this.apiservice.mergeUOMData(param).subscribe(data=>{
      this.toastrService.success('Account Merged Successfully', '', {
        timeOut: 2000,
      });
      this.venderForm.reset();
    })

  }

}
