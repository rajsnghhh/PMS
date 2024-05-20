import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  procurementScope:any = ''
  constructor(
    private activeroute : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.procurementScope = this.activeroute.snapshot.paramMap.get('procurementScope')
  }

}
