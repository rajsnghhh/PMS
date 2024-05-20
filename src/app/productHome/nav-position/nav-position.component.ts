import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-nav-position',
  templateUrl: './nav-position.component.html',
  styleUrls: ['./nav-position.component.scss']
})
export class NavPositionComponent implements OnInit {


  constructor(
    public router: Router,
  ) { }
  ngOnInit(): void {
    
  }

  
  
}
