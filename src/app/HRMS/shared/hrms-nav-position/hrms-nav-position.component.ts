import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hrms-nav-position',
  templateUrl: './hrms-nav-position.component.html',
  styleUrls: ['./hrms-nav-position.component.scss']
})
export class HrmsNavPositionComponent implements OnInit {
  constructor(public router: Router) { }
  datetime:any
  ngOnInit(): void {
    this.getTime()
  }

  getTime() {
    this.datetime = new Date()
    setTimeout(()=>{
      this.getTime()
    }, 1000); 
  }
}
