import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { EditConformationComponent } from './edit-conformation/edit-conformation.component';
import { EditUserEventComponent } from './edit-user-event/edit-user-event/edit-user-event.component';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss',
  '../../../../../assets/scss/from-coomon.scss'
]
})
export class EditEventComponent implements OnInit {

  @Output()
  parentFun = new EventEmitter<string>();
  
  @ViewChild('editConfirmation')
  editConfirmation!: EditConformationComponent;

  @ViewChild('editUserEvent')
  editUserEvent!: EditUserEventComponent;

  selectedNodeID: any;
  eventType:any;
  showeventTypeError: any;

 
  constructor(
    private apiservice: APIService
  ) { }

  ngOnInit(): void {
  }

  getData(selectID: any) {
    this.selectedNodeID = selectID;
    let params = new URLSearchParams();
    params.set('id',selectID);
    this.apiservice.getTenderEvent(params).subscribe(data=>{
      this.eventType=data.event_type;
    });
    setTimeout(() =>{
      this.editConfirmation.getPrevData(selectID);
    }, 800);
  }
  getUserEventData(selectID: any) {
    this.selectedNodeID = selectID;
    let params = new URLSearchParams();
    params.set('id',selectID);
    this.apiservice.getTenderEvent(params).subscribe(data=>{
      this.eventType=data.event_type;
    });
    setTimeout(() =>{
      this.editUserEvent.getIUserEventPrevData(selectID);
    }, 800);
  }
 
  proceedNext() {
    if (this.eventType == '') {
      this.showeventTypeError = true
    } else {
      this.showeventTypeError = false
    }
  }
  changeTemplate() {

  }
  
  closeCanvas() {
    this.parentFun.emit()
  }


 
}
