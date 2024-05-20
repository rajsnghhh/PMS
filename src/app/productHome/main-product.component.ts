import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataSharedService } from '../Shared/Services/data-shared.service';
import { CommonFunctionService } from '../Shared/Services/common-function.service';
import { SidebarComponent } from '../Header/sidebar/sidebar.component';

@Component({
  selector: 'main-product',
  templateUrl: './main-product.component.html',
  styleUrls: ['./main-product.component.scss'],
})
export class MainProductComponent implements OnInit, AfterViewInit {

  
  @ViewChild('child') child!:SidebarComponent;
  readytoLoadHeader = false

  constructor(
    private titleService: Title,
    private dataShareService: DataSharedService,
    private commonFunction: CommonFunctionService,
    private cdRef:ChangeDetectorRef
  ) {
    this.titleService.setTitle("PMS");
  }

  ngOnInit(): void {
    this.dataShareService.saveLocalData('activeProduct', 'pms');
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
 
  openSFT() {
    this.commonFunction.takeToSFT()
  }

  sidebarLoaded(data:any) {
    this.readytoLoadHeader = data
  }

  openNav(data: any) {    
    this.child.openNav(data);
    var main = <HTMLVideoElement>document.querySelector('#main')

    if (data == true) {
      main.style.marginLeft = "230px";
      main.style.width = "calc(100% - 230px)";
    } else {
      main.style.marginLeft = "50px";
      main.style.width = "calc(100% - 50px)";
    }
  }


}
