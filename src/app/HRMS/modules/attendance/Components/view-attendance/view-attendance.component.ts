import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewFortnightComponent } from '../view-fortnight/view-fortnight.component';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss']
})
export class ViewAttendanceComponent implements OnInit {

  @ViewChild('changeMonth')
  changeMonth!: ViewFortnightComponent;

  ngOnInit() {
    
  }
  funcParent(event:any){
    this.changeMonth.getData(event);
  }
}
