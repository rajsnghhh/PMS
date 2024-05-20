import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediclaimComponent } from './mediclaim.component';

describe('MediclaimComponent', () => {
  let component: MediclaimComponent;
  let fixture: ComponentFixture<MediclaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediclaimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
