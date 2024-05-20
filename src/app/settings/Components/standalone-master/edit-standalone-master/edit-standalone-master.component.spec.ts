import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStandaloneMasterComponent } from './edit-standalone-master.component';

describe('EditStandaloneMasterComponent', () => {
  let component: EditStandaloneMasterComponent;
  let fixture: ComponentFixture<EditStandaloneMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStandaloneMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStandaloneMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
