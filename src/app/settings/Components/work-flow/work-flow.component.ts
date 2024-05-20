import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { AddEventComponent } from './add-event/add-event.component';
import { AddNotificationComponent } from './add-notification/add-notification.component';
import { EditNotificationComponent } from './edit-notification/edit-notification.component';
import { EditEventComponent } from './edit-event/edit-event.component';
declare var window: any;

@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.scss',
  '../../../../assets/scss/scrollableTable.scss']
})
export class WorkFlowComponent implements OnInit {
  @ViewChild('addNotificationComponent')
  addNotificationComponent!: AddNotificationComponent;

  @ViewChild('editNotificationComponent')
  editNotificationComponent!: EditNotificationComponent;

  @ViewChild('editEventComponent')
  editEventComponent!: EditEventComponent;
  

  @ViewChild('addEventComponent')
  addEventComponent!: AddEventComponent;
  selectedID = ''
  constructor(
    private apiservice: APIService,
    private toastrService: ToastrService,
    private datasharedservice: DataSharedService
  ) { }

  workflowData: any = []
  WORK_FLOW_HTML = ''
  localStorageData: any;
  ADDNOTIFICATIONcanvas:any;
  ADDEVENTcanvas:any;
  editCanvas:any;
  editEventCanvas:any;
  deleteNotificationModal:any
  deleteEventModal:any

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.setUpModalCanvas()
    this.getWorkflowData()
  }

  setUpModalCanvas() {
    this.ADDNOTIFICATIONcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightaddNotification')
    );

    this.ADDEVENTcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightaddEvent')
    );

    this.editCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRighteditNotification')
    );
    this.editEventCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRighteditEvent')
    );

    this.deleteNotificationModal = new window.bootstrap.Modal(
      document.getElementById('deleteNofification')
    );
    this.deleteEventModal = new window.bootstrap.Modal(
      document.getElementById('deleteEvent')
    );

  }

  getWorkflowData() {

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.apiservice.getWorkFlowData(params).subscribe(data => {
      this.WORK_FLOW_HTML = ''
      this.generateWorkflowHTML(data[0])
    })
  }

  generateWorkflowHTML(data: any) {
    let nodeType = ''
    let actiontemplate = ''
    let NodeNotifications = ''
    let NodeEvent =''
    let roratetontent = ''
    
    if(data.notifications_list.length > 0) {
      NodeNotifications = '<div class="notifications-actions"><h4>Notifications :</h4><div class="notifications-list">'
      for(let i=0;i<data.notifications_list.length;i++) {
        let listData:any = data.notifications_list[i];
        NodeNotifications += '<div class="list"><div class="header">Type :</div> '+listData.notification_type+ '<div class="header" >Trigger :</div> '+listData.trigger_type+' <img class="clickimage EDITNOTIFICATION" C_id=' + data.id + ' N_id=' + listData.id + ' src="assets/icons/editing.png" alt=""> <img class="clickimage DELNOTIFICATION" C_id=' + data.id + ' N_id=' + listData.id + ' src="assets/icons/delete1.png" alt=""></div>'
      }
      NodeNotifications += '</div></div>'
    }
    if(data.event_list.length > 0) {
      NodeEvent = '<div class="notifications-actions"><h4>Events :</h4><div class="notifications-list">'
      for(let i=0;i<data.event_list.length;i++) {
        let eventlistData:any = data.event_list[i];
        NodeEvent += '<div class="list"><div class="header">Name :</div> '+eventlistData.event_name+ '<div class="header" >Priority :</div> '+eventlistData.priority+' <img class="clickimage EDITEVENT" C_id=' + data.id + ' N_id=' + eventlistData.id + ' src="assets/icons/editing.png" alt=""> <img class="clickimage DELEVENT" C_id=' + data.id + ' N_id=' + eventlistData.id + ' src="assets/icons/delete1.png" alt=""></div>'
      }
      NodeEvent += '</div></div>'
    }
    
    // Action on Bottom
    actiontemplate = '<div class="Add-actions"> <div class="add ADDNOTIFICATION" C_id=' + data.id + '><img class="add ADDNOTIFICATION" C_id=' + data.id + ' src="assets/icons/add-white.png" alt="">Add Notification</div> <div class="add ADDEVENT" C_id=' + data.id + '><img class="add ADDEVENT" C_id=' + data.id + ' src="assets/icons/add-white.png" alt="">Add Event</div></div>'
    
    if (data.action_type == 'start') {
      nodeType = 'start-node'
      actiontemplate = ''
      NodeNotifications = ''
      NodeEvent =''
    }
    if (data.action_type == 'conditional') {
      nodeType = 'conditional-node'
      roratetontent = 'roratetontent'
      actiontemplate = ''
      NodeNotifications = ''
      NodeEvent =''
    }

    
    this.WORK_FLOW_HTML += '<ul> <li class="' + roratetontent + '"> <a class="' + nodeType + '"><span> ' + data.step_name + ' </span> ' + NodeNotifications + NodeEvent + actiontemplate + '</a>'
    if (data.children.length == 1) {
      this.generateWorkflowHTML(data.children[0])
    } if (data.children.length > 1) {
      if (data.action_type == 'conditional') {
        this.WORK_FLOW_HTML += '<ul class="rotate-back">'
      } else {
        this.WORK_FLOW_HTML += '<ul class="">'
      }
      for (let i = 0; i < data.children.length; i++) {
        this.WORK_FLOW_HTML += '<li>'
        this.generateWorkflowHTML(data.children[i])
        this.WORK_FLOW_HTML += '</li>'
      }
      this.WORK_FLOW_HTML += '</ul>'
    }
    this.WORK_FLOW_HTML += '</li></ul>'
  }

  workflowEvent(input: any, e: MouseEvent): void {
    input.helpOpen = !input.helpOpen;
    let targetclasslist = (e.target as HTMLElement).className.split(" ")
    
    if (targetclasslist.includes('ADDNOTIFICATION')) {
      let target = e.target as HTMLElement;
      this.addNotification(target.getAttribute('C_id'))
    }

    if (targetclasslist.includes('ADDEVENT')) {
      let target = e.target as HTMLElement;
      this.addEvent(target.getAttribute('C_id'))
    }

    if (targetclasslist.includes('EDITNOTIFICATION')) {
      let target = e.target as HTMLElement;
      this.editNotification(target.getAttribute('N_id'))
    }
    if (targetclasslist.includes('EDITEVENT')) {
      let target = e.target as HTMLElement;
      this.editEvent(target.getAttribute('N_id'))
    }

    if (targetclasslist.includes('DELNOTIFICATION')) {
      let target = e.target as HTMLElement;
      this.delNotification(target.getAttribute('N_id'))
    }
    if (targetclasslist.includes('DELEVENT')) {
      let target = e.target as HTMLElement;
      this.delEvent(target.getAttribute('N_id'))
    }
    
  }

  addEvent(id: any) {
    this.addEventComponent.getData(id)
    this.ADDEVENTcanvas.show()
  }

  addNotification(id: any) {
    this.addNotificationComponent.getData(id)
    this.ADDNOTIFICATIONcanvas.show()
  }

  editNotification(id: any) {
    this.selectedID = id;
    this.editNotificationComponent.getData(id)
    this.editCanvas.show();
  }
  editEvent(id: any) {
    this.selectedID = id;
    this.editEventComponent.getData(id);
    this.editEventComponent.getUserEventData(id);
    this.editEventCanvas.show();
  }

  delNotification(id: any) {
    this.selectedID = id;
    this.deleteNotificationModal.show()
  }
  delEvent(id: any) {
    this.selectedID = id;
    this.deleteEventModal.show()
  }

  deleteNotification() {

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('method', 'delete');
    params.set('id', this.selectedID);
    this.apiservice.updateNotification(params).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getWorkflowData()
    }, err => {
      if (err.error.msg) {
        this.toastrService.error(err.error.msg, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
    })
  }
  deleteEvent(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('method', 'delete');
    params.set('id', this.selectedID);
    this.apiservice.deleteEvent(params).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getWorkflowData()
    }, err => {
      if (err.error.msg) {
        this.toastrService.error(err.error.msg, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
    })
  }

  closeRoleCanvas() {
    this.getWorkflowData()
    this.ADDEVENTcanvas.hide()
    this.editCanvas.hide();
    this.editEventCanvas.hide();
    this.ADDNOTIFICATIONcanvas.hide()
  }
}
