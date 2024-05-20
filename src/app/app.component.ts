import { Component, HostListener, OnInit } from '@angular/core';
import { PmsLoaderService } from './Shared/Services/pms-loader.service';
import { PmsDocPreviewService } from './Shared/Services/pms-doc-preview.service';
declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showLoader = false;
  dataModal: any;
  loaderMessage = ''
  ShowFileType = '';
  supportedTypes = ['pdf','png','jpg','jpeg']
  url:any = ''
  fileData:any = ''
  title = 'sft-pms';
  constructor(
    private loaderservice: PmsLoaderService,
    private docpreviewservice: PmsDocPreviewService
  ) {

    this.docpreviewservice.getDocData().subscribe(status => {
      setTimeout(() => {
        if (status.showStatus) {
          this.dataModal.show()
          this.url = status.url
          this.fileData = status.data
          this.ShowFileType = status.url.split('.').pop().toLowerCase()
        }
        if( this.url == '' && (typeof this.fileData?.name === 'string' || this.fileData?.name instanceof String) ) {
          this.ShowFileType = this.fileData.name.split('.').pop().toLowerCase()
          var reader = new FileReader();
          reader.readAsDataURL(this.fileData);
          reader.onload = (event) => {
            this.url = reader.result;
          }
        }
      }, 0)
    });

    this.loaderservice.loaderStatus().subscribe(status => {
      setTimeout(() => {
        this.showLoader = status;
      }, 0)
    });
    this.loaderservice.loaderMsg().subscribe(msg => {
      setTimeout(() => {
        this.loaderMessage = msg;
      }, 0)
    });

  }

  ngOnInit(): void {
    this.setupModal()
    // this.loaderservice.showWithMessage('Please wait')
    // setTimeout(() => {
    //   this.loaderservice.hide()
    // }, 1000)
  }

  closeDoc() {
    this.docpreviewservice.hideData()
  }

  downloadUrl(url:any,filename:any) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  }

  setupModal() {
    this.dataModal = new window.bootstrap.Modal(
      document.getElementById('viewDPRDoc')
    );
  }

  @HostListener('window:popstate', ['$event'])

  onPopState(event: any) {
    //Detect Browser Forward and Back Button click
    window.location.reload();
  }

}
