import { Component, OnInit } from '@angular/core';
import { PmsDocPreviewService } from 'src/app/Shared/Services/pms-doc-preview.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    private docpreviewservice:PmsDocPreviewService
  ) {

  }

  ngOnInit(): void {
    
    // this.docpreviewservice.showDoc('http://localhost:4200/assets/Logo/Group%20609.png','')
  }

}
