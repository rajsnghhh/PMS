import { Component, OnInit } from '@angular/core';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';
declare var window: any;

@Component({
  selector: 'app-local-data',
  templateUrl: './local-data.component.html',
  styleUrls: ['./local-data.component.scss',
  '../../../../../assets/scss/from-coomon.scss',
  '../../../../../assets/scss/survey-common.scss',
  '../../../../../assets/scss/survey-offcanvas.scss']
})
export class LocalDataComponent implements OnInit {
  AddNew:boolean=false;
  dataModal:any
  PanchayatMeetURL:any;
  PradhanMeetFileURL:any;
  TalkContractorsURL:any;
  PhotographsFileURL:any;
  ShowFileType:any;
  constructor(
    private navservice:NavigationService,
    private datasharedservice:DataSharedService

  ) {
    this.datasharedservice.getObservableData().subscribe(newContactData => {
      if (newContactData) {
        this.AddNew = newContactData;
      }
    });
   }

   PanchayatMeetfileList: File[] = [];
   PradhanMeetfileList: File[] = [];
   TalkContractorsfileList: File[] = [];
   PhotographsfileList: File[] = [];
   url:any;


   listOfPanchayatMeetFiles: any[] = [];
   listOfPradhanMeetFiles: any[] = [];
   listOfTalkContractorsFiles: any[] = [];
  listOfPhotographsFiles: any[] = [];


  isLoading = false;

  ngOnInit(): void {
    this.setupModal()
  }
  onPanchayatMeetFileChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.PanchayatMeetURL = reader.result;
      }
    }

    this.isLoading = true;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfPanchayatMeetFiles.indexOf(selectedFile.name) === -1) {
        this.PanchayatMeetfileList.push(selectedFile);
        this.listOfPanchayatMeetFiles.push(selectedFile.name);
      }
    }
    this.isLoading = false;
  }
  onPradhanMeetFileChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.PradhanMeetFileURL = reader.result;
      }
    }
    this.isLoading = true;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfPradhanMeetFiles.indexOf(selectedFile.name) === -1) {
        this.PradhanMeetfileList.push(selectedFile);
        this.listOfPradhanMeetFiles.push(selectedFile.name);
      }
    }
    this.isLoading = false;
  }
  onTalkContractorsFileChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.TalkContractorsURL = reader.result;
      }
    }
    this.isLoading = true;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfTalkContractorsFiles.indexOf(selectedFile.name) === -1) {
        this.TalkContractorsfileList.push(selectedFile);
        this.listOfTalkContractorsFiles.push(selectedFile.name);
      }
    }
    this.isLoading = false;
  }
  onPhotographsFileChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.PhotographsFileURL = reader.result;
      }
    }
    this.isLoading = true;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfPhotographsFiles.indexOf(selectedFile.name) === -1) {
        this.PhotographsfileList.push(selectedFile);
        this.listOfPhotographsFiles.push(selectedFile.name);
      }
    }
    this.isLoading = false;
  }


  removeSelectedPanchayatMeetFile(index:number) {
    this.listOfPanchayatMeetFiles.splice(index, 1);
    this.PanchayatMeetfileList.splice(index, 1);
  }
  removeSelectedPradhanMeetFile(index:number) {
    this.listOfPradhanMeetFiles.splice(index, 1);
    this.PradhanMeetfileList.splice(index, 1);
  }
  removeSelectedTalkContractorsFile(index:number) {
    this.listOfTalkContractorsFiles.splice(index, 1);
    this.TalkContractorsfileList.splice(index, 1);
  }
  removeSelectedPhotographsFile(index:number) {
    // Delete the item from fileNames list
    this.listOfPhotographsFiles.splice(index, 1);
    // delete file from FileList
    this.PhotographsfileList.splice(index, 1);
  }

  setupModal() {
    this.dataModal = new window.bootstrap.Modal(
      document.getElementById('viewDPRDoc')
    );
  }


  viewSelectedPanchayatMeetFile(index:number,fileType:any){
    let type = fileType.split('.').pop();
    this.ShowFileType=type;
    this.url=this.PanchayatMeetURL;
    this.dataModal.show();
  }
  viewSelectedPradhanMeetFile(index:number,fileType:any){
    let type = fileType.split('.').pop();
    this.ShowFileType=type;
    this.url=this.PradhanMeetFileURL;
    this.dataModal.show();
  }
  viewSelectedTalkContractorsFile(index:number,fileType:any){
    let type = fileType.split('.').pop();
    this.ShowFileType=type;
    this.url=this.TalkContractorsURL;
    this.dataModal.show();
  }
  viewSelectedPhotographsFile(index:number,fileType:any){
    let type = fileType.split('.').pop();
    this.ShowFileType=type;
    this.url=this.PhotographsFileURL;
    this.dataModal.show();
  }


  proceedNext() {
    this.navservice.changeNav('competitionAnalysis');
  }

  GoBack() {
    this.navservice.changeNav('documentCollection');
  }
}
