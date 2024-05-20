import { Component, OnInit } from '@angular/core';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss',
    '../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../assets/scss/survey-common.scss']
})
export class ContactDetailComponent implements OnInit {

  constructor(private datasharedservice:DataSharedService) { }

  ngOnInit(): void {
  }

  addContact(){
    this.datasharedservice.setObservableData('true');
  }
}
