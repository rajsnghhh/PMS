import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bridge-work',
  templateUrl: './bridge-work.component.html',
  styleUrls: [
    './bridge-work.component.scss',
    '../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../assets/scss/survey-common.scss'
  ]
})
export class BridgeWorkComponent implements OnInit {
  activefrom = ''
  values:any = [];
  constructor() { }

  ngOnInit(): void {
    this.activefrom = 'Bridgework'
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

}
