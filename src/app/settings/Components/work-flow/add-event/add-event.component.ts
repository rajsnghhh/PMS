import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss',
    '../../../../../assets/scss/from-coomon.scss'
  ]
})
export class AddEventComponent implements OnInit {
  @Output()
  parentFun = new EventEmitter<string>();

  selectedNodeID = ''
  showeventTypeError = false;
  eventType = ''

  constructor(
    private datashareService: DataSharedService
  ) { }
  ngOnInit(): void {
  }

  getData(selectID:any) {
    this.selectedNodeID = selectID;
    this.datashareService.saveLocalData('tenderNodeId',selectID)
    this.eventType = ''
  }

  proceedNext() {
    if (this.eventType == '') {
      this.showeventTypeError = true
    } else {
      this.showeventTypeError = false
    }
  }
  changeTemplate() {
    this.datashareService.saveLocalData('getEventType',this.eventType)
  }

  closeCanvas() {
    this.parentFun.emit()
  }

}
