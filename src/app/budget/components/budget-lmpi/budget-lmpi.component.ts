import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-budget-lmpi',
  templateUrl: './budget-lmpi.component.html',
  styleUrls: ['./budget-lmpi.component.scss']
})
export class BudgetLmpiComponent implements OnInit{
  TenderNumber:any = ''
  ProjectID:any = ''
  selectedTab='budget'

  @Input()
  disableModifyBoq!: any;

  @Input()
  selectedBOQ!: any;
  
  
  showLMPI=true

  constructor(
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.TenderNumber = this.route.snapshot.paramMap.get('tenderid');
    this.ProjectID = this.route.snapshot.paramMap.get('projectid');
  }
}
