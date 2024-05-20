import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { AddEditCommunicationComponent } from './add-edit-communication/add-edit-communication.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cummunication',
  templateUrl: './cummunication.component.html',
  styleUrls: ['./cummunication.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class CummunicationComponent {

  @ViewChild('closeButton') closeButton!: ElementRef;

  @ViewChild('clearValue') clearValue!: AddEditCommunicationComponent;

  localStorageData: any;
  docUrl: any;
  deleteCommunicationDetails: any;
  onEditBrandData: any;
  projectId: any
  communicationTypeList: any;
  communicationList: Array<any> = [];
  addUpdateCommunication: string = 'Add Communication';

  form: any = {
    from_name: '',
    to_name: '',
    date__gte: '',
    date__lte: '',
    name_of_document: '',
    communication_type: ''
  };


  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.docUrl = environment.API_URL1 + ''

    this.activatedRoute.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
    });

    this.getCommunicationList()
    this.getCommunicationType()
  }

  closeModal() {
    this.closeButton.nativeElement.click()
    this.addUpdateCommunication = 'Add Communication'
    this.getCommunicationList();
    this.clearValue.clearForm();
  }

  getCommunicationType() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getCommunicationType(params).subscribe(data => {
      this.communicationTypeList = data.results;
    })
  }

  getCommunicationList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.projectId);

    this.apiservice.getCommunication(params).subscribe(data => {
      //this.paginationservice.setTotalItemData(data.count);
      this.communicationList = data.results;
    })
  }


  onSearch() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('project', this.projectId);
    if (this.form) {
      for (const [key, value] of Object.entries(this.form)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    this.apiservice.getCommunication(params).subscribe(data => {
      //this.paginationservice.setTotalItemData(data.count);
      this.communicationList = data.results;
    })
  }
  queryParaMap: any = {}
  setparam:any={}

  changeShort(shortCol: any) {
    if (this.setparam.field_name && this.setparam.field_name == shortCol) {
      this.queryParaMap.order_by = "-"+shortCol
    } else {
      this.queryParaMap.order_by = shortCol
    }
    this.setparam.field_name = shortCol;

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('project', this.projectId);
    if (this.queryParaMap) {
      for (const [key, value] of Object.entries(this.queryParaMap)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    this.apiservice.getCommunication(params).subscribe(data => {
      //this.paginationservice.setTotalItemData(data.count);
      this.communicationList = data.results;
    })
  }


  deleteAlertBrand(communication: any) {
    this.deleteCommunicationDetails = communication;
  }

  deleteBrand() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('method', 'delete');
    params.set('id', this.deleteCommunicationDetails.id);
    this.apiservice.updateCommunication('', params).subscribe((res: any) => {

      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      this.closeModal();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }


  editCommunication(communication: any, access: any) {
    this.onEditBrandData = communication;
    if (access == 'edit') {
      this.addUpdateCommunication = 'Edit Communication'
    }
  }
}
