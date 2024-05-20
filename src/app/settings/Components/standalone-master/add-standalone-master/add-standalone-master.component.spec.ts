import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStandaloneMasterComponent } from './add-standalone-master.component';

describe('AddStandaloneMasterComponent', () => {
  let component: AddStandaloneMasterComponent;
  let fixture: ComponentFixture<AddStandaloneMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStandaloneMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStandaloneMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
