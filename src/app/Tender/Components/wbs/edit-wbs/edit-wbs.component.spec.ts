import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWbsComponent } from './edit-wbs.component';

describe('EditWbsComponent', () => {
  let component: EditWbsComponent;
  let fixture: ComponentFixture<EditWbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
