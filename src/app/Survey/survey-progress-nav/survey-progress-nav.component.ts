import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-survey-progress-nav',
  templateUrl: './survey-progress-nav.component.html',
  styleUrls: ['./survey-progress-nav.component.scss']
})
export class SurveyProgressNavComponent implements OnInit {
  currentNav:any;
  @Input()
  dataList!: any[];

  constructor(
    private navservice:NavigationService,
  ) {
    this.navservice.currentNav().subscribe(data => {  
      this.currentNav = data;
    }, err => {
      this.currentNav = '0';
    });
  }

  ngOnInit(): void {
    this.changeNav(0)
  }

  changeNav(nav:any) {
    this.navservice.changeNav(nav);
  }

}
