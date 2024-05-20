import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConformationComponent } from './edit-conformation.component';

describe('EditConformationComponent', () => {
  let component: EditConformationComponent;
  let fixture: ComponentFixture<EditConformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
