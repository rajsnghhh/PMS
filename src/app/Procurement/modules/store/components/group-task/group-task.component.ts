import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
declare var window: any;
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-group-task',
  templateUrl: './group-task.component.html',
  styleUrls: [
    './group-task.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/tableactionButton.scss'
  ]
})
export class GroupTaskComponent {
  itemOpeningAdvancedSearchForm!: FormGroup;
  itemOpeningAdvancedSearchFormValue: any;

  groupTaskList : any = []

  docUrl = ''

  pageSize:any=10;
  page:any=1;
  paginationValue:any;

  addOffCanvas:any
  editCanvas:any
  deleteModal:any

  canvasScope = ''
  selectedID = ''

  localStorageData :any
  materialGroupList : any = []
  projectSiteList:any = []
  MaterilFilterList :any = []
  projectStoreList:any = []



  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.initItemOpeningAdvancedSearchForm()
    this.getGroupTaskList()
    this.getmasterList()
    this.getProjeDependentSiteData()
    this.getItems()
    this.getStoreList()

    this.docUrl = environment.API_URL1+''

    this.editCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('editZone')
    );
    this.addOffCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('addZone')
    );
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteUser')
    );

    if(this.router.url=='/pms/store/group-task/add'){
      this.addOffCanvas.show();
      this.canvasScope = 'add'
    }
  }

  ngOnChanges() {
    if (this.itemOpeningAdvancedSearchFormValue) {
      this.getGroupTaskList()
    }
  }

  constructor(
    private fb : FormBuilder,
    private paginationservice : PaginationService,
    private datasharedservice : DataSharedService,
    private procurementApiSevice : PROCUREMENTAPIService,
    private apiservice : APIService,
    private router:Router,
    private toastrService : ToastrService,
  ) {}

  initItemOpeningAdvancedSearchForm() {
    this.itemOpeningAdvancedSearchForm = this.fb.group({
      site: [''],
      location: [''],
      material: [''],
      group: [''],
      openingType: [''],
    });
  }

  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialGroupList = data.results
      this.materialGroupList = this.materialGroupList.filter((item: any)=>{
        return item.parent != null
      })
      
    })
  }

  getProjeDependentSiteData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.projectSiteList = data.results;
    })
  }
  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.projectStoreList = data.results;
      
    })
  }

  getItems(){
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.MaterilFilterList = data2.results;
    })
  }

  addNew() {
    this.canvasScope = 'add'
  }

  actionByID(id:any,actionName:any) {
    this.selectedID = id
    this.canvasScope = actionName

    if(actionName == 'view' || actionName == 'update') {
      this.editCanvas.show()
    }

    if(actionName == 'delete') {
      this.deleteModal.show()
    }
  }


  refreshPage() {
    this.editCanvas.hide()
    this.addOffCanvas.hide()
    this.getGroupTaskList()
  }


  deleteZoneModel() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    req.set('id', this.selectedID);

    this.deleteNow({})
  }

  deleteNow(data:any) {
    let params = new URLSearchParams();
    params.set('id', this.selectedID);
    params.set('method', 'delete');
    params.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.procurementApiSevice.updateGroupTask(params,data).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      this.getGroupTaskList()
    })
  }


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
    this.procurementApiSevice.getProcurementInventoryDetails(params).subscribe(data => {
      this.groupTaskList = data.results;    
    })

  }
  onSubmit() {
    let formdata = this.itemOpeningAdvancedSearchForm.value

    let requestObj: any = {}

    requestObj = {
      organization_id: this.localStorageData.organisation_details[0].id,

      site: formdata.site,
      store: formdata.location,
      material: formdata.material,
      material__material_type: formdata.group,
      opening_type: formdata.openingType,
    }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }

    this.itemOpeningAdvancedSearchFormValue = searchdata

    this.getGroupTaskList()
  }
  getGroupTaskList() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);

    if (this.itemOpeningAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.itemOpeningAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        req.set(ky, val)
      }
    }

    this.procurementApiSevice.getProcurementGroupTaskDetails(req).subscribe(data => {
      this.groupTaskList = data.results;  
      this.paginationservice.setTotalItemData(data.count); 
      
    })
  }
}
