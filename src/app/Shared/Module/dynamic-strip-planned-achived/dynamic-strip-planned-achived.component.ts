import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../Services/common-function.service';
import { APIService } from '../../Services/api.service';
import { DataSharedService } from '../../Services/data-shared.service';
import { PmsLoaderService } from '../../Services/pms-loader.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
declare var window: any;

@Component({
  selector: 'app-dynamic-strip-planned-achived',
  templateUrl: './dynamic-strip-planned-achived.component.html',
  styleUrls: [
    '../../../../assets/scss/from-coomon.scss',
    './dynamic-strip-planned-achived.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class DynamicStripPlannedAchivedComponent implements OnChanges, OnInit, AfterViewChecked {
  @Input()
  TenderNumber!: any;
  envvironment = environment
  

  @Input()
  usingIn!: any;

  @Input()
  selectedScope!: any;

  @Input()
  projectId: any;

  @Input()
  DisableModify!: any;

  configData :any = {}
  

  userData: any
  actionoffcanvas: any;
  structurecanvas: any;
  configCanvas: any;
  importData: any;
  filen = "";
  excelIcon: boolean = false;
  activeTab = 'view'

  canvasWidth = 0
  canvasHeight = 0
  stripHeight = 30
  UnitBlockSizeInPX = 20

  appendCanvasComponent = false



  selectedStripSide = 'LHS'
  totalDistance = 0 //In M // Max 10 Km Scope
  graphUnitScope: any = 50 // In M
  unitArray: any = []
  breakchainMark: any = 50;

  BOQ_LIST :any = []
  resolved_files:any = []

  StripDetails: any = [];
  fileList_plan: File[] = [];
  fileList_achive: File[] = [];
  listOfFiles_plan: any = [];
  listOfFiles_achive: any = [];

  stripConfig() {
    if(this.projectId) {
    this.unitArray = []
    this.graphUnitScope = parseInt(this.graphUnitScope)
    this.breakchainMark = this.graphUnitScope * 20
    let req = this.commonfunction.getURL({
      'project_id': this.projectId,
      'chainage': parseInt(this.graphUnitScope),
    })
    this.apiService.getStripChainage(req).subscribe(data => {
      this.unitArray = data.result
      this.getStripDetaails()
    })
  }
  }

  changeinBreakChainge() {
    this.appendCanvasComponent = false
    this.breakchainMark = parseInt(this.breakchainMark)
    this.setSizeofCanvas()
  }

  constructor(
    private commonfunction: CommonFunctionService,
    private apiService: APIService,
    private datasharedservice: DataSharedService,
    private loaderservice: PmsLoaderService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }


  ngOnInit(): void {
    this.appendCanvasComponent = false
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'))
    this.getStripData()
    this.getlatestBOQ()
    this.configCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabelConfig')
    );
    this.actionoffcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabelAction')
    );

    let activeLink = this.router.url.split('/')

    if (activeLink.includes('view')) {
      this.activeTab = 'view'
    } else {
      this.activeTab = 'edit'
    }
  }

  ngAfterViewChecked(): void {
    // this.loaderservice.hide()
  }

  getStripData() {
    this.appendCanvasComponent = false
    let req = this.commonfunction.getURL({
      'project_id': this.projectId
    })
    this.apiService.getStripData(req).subscribe(data => {
      this.totalDistance = data.length_in_kms
      this.graphUnitScope = data.chainage_value
      this.breakchainMark = data.chainage_value
      this.stripConfig()
    })
  }

  updateConfig(data:any) {
    this.configData.wbs = data?.id
    if(data?.wbs_attribute[0].risk_type) {
      this.configData.risk_type = data?.wbs_attribute[0].risk_type
    }
    this.configData.color_code = data?.wbs_attribute[0].color_code
    if(data?.wbs_attribute[0].wbs_id) {
      this.configData.scope = 'edit'
    } else {
      this.configData.scope = 'add'
    }
    this.configCanvas.show()
  }

  configSubmit() {
    let params = new URLSearchParams();
    params.set('wbs', this.configData.wbs);

    if(this.configData.scope == 'add') {
      this.apiService.stripConfigAdd(params, this.configData).subscribe(data => {
        this.CloseComponent()
        this.ngOnInit()
      })
    } else {
      params.set('method', 'edit');
      this.apiService.stripConfigUpdate(params, this.configData).subscribe(data => {
        this.CloseComponent()
        this.ngOnInit()
      })
    }
  }

  CloseComponent() {
    this.configCanvas.hide()
  }

  getStripDetaails() {
    if(this.projectId) {
    this.appendCanvasComponent = false
    this.StripDetails = []
    let req = this.commonfunction.getURL({
      'project_id': this.projectId,
      'side': this.selectedStripSide,
      'chainage': parseInt(this.graphUnitScope),
      'organization_id': this.userData.organisation_details[0].id
    })
    this.apiService.getStripDetaails(req).subscribe(data => {
      let newData = this.list_to_tree(data.results2)
      let filterData = newData.filter((item: { slug: string; category: string; }) => item.slug == "structures" || item.category == "volumetric")
    
      for(let i=0;i<filterData.length;i++) {
        filterData[i].children = this.toArray(filterData[i].children , [] )
      }
      this.StripDetails = filterData

      setTimeout(() => {
        this.changeinBreakChainge()
      }, 0)
    })
  }
  }


  toArray(nodes: any[], arr: any[]) {
    if (!nodes) {
      return [];
    }
    if (!arr) {
      arr = [];
    }
    for (var i = 0; i < nodes.length; i++) {
      arr.push(nodes[i]);
      this.toArray(nodes[i].children, arr);
    }
  return arr;
 }

  list_to_tree(list: any) {
    const comments = list
    const nest: any = (items: any[], id = null, link = 'parent_id') =>
      items
        .filter((item: { [x: string]: null; }) => item[link] === id)
        .map((item: { id: null | undefined; }) => ({ ...item, children: nest(items, item.id) }));
 
    return nest(comments)
  }

  removeSelectedFile(index: any,scope:any) {
    if(scope=='achive') {
      this.listOfFiles_achive.splice(index, 1);
      this.fileList_achive.splice(index, 1);
    }
    if(scope=='plan') {
      this.listOfFiles_plan.splice(index, 1);
      this.fileList_plan.splice(index, 1);
    }
    this.strtipModifyform[scope].splice(index, 1)
  }


  structureAction() {
    this.structurecanvas.show();
  }

  getlatestBOQ() {
    let projectid :any = this.route.snapshot.paramMap.get('projectid')
    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);
    params.set('all', 'true');
    params.set('latest', 'true');
    params.set('project',projectid)

    this.apiService.getBOQList(params).subscribe(data => {
      if (data.results.id) {
        this.generateBoqDataList(data.results.id)
      }
    });
  }

  generateBoqDataList(boqID:any) {
    let params = new URLSearchParams();
    params.set('boq_id', boqID);
    params.set('organization_id', this.userData.organisation_details[0].id);
    params.set('all', 'true');

    this.apiService.getBOQWbsList(params).subscribe(data => {
      this.BOQ_LIST = data.results
    })
  }

  /////////////////////// Start of edit form
  strtipModifyform: any = {};
  selectedBrekUp = ''
  selectedStripID = ''
  onSubmit(): void {
    if (parseInt(this.strtipModifyform.resolved_end_meter) < parseInt(this.strtipModifyform.resolved_start_meter)) {
      this.toastrService.error("Start of point shoud be less than End of poient.", '', {
        timeOut: 2000,
      });
    } else {
      let request:any = {
        'project_id': parseInt(this.projectId),
        'wbs_attribute_id': this.selectedBrekUp,
        'date_planned': this.strtipModifyform.date_planned,
        'criteria_planned': this.strtipModifyform.criteria_planned,
        'affected_start_meter': parseInt(this.strtipModifyform.affected_start_meter),
        'affected_end_meter': parseInt(this.strtipModifyform.affected_end_meter),
        'side': this.selectedStripSide,
        'boq_code': this.strtipModifyform.boqItem,
        'planning_attachments': []
      }

      for(let i=0;i<this.strtipModifyform?.plan?.length;i++) {
        request.planning_attachments.push({
          'order':i,
          'file_data':this.strtipModifyform?.plan[i].file_data,
          'mime_type':this.strtipModifyform?.plan[i].mime_type,
          'organization' : this.userData.organisation_details[0].id
        })
      }

      if(this.actionData.action == 'add') {
        
        this.apiService.addStripData(request).subscribe(data => {
          this.getStripDetaails()
          this.actionoffcanvas.hide()
        })
      } else {
        let params = new URLSearchParams();
        params.set('method', 'edit');
        params.set('id', this.strtipModifyform.id);
        // request.id = this.strtipModifyform.id
        this.apiService.modifyStripData('?'+params,request).subscribe(data => {
          this.getStripDetaails()
          this.actionoffcanvas.hide()
        })
      }
    }
  }

  achivementSubmit() {
    let req:any = {
      'project_id': parseInt(this.projectId),
      'wbs_attribute_id': this.selectedBrekUp,
      'side': this.selectedStripSide,
      'resolved_start_meter': parseInt(this.strtipModifyform.resolved_start_meter),
      'resolved_end_meter': parseInt(this.strtipModifyform.resolved_end_meter),
      'planned_strip_id': this.strtipModifyform.selectedIssue,
      'date_resolved': this.strtipModifyform.date_resolved,
      'resolve_notes': this.strtipModifyform.resolve_notes,
      'planning_attachments': []
    }

    for(let i=0;i<this.strtipModifyform?.achive?.length;i++) {
      req.planning_attachments.push({
        'order':i,
        'file_data':this.strtipModifyform?.achive[i].file_data,
        'mime_type':this.strtipModifyform?.achive[i].mime_type,
        'organization' : this.userData.organisation_details[0].id
      })
    }

    this.apiService.addstripAchive(req).subscribe(data => {
      this.getStripDetaails()
      this.actionoffcanvas.hide()
    })
  }

  affectedFocus: any = []
  stripList:any
  actionData :any 
  resolvedStrip: any = []
  checkAction(req:any) {
    let data:any = JSON.parse(req)
    this.actionData = JSON.parse(req)
    this.resolvedStrip = []
    this.listOfFiles_plan = [];
    this.listOfFiles_achive = [];

    if(this.actionData.action == 'add') {
      let clickArea = data.clickArea
      let focusEnd = clickArea + this.graphUnitScope
      let delay_breakup_data= data.delay_breakup_data
      let delay_breakup_id = delay_breakup_data.id
      this.selectedBrekUp = delay_breakup_id
      this.strtipModifyform.affected_start_meter = clickArea
      this.strtipModifyform.affected_end_meter = focusEnd
    }

    if(this.actionData.action == 'update') {
      let delay_breakup_data= data.delay_breakup_data
      this.selectedBrekUp = delay_breakup_data.id
      this.strtipModifyform.selectedIssue = ''
      this.strtipModifyform.affected_start_mete = ''
      this.strtipModifyform.affected_end_meter = ''
      this.strtipModifyform.affected_start_meter = ''
      this.strtipModifyform.date_resolved = ''
      this.strtipModifyform.resolve_notes = ''
      this.strtipModifyform.boqItem = ''
      this.stripList = data.delay_breakup_data.peacon_strip
      this.resolved_files = data.delay_breakup_data.resolved_files
    }


    this.actionoffcanvas.show()

  }


  getresolvedFiles(resolveID :any) {
    let filter = this.resolved_files.filter((item: { resolved_strip_id: any; }) => item.resolved_strip_id == resolveID)
    return filter
  }

  

  updateSelectedIssue() {

    let filter = this.stripList.filter((item: { id: any; }) => item.id == this.strtipModifyform.selectedIssue)
    this.resolvedStrip = this.actionData.delay_breakup_data.resolved_strip.filter((item: { planned_strip_id: any; }) => item.planned_strip_id == this.strtipModifyform.selectedIssue)
    if(filter.length > 0) {
      this.strtipModifyform.affected_start_meter = filter[0].affected_start_meter
      this.strtipModifyform.affected_end_meter = filter[0].affected_end_meter
      this.strtipModifyform.date_planned = filter[0]?.date_planned
      this.strtipModifyform.criteria_planned = filter[0]?.criteria_planned
      this.strtipModifyform.boqItem = filter[0]?.boq_code,
      this.strtipModifyform.id = filter[0].id    
      this.listOfFiles_plan = this.actionData.delay_breakup_data.files.filter((item: { planned_strip_id: any; }) => item.planned_strip_id == this.strtipModifyform.selectedIssue)
      this.listOfFiles_achive = []
    }
    else {

      this.strtipModifyform.affected_start_meter = ''
      this.strtipModifyform.affected_end_meter = ''
      this.strtipModifyform.date_planned = ''
      this.strtipModifyform.criteria_planned = ''
      this.strtipModifyform.id = ''
      this.strtipModifyform.plan = []
      this.strtipModifyform.achive = []
      this.listOfFiles_plan = []
      this.listOfFiles_achive = []

    }
  
  }

  /////////////////////// End of edit form

  uploadFile(event: any) {
    if (event.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.importData = event.target.files[0];
      this.filen = event.target.files[0].name;
      this.toastrService.success("File Saved Successfully", '', {
        timeOut: 2000,
      });
      if (this.importData != null) {
        this.excelIcon = true;
      }
    } else {
      this.filen = "Choose file";
      this.toastrService.error("Please Choose a XLSX/CSV File", '', {
        timeOut: 2000,
      });
    }
  }

  importUser() {
    if (this.importData != null) {
      this.toastrService.success("File Uploaded Successfully", '', {
        timeOut: 2000,
      });
    } else {
      this.toastrService.error("Please Choose any file", '', {
        timeOut: 2000,
      });
    }
  }

  setSizeofCanvas() {
    let distance = this.unitArray[this.unitArray.length-1] - this.unitArray[0]
    this.canvasWidth = (distance / this.graphUnitScope) * this.UnitBlockSizeInPX // 20 Is per unit box width in PX
    if (this.canvasWidth >= 32500) {
      this.UnitBlockSizeInPX = this.UnitBlockSizeInPX * 0.8
      this.setSizeofCanvas()

    }
    else if (this.canvasWidth <= 10000) {
      this.UnitBlockSizeInPX = this.UnitBlockSizeInPX * 1.2
      this.setSizeofCanvas()
    } else {
      var hightIndex = 4
      for (var i = 0; i < this.StripDetails.length; i++) {
        hightIndex++
        for (let j = 0; j < this.StripDetails[i].children.length; j++) {
          hightIndex++
        }
      }
      this.canvasHeight = hightIndex * this.stripHeight
      if (this.canvasWidth < 32500 && this.canvasWidth > 10000) {
        setTimeout(() => {
          this.appendCanvasComponent = true 
        }, 100)
      }
    }
  }

  handleUpload(event:any,scope:any) {
    this.strtipModifyform[scope] = []
    for(let i=0;i<event.target.files.length;i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let replacestring = 'data:' +file.type +';base64,'
        let data = reader.result?.toString().replace(replacestring, '');
          this.strtipModifyform[scope].push(
            {
              'file_data':data,
              'mime_type':file.type
            }
          )
      };
    }
      for (var i = 0; i <= event.target.files.length - 1; i++) {
        var selectedFile = event.target.files[i];
        if(scope=='achive') {
          if (this.listOfFiles_achive.indexOf(selectedFile.name) === -1) {
            this.fileList_achive.push(selectedFile);
            this.listOfFiles_achive.push(selectedFile.name);
          }
        }
        if(scope=='plan') {
          if (this.listOfFiles_plan.indexOf(selectedFile.name) === -1) {
            this.fileList_plan.push(selectedFile);
            this.listOfFiles_plan.push(selectedFile.name);
          }  
        }
        
      }
  }

}
