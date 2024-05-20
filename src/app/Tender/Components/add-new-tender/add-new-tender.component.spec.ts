import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTenderComponent } from './add-new-tender.component';

describe('AddNewTenderComponent', () => {
  let component: AddNewTenderComponent;
  let fixture: ComponentFixture<AddNewTenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewTenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewTenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
