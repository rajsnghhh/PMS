import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-road-work',
  templateUrl: './road-work.component.html',
  styleUrls: [
    './road-work.component.scss',
    '../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../assets/scss/survey-common.scss',
    '../../../../../../assets/scss/survey-offcanvas.scss'
  ]
})
export class RoadWorkComponent implements OnInit {

  collectKM = 0;
  activefrom = 'roadWork'
  values:any = [];
  constructor() { }
  ngOnInit(): void {
    // this.activefrom = 'roadWork'
    this.addvalue()
  }

  changeNav(activeNav:string) {
    this.activefrom = activeNav;
  }

  removevalue(i:number){
    this.values.splice(i,1);
  }

  addvalue(){
    this.values.push({value: ""});
  }

  collectKMData() {
    this.collectKM = 1;
  }

  afterCollectedKMData() {
    this.collectKM = 2;
  }
}
