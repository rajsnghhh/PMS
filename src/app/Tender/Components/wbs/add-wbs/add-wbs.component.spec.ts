import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWbsComponent } from './add-wbs.component';

describe('AddWbsComponent', () => {
  let component: AddWbsComponent;
  let fixture: ComponentFixture<AddWbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
