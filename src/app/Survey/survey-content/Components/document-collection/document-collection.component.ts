import { Component, OnInit } from '@angular/core';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-document-collection',
  templateUrl: './document-collection.component.html',
  styleUrls: [
    './document-collection.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/survey-common.scss',
    '../../../../../assets/scss/survey-offcanvas.scss'
  ]
})
export class DocumentCollectionComponent implements OnInit {
  AddNew:boolean=false;
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

  

  DPRfileList: File[] = [];
  GADfileList: File[] = [];
  LSectionfileList: File[] = [];
  STRfileList: File[] = [];
  IrrigationfileList: File[] = [];
  PanchayatMeetfileList: File[] = [];
  PradhanMeetfileList: File[] = [];
  TalkContractorsfileList: File[] = [];
  PhotographsfileList: File[] = [];

  listOfDPRFiles: any[] = [];
  listOfGADFiles: any[] = [];
  listOfLSectionFiles: any[] = [];
  listOfSTRFiles: any[] = [];
  listOfIrrigationFiles: any[] = [];
  listOfPanchayatMeetFiles: any[] = [];
  listOfPradhanMeetFiles: any[] = [];
  listOfTalkContractorsFiles: any[] = [];
  listOfPhotographsFiles: any[] = [];


  isLoading = false;

  onDPRFileChanged(event: any) {
    this.isLoading = true;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfDPRFiles.indexOf(selectedFile.name) === -1) {
        this.DPRfileList.push(selectedFile);
        this.listOfDPRFiles.push(selectedFile.name);
      }
    }
    this.isLoading = false;
  }
  onGADFileChanged(event: any) {
    this.isLoading = true;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfGADFiles.indexOf(selectedFile.name) === -1) {
        this.GADfileList.push(selectedFile);
        this.listOfGADFiles.push(selectedFile.name);
      }
    }
    this.isLoading = false;
  }
  onLSectionFileChanged(event: any) {
    this.isLoading = true;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfLSectionFiles.indexOf(selectedFile.name) === -1) {
        this.LSectionfileList.push(selectedFile);
        this.listOfLSectionFiles.push(selectedFile.name);
      }
    }
    this.isLoading = false;
  }
  onSTRFileChanged(event: any) {
    this.isLoading = true;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfSTRFiles.indexOf(selectedFile.name) === -1) {
        this.STRfileList.push(selectedFile);
        this.listOfSTRFiles.push(selectedFile.name);
      }
    }
    this.isLoading = false;
  }
  onIrrigationFileChanged(event: any) {
    this.isLoading = true;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfIrrigationFiles.indexOf(selectedFile.name) === -1) {
        this.IrrigationfileList.push(selectedFile);
        this.listOfIrrigationFiles.push(selectedFile.name);
      }
    }
    this.isLoading = false;
  }
  onPanchayatMeetFileChanged(event: any) {
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
  


  removeSelectedDPRFile(index:number) {
    // Delete the item from fileNames list
    this.listOfDPRFiles.splice(index, 1);
    // delete file from FileList
    this.DPRfileList.splice(index, 1);
  }
  removeSelectedGADFile(index:number) {
    this.listOfGADFiles.splice(index, 1);
    this.GADfileList.splice(index, 1);
  }
  removeSelectedLSectionFile(index:number) {
    this.listOfLSectionFiles.splice(index, 1);
    this.LSectionfileList.splice(index, 1);
  }
  removeSelectedSTRFile(index:number) {
    this.listOfSTRFiles.splice(index, 1);
    this.STRfileList.splice(index, 1);
  }
  removeSelectedIrrigationFile(index:number) {
    this.listOfIrrigationFiles.splice(index, 1);
    this.IrrigationfileList.splice(index, 1);
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
    // Delete the item from fileNames list
    this.listOfTalkContractorsFiles.splice(index, 1);
    // delete file from FileList
    this.TalkContractorsfileList.splice(index, 1);
  }
  removeSelectedPhotographsFile(index:number) {
    // Delete the item from fileNames list
    this.listOfPhotographsFiles.splice(index, 1);
    // delete file from FileList
    this.PhotographsfileList.splice(index, 1);
  }
 
  
  viewSelectedDPRFile(index:number) {
  }
  viewSelectedGADFile(index:number) {   
  }
  viewSelectedLSectionFile(index:number){
  }
  viewSelectedSTRFile(index:number){
  }
  viewSelectedIrrigationFile(index:number){
  }
  viewSelectedPanchayatMeetFile(index:number){
  }
  viewSelectedPradhanMeetFile(index:number){
  }
  viewSelectedTalkContractorsFile(index:number) {
  }
  viewSelectedPhotographsFile(index:number) {
  }

  ngOnInit(): void {
  }

  proceedNext() {
    this.navservice.changeNav('localData');
  }

  GoBack() {
    this.navservice.changeNav('nameofWork');
  }
}
