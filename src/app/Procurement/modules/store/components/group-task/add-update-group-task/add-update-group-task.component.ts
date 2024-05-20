import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-update-group-task',
  templateUrl: './add-update-group-task.component.html',
  styleUrls: [
    './add-update-group-task.component.scss',
    '../../../../../../../assets/scss/from-coomon.scss'
  ]
})
export class AddUpdateGroupTaskComponent {
  financialYearData: any = []
  materialList :any = []
  MaterilFilterList :any = []
  localStorageData :any
  materialGroupList : any = []
  MaterilSubGroupList : any = []
  seleceableMaterialList : any = []
  projectSiteList:any = []
  projectStoreList:any = []
  groupTaskList : any = []

  @Input() canvasScope!: any;

  @Input() selectedID!: any;

  @Output() closeCanvas = new EventEmitter<string>();

  constructor(
    private apiservice : APIService,
    private procurementApiService : PROCUREMENTAPIService,
    private datasharedservice : DataSharedService,
    private toastrService: ToastrService,
  ) {}


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    
    this.getGroupTaskList()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if((this.canvasScope == 'view' || this.canvasScope == 'update') && this.selectedID) {
      this.generatePrePopulateData()
    }
  }

  generatePrePopulateData() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    req.set('id', this.selectedID);

    this.procurementApiService.getProcurementGroupTaskDetails(req).subscribe(data => {
      
      this.addPersonalInformation.task_type = data.task_type
      this.addPersonalInformation.boq_no = data.boq_no
      this.addPersonalInformation.group_subgroup_and_task_name = data.group_subgroup_and_task_name
      this.addPersonalInformation.short_name = data.short_name
      this.addPersonalInformation.primary = data.primary
      this.addPersonalInformation.after_this = data.after_this
      this.addPersonalInformation.predeccessor = data.predeccessor
      this.addPersonalInformation.sor_master = data.sor_master
      this.addPersonalInformation.sor_group = data.sor_group
      this.addPersonalInformation.non_billable = data.non_billable
      this.addPersonalInformation.copy_downline = data.copy_downline
      this.addPersonalInformation.weightage = data.weightage
      this.addPersonalInformation.priority = data.priority
      this.addPersonalInformation.build_up_area_qty = data.build_up_area_qty
      this.addPersonalInformation.description = data.description

    })
  }

  getGroupTaskList() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.procurementApiService.getProcurementGroupTaskDetails(req).subscribe(data => {
      this.groupTaskList = data.results;        
    })
  }

  handleUpload(event:any) {
    this.addPersonalInformation.attachments = []
    for(let i=0;i<event.target.files.length;i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let replacestring = 'data:' +file.type +';base64,'
        let data = reader.result?.toString().replace(replacestring, '');
          this.addPersonalInformation.attachments.push(
            {
              'organization':this.localStorageData.organisation_details[0].id,
              'file_data':data,
              'mime_type':file.type
            }
          )
      };
    }
  }

  addPersonalInformation : any = {}
  personalSubmit() {
    let params = new URLSearchParams();
    this.addPersonalInformation["organization"] = this.localStorageData.organisation_details[0].id

    if(this.selectedID) {
      let request = {
        organization: this.localStorageData.organisation_details[0].id,
        task_type: this.addPersonalInformation.task_type,
        boq_no: this.addPersonalInformation.boq_no,
        group_subgroup_and_task_name: this.addPersonalInformation.group_subgroup_and_task_name,
        short_name: this.addPersonalInformation.short_name,
        primary: this.addPersonalInformation.primary,
        after_this: this.addPersonalInformation.after_this,
        predeccessor: this.addPersonalInformation.predeccessor,
        sor_master: this.addPersonalInformation.sor_master,
        sor_group: this.addPersonalInformation.sor_group,
        non_billable: (this.addPersonalInformation.non_billable)? "true":"false",
        copy_downline: (this.addPersonalInformation.copy_downline)? "true":"false",
        weightage: this.addPersonalInformation.weightage,
        priority: this.addPersonalInformation.priority,
        build_up_area_qty: this.addPersonalInformation.build_up_area_qty,
        description: this.addPersonalInformation.description,

        attachments: this.addPersonalInformation.attachments,
      }

      params.set('id', this.selectedID);
      params.set('method', 'edit');
      params.set('organization_id', this.localStorageData.organisation_details[0].id);

      this.procurementApiService.updateGroupTask(params,request).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.CloseComponent()
        this.addPersonalInformation = {}
      })
    } else {
      let request = {
        organization: this.localStorageData.organisation_details[0].id,
        task_type: this.addPersonalInformation.task_type,
        boq_no: this.addPersonalInformation.boq_no,
        group_subgroup_and_task_name: this.addPersonalInformation.group_subgroup_and_task_name,
        short_name: this.addPersonalInformation.short_name,
        primary: this.addPersonalInformation.primary,
        after_this: this.addPersonalInformation.after_this,
        predeccessor: this.addPersonalInformation.predeccessor,
        sor_master: this.addPersonalInformation.sor_master,
        sor_group: this.addPersonalInformation.sor_group,
        non_billable: (this.addPersonalInformation.non_billable)? "true":"false",
        copy_downline: (this.addPersonalInformation.copy_downline)? "true":"false",
        weightage: this.addPersonalInformation.weightage,
        priority: this.addPersonalInformation.priority,
        build_up_area_qty: this.addPersonalInformation.build_up_area_qty,
        description: this.addPersonalInformation.description,

        attachments: this.addPersonalInformation.attachments,
      }

      this.procurementApiService.addGroupTask(params,request).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });

        this.CloseComponent()
        this.addPersonalInformation = {}
      })
    }
  }

  CloseComponent() {
    this.closeCanvas.emit()
  }
}
