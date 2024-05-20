import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameOfWorkComponent } from './name-of-work.component';

describe('NameOfWorkComponent', () => {
  let component: NameOfWorkComponent;
  let fixture: ComponentFixture<NameOfWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameOfWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameOfWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
