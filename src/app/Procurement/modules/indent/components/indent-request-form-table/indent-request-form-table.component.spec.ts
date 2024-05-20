import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentRequestFormTableComponent } from './indent-request-form-table.component';

describe('IndentRequestFormTableComponent', () => {
  let component: IndentRequestFormTableComponent;
  let fixture: ComponentFixture<IndentRequestFormTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentRequestFormTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentRequestFormTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
